import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class SES extends Construct {
    public readonly policyStatement: iam.PolicyStatement;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const policyStatement = new iam.PolicyStatement({
            actions: ['SES:SendEmail'],
            resources: ['*'],
        });

        this.policyStatement = policyStatement;
    }
}
