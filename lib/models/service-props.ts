import { StackProps } from 'aws-cdk-lib';

export interface ServiceProps extends StackProps {
    serviceName: string;
    stage: string;
    region: string;
}
