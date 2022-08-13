#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { ObservabilityStack } from '../lib/observability-stack';
import { ServerlessMessengerStack } from '../lib/serverless-messenger-stack';
import { EnvVariables } from '../src/shared/models';

const {
    STAGE = 'dev',
    SNS_REGION = 'us-east-1',
    SES_REGION = 'eu-west-1',
    DEFAULT_EMAIL_FROM = 'no-reply@example.com',
    REGION = 'eu-central-1',
    SERVICE_NAME = 'serverless-messenger',
} = process.env as EnvVariables;

const app = new cdk.App();

const messengerStackId = `serverless-messenger-app-${STAGE}`;
const messengerStack = new ServerlessMessengerStack(app, messengerStackId, {
    serviceName: SERVICE_NAME,
    stage: STAGE,
    snsRegion: SNS_REGION,
    sesRegion: SES_REGION,
    defaultEmailFrom: DEFAULT_EMAIL_FROM,
    region: REGION,
});

const observabilityStackId = `serverless-messenger-observability-${STAGE}`;
const observabilityStack = new ObservabilityStack(app, observabilityStackId, {
    serviceName: SERVICE_NAME,
    stage: STAGE,
    functionName: messengerStack.appSyncLambdaId,
    appSyncApiId: messengerStack.appSyncApiId,
});
