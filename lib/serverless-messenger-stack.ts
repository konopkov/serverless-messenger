import { Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

import { AppSync } from './appsync-construct';
import { Lambda } from './lambda-construct';
import { ServiceProps } from './models/service-props';
import { Resolvers } from './resolvers-construct';

import type { Construct } from 'constructs';
import type { StackProps } from 'aws-cdk-lib';

export class ServerlessMessengerStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const ServiceProps: ServiceProps = {
            serviceName: 'serverless-messenger',
            stage: process.env.stage || 'dev',
            region: props?.env?.region || 'eu-central-1',
        };

        // IAM Role
        const defaultRoleId = `${ServiceProps.serviceName}-default-role-${ServiceProps.stage}`;
        const defaultRole = new iam.Role(this, defaultRoleId, {
            assumedBy: new iam.CompositePrincipal(
                new iam.ServicePrincipal('lambda.amazonaws.com'),
                new iam.ServicePrincipal('appsync.amazonaws.com'),
            ),
            description: 'Default role.',
            managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
            roleName: defaultRoleId,
        });

        // Lambda
        const appSyncLambdaId = `${ServiceProps.serviceName}-graphql-handler-${ServiceProps.stage}`;
        const { lambda: appSyncLambda } = new Lambda(this, appSyncLambdaId, {
            ...ServiceProps,
            handler: 'graphql.ts',
            environment: {
                SERVICE_NAME: ServiceProps.serviceName,
            },
        });
        appSyncLambda.grantInvoke(defaultRole);

        // AppSync
        const appsyncApiId = `${ServiceProps.serviceName}-appsync-api-${ServiceProps.stage}`;
        const { graphqlApi, lambdaDataSource } = new AppSync(this, appsyncApiId, {
            ...ServiceProps,
            lambdaArn: appSyncLambda.functionArn,
            role: defaultRole,
        });

        // Resolvers
        const resolversId = `${ServiceProps.serviceName}-appsync-resolvers-${ServiceProps.stage}`;
        const { resolvers } = new Resolvers(this, resolversId, {
            ...ServiceProps,
            apiId: graphqlApi.attrApiId,
            dataSourceName: lambdaDataSource.attrName,
        });
        resolvers.forEach((resolver) => {
            resolver.addDependsOn(lambdaDataSource);
        });
    }
}
