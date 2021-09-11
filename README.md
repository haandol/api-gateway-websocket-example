# API Gateway Websocket using CDK

This repository is about example code for API Gateway Websocket chatting

**Running this repository may cost you to provision AWS resources**

# Prerequisites

- awscli
- Nodejs 12.x+
- Python 3.7+
- AWS Account and Locally configured AWS credential

# Installation

Install project dependencies

```bash
$ npm i
```

Install cdk in global context and run `cdk init` if you did not initailize cdk yet.

```bash
$ npm i -g cdk@1.112.0
$ cdk bootstrap
```

Deploy CDK Stacks on AWS

```bash
$ cdk deploy "*" --require-approval never
```

Visit API Gateway console page and copy WebsocketURL And Install wscat

```bash
$ npm i -g wscat
```

# Usage

## User A
If you put invalid message, `$default` will handle message (it will echo your message)

```bash
$ wscat -c wss://xyz.execute-api.ap-northeast-2.amazonaws.com/alpha
> hi there
< hi there
```

Join to the room

```bash
$ wscat -c wss://xyz.execute-api.ap-northeast-2.amazonaws.com/alpha
> {"action": "join", "room": "room1"}
< S_5YUerFoE0CJng= has joined to Room room1
> {"action": "join", "room": "room1"}
< You have already joined to room1.
```

Send message to the room
```bash
> {"action": "send", "room": "room1", "msg": "this is AWS"}
< [S_5YUerFoE0CJng=]: this is AWS
```

## User B

Open new terminal and connect to wss

```bash
$ wscat -c wss://xyz.execute-api.ap-northeast-2.amazonaws.com/alpha
```

If you did not join the room, User A sending message will not display to Uesr B

Join to the room1

```bash
> {"action": "join", "room": "room1"}
< S_7SxeJSIE0CIRQ= has joined to Room room1
```

Send arbitrary message and see if the message is displayed on both users' terminal

```
> {"action": "send", "room": "room1", "msg": "this is AWS User B"}
< [S_7SxeJSIE0CIRQ=]: this is AWS User B
```

# Cleanup

destroy provisioned cloud resources

```bash
$ cdk destroy "*"
```