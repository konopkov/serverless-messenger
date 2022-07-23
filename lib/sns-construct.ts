import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class SNS extends Construct {
    public readonly policyStatement: iam.PolicyStatement;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const policyStatement = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['SNS:Publish'],
            resources: ['*'],
            conditions: { 'ForAllValues:Bool': { PhoneNumber: 'true', 'aws:SecureTransport': 'true' } },
        });

        this.policyStatement = policyStatement;
    }
}
