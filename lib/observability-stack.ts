import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Dashboard, GraphWidget, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';

interface ObservabilityStackProps extends StackProps {
    readonly serviceName: string;
    readonly stage: string;
    readonly functionName: string;
}

export class ObservabilityStack extends Stack {
    constructor(scope: Construct, id: string, props: ObservabilityStackProps) {
        super(scope, id, props);
        const { serviceName, stage } = props;

        const dashboardId = `${serviceName}-dashboard-${stage}`;
        const dashboard = new Dashboard(this, dashboardId, {
            dashboardName: dashboardId,
        });

        // Lambda function metrics widgets
        dashboard.addWidgets(
            new GraphWidget({
                title: 'AWS Function Errors (sum)',
                width: 12,
                left: [
                    new Metric({
                        namespace: 'AWS/Lambda',
                        metricName: 'Errors',
                        dimensionsMap: {
                            FunctionName: props.functionName,
                        },
                        statistic: 'sum',
                        label: 'Sum',
                        period: Duration.minutes(1),
                    }),
                ],
            }),
            new GraphWidget({
                title: 'AWS Function URL Request Duration and Latency (p99)',
                width: 12,
                left: [
                    new Metric({
                        namespace: 'AWS/Lambda',
                        metricName: 'UrlRequestLatency',
                        dimensionsMap: {
                            FunctionName: props.functionName,
                        },
                        statistic: 'p99',
                        label: 'p99 Latency',
                        period: Duration.minutes(1),
                    }),
                    new Metric({
                        namespace: 'AWS/Lambda',
                        metricName: 'Duration',
                        dimensionsMap: {
                            FunctionName: props.functionName,
                        },
                        statistic: 'p99',
                        label: 'p99 Duration',
                        period: Duration.minutes(1),
                    }),
                ],
            }),
            new GraphWidget({
                title: 'AWS Function Invocations (sum)',
                width: 12,
                left: [
                    new Metric({
                        namespace: 'AWS/Lambda',
                        metricName: 'Invocations',
                        dimensionsMap: {
                            FunctionName: props.functionName,
                        },
                        statistic: 'sum',
                        label: 'Sum',
                        period: Duration.minutes(1),
                    }),
                ],
            }),
            new GraphWidget({
                title: 'AWS Function Concurrent executions (Max)',
                width: 12,
                left: [
                    new Metric({
                        namespace: 'AWS/Lambda',
                        metricName: 'ConcurrentExecutions',
                        dimensionsMap: {
                            FunctionName: props.functionName,
                        },
                        statistic: 'max',
                        label: 'Max',
                        period: Duration.minutes(1),
                    }),
                ],
            }),
        );
    }
}
