#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiGatewayStack } from '../lib/apigateway-stack';
import { LambdaStack } from '../lib/lambda-stack';

const ns = 'WebsocketExampleAlpha';
const app = new cdk.App({
  context: {
    ns,
  }
});

const lambdaStack = new LambdaStack(app, `${ns}LambdaStack`);
const apigwStack = new ApiGatewayStack(app, `${ns}ApiGatewayStack`, {
  connectFunction: lambdaStack.connectFunction,
  disconnectFunction: lambdaStack.disconnectFunction,
  defaultFunction: lambdaStack.defaultFunction,
});
apigwStack.addDependency(lambdaStack);