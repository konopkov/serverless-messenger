import { Duration } from 'aws-cdk-lib';
import { Function, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps, SourceMapMode } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';

import { ServiceProps } from './models/service-props';

export interface LambdaProps extends ServiceProps, NodejsFunctionProps {
    handler: string;
    timeoutSeconds?: number;
    memorySize?: number;
}

export class Lambda extends Construct {
    public readonly lambda: Function;

    constructor(scope: Construct, id: string, props: LambdaProps) {
        super(scope, id);

        const { timeoutSeconds = 30, memorySize = 512, environment, events } = props;

        const [fileName, fileExtension = 'ts', handler = 'handler'] = props.handler.split('.');
        const entryPath = path.resolve(__dirname, `../src/functions/${fileName}.${fileExtension}`);

        const lambda = new NodejsFunction(this, id, {
            bundling: {
                sourceMapMode: SourceMapMode.DEFAULT,
                minify: true,
                sourceMap: true,
                preCompilation: true,
            },
            handler: handler,
            entry: entryPath,
            functionName: id,
            role: props.role,
            runtime: Runtime.NODEJS_16_X,
            memorySize: memorySize,
            timeout: Duration.seconds(timeoutSeconds),
            environment: environment,
            tracing: Tracing.ACTIVE,
            events: events,
        });

        this.lambda = lambda;
    }
}
