import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as apigw from '@aws-cdk/aws-apigatewayv2';
import * as lambda from '@aws-cdk/aws-lambda';

interface Props extends cdk.StackProps {
  connectFunction: lambda.IFunction;
  disconnectFunction: lambda.IFunction;
  defaultFunction: lambda.IFunction;
}

export class ApiGatewayStack extends cdk.Stack {
  public readonly api: apigw.CfnApi;

  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    const ns = scope.node.tryGetContext('ns') || '';

    this.api = new apigw.CfnApi(this, `WebsocketApi`, {
      name: `${ns}WebSocketApi`,
      protocolType: 'WEBSOCKET',
      routeSelectionExpression: '$request.body.action',
    });

    const credentialsRole = new iam.Role(this, `FunctionExecutionRole`, {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs' },
        { managedPolicyArn: 'arn:aws:iam::aws:policy/AWSLambdaFullAccess' },
      ],
    });

    const connectInteg = new apigw.CfnIntegration(this, `ConnectIntegration`, {
      apiId: this.api.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:apigateway:ap-northeast-2:lambda:path/2015-03-31/functions/${props.connectFunction.functionArn}/invocations`,
      credentialsArn: credentialsRole.roleArn,
    });
    const connectRoute = new apigw.CfnRoute(this, `ConnectRoute`, {
      apiId: this.api.ref,
      routeKey: '$connect',
      operationName: 'ConnectRoute',
      target: `integrations/${connectInteg.ref}`,
    });

    const disconnectInteg = new apigw.CfnIntegration(this, `DisconnectIntegration`, {
      apiId: this.api.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:apigateway:ap-northeast-2:lambda:path/2015-03-31/functions/${props.disconnectFunction.functionArn}/invocations`,
      credentialsArn: credentialsRole.roleArn,
    });
    const disconnectRoute = new apigw.CfnRoute(this, `DisconnectRoute`, {
      apiId: this.api.ref,
      routeKey: '$disconnect',
      operationName: 'DisconnectRoute',
      target: `integrations/${disconnectInteg.ref}`,
    });
 
    const defaultInteg = new apigw.CfnIntegration(this, `DefaultIntegration`, {
      apiId: this.api.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:apigateway:ap-northeast-2:lambda:path/2015-03-31/functions/${props.defaultFunction.functionArn}/invocations`,
      credentialsArn: credentialsRole.roleArn,
    });
    const defaultRoute = new apigw.CfnRoute(this, `DefaultRoute`, {
      apiId: this.api.ref,
      routeKey: '$default',
      operationName: 'DefaultRoute',
      target: `integrations/${defaultInteg.ref}`,
    });

    const alphaStage = new apigw.CfnStage(this, `AlphaStage`, {
      apiId: this.api.ref,
      stageName: 'alpha',
      autoDeploy: true,
      defaultRouteSettings: {
        dataTraceEnabled: true,
        loggingLevel: 'INFO',
      }
    });
    const alphaDeployment = new apigw.CfnDeployment(this, `AlphaDeployment`, {
      apiId: this.api.ref,
      stageName: alphaStage.stageName,
    });
    alphaDeployment.addDependsOn(defaultRoute);
  }

}