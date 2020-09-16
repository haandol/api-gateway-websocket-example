# API Gateway Websocket using CDK

This repository is about example code for API Gateway Websocket

**Running this repository may cost you to provision AWS resources**

# Prerequisites

- awscli
- Nodejs 10.x+
- Python 3.4+
- AWS Account and Locally configured AWS credential

# Installation

Install project dependencies

```bash
$ npm i
```

Install cdk in global context and run `cdk init` if you did not initailize cdk yet.

```bash
$ npm i -g cdk
$ cdk bootstrap
```

Deploy CDK Stacks on AWS

```bash
$ cdk deploy "*" --require-approval never
```

# Usage

1. Visit API Gateway console page and copy WebsocketURL

2. Install wscat

```bash
$ npm i -g wscat
```

3. Test Websocket

```bash
$ wscat -c wss://xyz.execute-api.ap-northeast-2.amazonaws.com/alpha
> hi there
< hi there
```

# Cleanup

destroy provisioned cloud resources

```bash
$ cdk destroy "*"
```