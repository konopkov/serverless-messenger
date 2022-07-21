import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class SNS extends Construct {
    public readonly policyStatement: iam.PolicyStatement;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const policyStatement = new iam.PolicyStatement({
            actions: ['SNS:Publish'],
            resources: ['*'],
        });

        this.policyStatement = policyStatement;
    }
}
