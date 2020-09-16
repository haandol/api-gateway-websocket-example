import os
import boto3

client = None


def handler(event, context):
    print(event)
    global client

    request_context = event['requestContext']
    if not client:
        endpoint_url = f"https://{request_context['domainName']}/{request_context['stage']}"
        client = boto3.client('apigatewaymanagementapi', endpoint_url=endpoint_url)

    connection_id = request_context['connectionId']
    response = client.post_to_connection(
        Data=b'bytes',
        ConnectionId=connection_id,
    )
    print(response)
    return {
        'statusCode': 200,
        'body': 'Data Sent.'
    }