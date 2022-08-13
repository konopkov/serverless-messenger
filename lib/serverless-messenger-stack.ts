import { CfnOutput, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

import { AppSync } from './appsync-construct';
import { DynamoDbTable } from './dynamo-table-construct';
import { DebugLambda, Lambda } from './lambda-construct';
import { ServiceProps } from './models/service-props';
import { Resolvers } from './resolvers-construct';
import { SES } from './ses-construct';
import { SNS } from './sns-construct';

import type { Construct } from 'constructs';

const LambdaConstruct = process.env.DEBUG ? DebugLambda : Lambda;

interface ServerlessMessengerStackProps extends ServiceProps {
    readonly serviceName: string;
    readonly stage: string;
    readonly snsRegion: string;
    readonly sesRegion: string;
    readonly defaultEmailFrom: string;
    readonly region: string;
}

export class ServerlessMessengerStack extends Stack {
    private _serviceProps: ServerlessMessengerStackProps;
    readonly appSyncLambdaId: string;
    readonly appSyncApiId: string;

    constructor(scope: Construct, id: string, props: ServerlessMessengerStackProps) {
        super(scope, id, props);

        this._serviceProps = props;

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

        // DynamoDb Table
        const dynamoDbTableId = this.constructId('dynamo-db');
        const { table: dynamoDbTable, policyStatement: dynamoStatement } = new DynamoDbTable(this, dynamoDbTableId, {
            pk: 'PK',
            sk: 'SK',
        });

        // Lambda
        const appSyncLambdaId = this.constructId('graphql-handler');
        this.appSyncLambdaId = appSyncLambdaId;
        const { lambda: appSyncLambda } = new LambdaConstruct(this, appSyncLambdaId, {
            ...props,
            handler: 'graphql.ts',
            environment: {
                SERVICE_NAME: props.serviceName,
                SNS_REGION: props.snsRegion,
                SES_REGION: props.sesRegion,
                TABLE_NAME: dynamoDbTable.tableName,
                DEFAULT_EMAIL_FROM: props.defaultEmailFrom,
            },
        });
        appSyncLambda.grantInvoke(defaultRole);

        const { policyStatement: snsStatement } = new SNS(this, this.constructId('sns-publish-statement'));
        const { policyStatement: sesStatement } = new SES(this, this.constructId('ses-publish-statement'));

        const appSyncLambdaPolicyId = this.constructId('appsync-lambda-policy');
        const policy = new iam.Policy(this, appSyncLambdaPolicyId, {
            statements: [snsStatement, sesStatement, dynamoStatement],
        });

        policy.attachToRole(<iam.IRole>appSyncLambda.role);

        // AppSync
        const appsyncApiId = this.constructId('appsync-api');
        const { graphqlApi, lambdaDataSource, apiKey } = new AppSync(this, appsyncApiId, {
            ...props,
            lambdaArn: appSyncLambda.functionArn,
            role: defaultRole,
        });
        this.appSyncApiId = graphqlApi.attrApiId;

        // Resolvers
        const resolversId = this.constructId('appsync-resolvers');
        const { resolvers } = new Resolvers(this, resolversId, {
            ...props,
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
            exportName: `graphQLUrl${props.stage}`,
        });

        const apiKeyOutputId = this.constructId('api-key-value');
        const apiKeyOutput = new CfnOutput(this, apiKeyOutputId, {
            value: apiKey.attrApiKey,
            description: 'API key value',
            exportName: `apiKeyValue${props.stage}`,
        });
    }

    private constructId(name: string) {
        const { serviceName, stage } = this._serviceProps;

        return `${serviceName}-${name}-${stage}`;
    }
}
