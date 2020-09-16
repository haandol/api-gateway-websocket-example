import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';

export class LambdaStack extends cdk.Stack {
  public readonly connectFunction: lambda.IFunction;
  public readonly disconnectFunction: lambda.IFunction;
  public readonly defaultFunction: lambda.IFunction;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ns = scope.node.tryGetContext('ns') || '';

    const role = new iam.Role(this, `FunctionRole`, {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' },
        { managedPolicyArn: 'arn:aws:iam::aws:policy/AmazonAPIGatewayInvokeFullAccess' },
      ],
    });

    this.connectFunction = new lambda.Function(this, 'ConnectFunction', {
      functionName: `${ns}ConnectFunction`,
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'functions')),
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'connect.handler',
      role,
      allowPublicSubnet: true,
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
    });

    this.disconnectFunction = new lambda.Function(this, 'DisconnectFunction', {
      functionName: `${ns}DisconnectFunction`,
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'functions')),
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'disconnect.handler',
      role,
      allowPublicSubnet: true,
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
    });

    this.defaultFunction = new lambda.Function(this, 'DefaultFunction', {
      functionName: `${ns}DefaultFunction`,
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'functions')),
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'default.handler',
      role,
      allowPublicSubnet: true,
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
    });
  }

}