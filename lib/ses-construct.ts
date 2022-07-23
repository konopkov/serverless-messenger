import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class SES extends Construct {
    public readonly policyStatement: iam.PolicyStatement;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const policyStatement = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['SES:SendEmail'],
            resources: ['*'],
            conditions: { Bool: { 'aws:SecureTransport': 'true' } },
        });

        this.policyStatement = policyStatement;
    }
}
