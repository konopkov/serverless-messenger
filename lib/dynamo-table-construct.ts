import assert from 'assert';
import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

interface DynamoDbTableProps {
    pk: string | [string, AttributeType];
    sk?: string | [string, AttributeType];
}

export class DynamoDbTable extends Construct {
    public readonly table: Table;
    public readonly policyStatement: iam.PolicyStatement;

    constructor(scope: Construct, id: string, props: DynamoDbTableProps) {
        super(scope, id);

        const { pk, sk } = props;

        const table = new Table(this, id, {
            partitionKey: this.constructKey(pk),
            sortKey: sk ? this.constructKey(sk) : undefined,
            tableName: id,
            billingMode: BillingMode.PAY_PER_REQUEST,
            encryption: TableEncryption.AWS_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
        });
        this.table = table;

        const policyStatement = new iam.PolicyStatement({
            actions: ['dynamodb:Query', 'dynamodb:DescribeTable', 'dynamodb:PutItem'],
            resources: [table.tableArn],
        });
        this.policyStatement = policyStatement;
    }

    private constructKey(key: string | [string, AttributeType]) {
        return {
            name: typeof key === 'string' ? key : key[0],
            type: typeof key === 'string' ? AttributeType.STRING : key[1],
        };
    }
}
