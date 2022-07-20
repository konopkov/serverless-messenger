import * as appsync from 'aws-cdk-lib/aws-appsync';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as fs from 'fs';
import * as path from 'path';

import { ServiceProps } from './models/service-props';

export interface AppSyncProps extends ServiceProps {
    lambdaArn: string;
    role: Role;
}

export class AppSync extends Construct {
    public readonly graphqlApi: appsync.CfnGraphQLApi;
    public readonly lambdaDataSource: appsync.CfnDataSource;
    public readonly apiKey: appsync.CfnApiKey;

    constructor(scope: Construct, id: string, props: AppSyncProps) {
        super(scope, id);

        const { serviceName, stage, lambdaArn, role } = props;
        const schemaPath = path.resolve(__dirname, '../src/graphql/schema.graphql');

        const graphqlApi = new appsync.CfnGraphQLApi(this, id, {
            name: id,
            authenticationType: 'API_KEY',
        });
        this.graphqlApi = graphqlApi;

        const appsyncApiKey = `${serviceName}-appsync-api-key-${stage}`;
        const apiKey = new appsync.CfnApiKey(this, appsyncApiKey, {
            apiId: graphqlApi.attrApiId,
        });
        this.apiKey = apiKey;

        const appsyncApiSchema = `${serviceName}-appsync-api-schema-${stage}`;
        const graphqlApiSchema = new appsync.CfnGraphQLSchema(this, appsyncApiSchema, {
            apiId: graphqlApi.attrApiId,
            definition: fs.readFileSync(schemaPath).toString(),
        });

        graphqlApiSchema.addDependsOn(graphqlApi);

        const appSyncLambdaDataSourceId = `${serviceName}-appsync-data-source-${stage}`;
        const appSyncLambdaDataSourceName = appSyncLambdaDataSourceId.replace(/-/g, '');
        const lambdaDataSource = new appsync.CfnDataSource(this, appSyncLambdaDataSourceId, {
            apiId: graphqlApi.attrApiId,
            name: appSyncLambdaDataSourceName,
            type: 'AWS_LAMBDA',
            lambdaConfig: {
                lambdaFunctionArn: lambdaArn,
            },
            serviceRoleArn: role.roleArn,
        });
        this.lambdaDataSource = lambdaDataSource;

        lambdaDataSource.addDependsOn(graphqlApi);
    }
}
