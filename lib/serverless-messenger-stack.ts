import { CfnOutput, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

import { AppSync } from './appsync-construct';
import { DebugLambda, Lambda } from './lambda-construct';
import { Resolvers } from './resolvers-construct';
import { SES } from './ses-construct';
import { SNS } from './sns-construct';

import type { EnvVariables } from '../src/shared/models/env-variables';
import type { ServiceProps } from './models';
import type { Construct } from 'constructs';
import type { StackProps } from 'aws-cdk-lib';

const LambdaConstruct = process.env.DEBUG ? DebugLambda : Lambda;

export class ServerlessMessengerStack extends Stack {
    private _serviceProps: ServiceProps;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Deployment properties
        const { STAGE = 'dev', SNS_REGION = 'us-east-1', SES_REGION = 'eu-west-1' } = process.env as EnvVariables;

        this._serviceProps = {
            serviceName: 'serverless-messenger',
            stage: STAGE,
            region: props?.env?.region || 'eu-central-1',
        };

        // IAM Role
        const defaultRoleId = this.constructId('default-role');
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
        const appSyncLambdaId = this.constructId('graphql-handler');
        const { lambda: appSyncLambda } = new LambdaConstruct(this, appSyncLambdaId, {
            ...this._serviceProps,
            handler: 'graphql.ts',
            environment: {
                SERVICE_NAME: this._serviceProps.serviceName,
                SNS_REGION: SNS_REGION,
                SES_REGION: SES_REGION,
            },
        });
        appSyncLambda.grantInvoke(defaultRole);

        const { policyStatement: snsStatement } = new SNS(this, this.constructId('sns-publish-statement'));
        const { policyStatement: sesStatement } = new SES(this, this.constructId('ses-publish-statement'));

        const appSyncLambdaPolicyId = this.constructId('appsync-lambda-policy');
        const policy = new iam.Policy(this, appSyncLambdaPolicyId, {
            statements: [snsStatement, sesStatement],
        });

        policy.attachToRole(<iam.IRole>appSyncLambda.role);

        // AppSync
        const appsyncApiId = this.constructId('appsync-api');
        const { graphqlApi, lambdaDataSource, apiKey } = new AppSync(this, appsyncApiId, {
            ...this._serviceProps,
            lambdaArn: appSyncLambda.functionArn,
            role: defaultRole,
        });

        // Resolvers
        const resolversId = this.constructId('appsync-resolvers');
        const { resolvers } = new Resolvers(this, resolversId, {
            ...this._serviceProps,
            apiId: graphqlApi.attrApiId,
            dataSourceName: lambdaDataSource.attrName,
        });
        resolvers.forEach((resolver) => {
            resolver.addDependsOn(lambdaDataSource);
        });

        // CF Outputs
        const graphQlUrlOutputId = this.constructId('graphql-url');
        const graphQlUrlOutput = new CfnOutput(this, graphQlUrlOutputId, {
            value: graphqlApi.attrGraphQlUrl,
            description: 'GraphQL entrypoint',
            exportName: 'graphQLUrl',
        });

        const apiKeyOutputId = this.constructId('api-key-value');
        const apiKeyOutput = new CfnOutput(this, apiKeyOutputId, {
            value: apiKey.attrApiKey,
            description: 'API key value',
            exportName: 'apiKeyValue',
        });
    }
    private constructId(name: string) {
        const { serviceName, stage } = this._serviceProps;

        return `${serviceName}-${name}-${stage}`;
    }
}
