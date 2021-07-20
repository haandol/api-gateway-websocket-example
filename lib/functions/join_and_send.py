import json
import boto3
from datetime import datetime
from collections import defaultdict

client = None
# rooms should be stored on Redis or something
rooms = defaultdict(set)

def handler(event, context):
    print(event)
    global client

    request_context = event['requestContext']
    if not client:
        endpoint_url = f"https://{request_context['domainName']}/{request_context['stage']}"
        client = boto3.client('apigatewaymanagementapi', endpoint_url=endpoint_url)

    connection_id = request_context['connectionId']

    body = json.loads(event['body'])
    room_id = body['room']

    if body['action'] == 'join':
        join(room_id, connection_id)
    elif body['action'] == 'send':
        msg = body['msg']
        send(room_id, connection_id, msg)
    else:
        return {
            'statusCode': 503,
            'body': 'this message should not be printed, $default should handle this',
        }

    return {
        'statusCode': 200,
        'body': 'Data Sent.'
    }


def join(room_id, connection_id):
    if connection_id in rooms[room_id]:
        response = client.post_to_connection(
            Data=f'You have already joined to {room_id}.'.encode('utf-8'),
            ConnectionId=connection_id,
        )
        print(response)
        return

    rooms[room_id].add(connection_id)

    for conn_id in rooms[room_id]:
        response = client.post_to_connection(
            Data=f'{conn_id} has joined to Room {room_id}'.encode('utf-8'),
            ConnectionId=conn_id,
        )
        print(response)


def send(room_id, connection_id, msg):
    if connection_id not in rooms[room_id]:
        response = client.post_to_connection(
            Data=f'In order to send message room to {room_id}, join first.'.encode('utf-8'),
            ConnectionId=connection_id,
        )
        print(response)
        return

    for conn_id in rooms[room_id]:
        response = client.post_to_connection(
            Data=f'[{datetime.now().isoformat()}][{conn_id}]: {msg}'.encode('utf-8'),
            ConnectionId=conn_id,
        )
        print(response)