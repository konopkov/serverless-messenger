import * as appsync from 'aws-cdk-lib/aws-appsync';
import { Construct } from 'constructs';

import { Mutations } from '../src/graphql/mutations';
import { Queries } from '../src/graphql/queries';
import { ServiceProps } from './models/service-props';

interface ResolverProps extends ServiceProps {
    serviceName: string;
    stage: string;
    apiId: string;
    dataSourceName: string;
}

export class Resolvers extends Construct {
    public resolvers: appsync.CfnResolver[];

    constructor(scope: Construct, id: string, props: ResolverProps) {
        super(scope, id);

        const { serviceName, apiId, dataSourceName, stage } = props;

        const sendMessageResolverId = `${serviceName}-${Mutations.sendMessage}-${stage}`;
        const sendMessageResolver = new appsync.CfnResolver(this, sendMessageResolverId, {
            apiId: apiId,
            typeName: 'Mutation',
            fieldName: Mutations.sendMessage,
            dataSourceName: dataSourceName,
        });

        const getMessagesResolverId = `${serviceName}-${Queries.getMessages}-${stage}`;
        const getMessagesResolver = new appsync.CfnResolver(this, getMessagesResolverId, {
            apiId: apiId,
            typeName: 'Query',
            fieldName: Queries.getMessages,
            dataSourceName: dataSourceName,
        });

        this.resolvers = [sendMessageResolver, getMessagesResolver];
    }
}
