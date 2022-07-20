import { CfnOutput, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

import { AppSync } from './appsync-construct';
import { DebugLambda, Lambda } from './lambda-construct';
import { Resolvers } from './resolvers-construct';

import type { EnvVariables } from './models/env-variables';
import type { ServiceProps } from './models/service-props';
import type { Construct } from 'constructs';
import type { StackProps } from 'aws-cdk-lib';

const LambdaConstruct = process.env.DEBUG ? DebugLambda : Lambda;

export class ServerlessMessengerStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Deployment properties
        const { STAGE = 'dev', SNS_REGION = 'us-east-1', SES_REGION = 'eu-west-1' } = process.env as EnvVariables;

        const ServiceProps: ServiceProps = {
            serviceName: 'serverless-messenger',
            stage: STAGE,
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
        const { lambda: appSyncLambda } = new LambdaConstruct(this, appSyncLambdaId, {
            ...ServiceProps,
            handler: 'graphql.ts',
            environment: {
                SERVICE_NAME: ServiceProps.serviceName,
                SNS_REGION: SNS_REGION,
                SES_REGION: SES_REGION,
            },
        });
        appSyncLambda.grantInvoke(defaultRole);

        // AppSync
        const appsyncApiId = `${ServiceProps.serviceName}-appsync-api-${ServiceProps.stage}`;
        const { graphqlApi, lambdaDataSource, apiKey } = new AppSync(this, appsyncApiId, {
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

        // Sns publish statement
        const snsStatement = new iam.PolicyStatement({
            actions: ['SNS:Publish'],
            resources: ['*'],
        });

        // Sns publish statement
        const sesStatement = new iam.PolicyStatement({
            actions: ['SES:SendEmail'],
            resources: ['*'],
        });

        const appSyncLambdaPolicyId = `${ServiceProps.serviceName}-sns-policy-${ServiceProps.stage}`;
        const policy = new iam.Policy(this, appSyncLambdaPolicyId, {
            statements: [snsStatement, sesStatement],
        });

        policy.attachToRole(<iam.IRole>appSyncLambda.role);

        // CF Outputs
        const graphQlUrlOutputId = `${ServiceProps.serviceName}-graphql-url-${ServiceProps.stage}`;
        const graphQlUrlOutput = new CfnOutput(this, graphQlUrlOutputId, {
            value: graphqlApi.attrGraphQlUrl,
            description: 'GraphQL entrypoint',
            exportName: 'graphQLUrl',
        });

        const apiKeyOutputId = `${ServiceProps.serviceName}-api-key-value-${ServiceProps.stage}`;
        const apiKeyOutput = new CfnOutput(this, apiKeyOutputId, {
            value: apiKey.attrApiKey,
            description: 'API key value',
            exportName: 'apiKeyValue',
        });
    }
}
