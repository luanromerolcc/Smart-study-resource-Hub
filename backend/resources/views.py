from .models import Resource
from .serializer import ResourceSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import logging
import time
import requests
import json

logger = logging.getLogger(__name__)

class ResourceViewSet(viewsets.ModelViewSet):#handles CRUD operations automatically

    queryset = Resource.objects.all()

    serializer_class = ResourceSerializer

@api_view(['GET'])
def health_check(request):
    return Response({'status': 'ok'})

@api_view(['POST'])
def smart_assist(request):
    title = request.data.get('title')
    type = request.data.get('type')
    if not title or not type:
        return Response({'error:':'title and type are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    key = os.getenv('APIKey')
    start_time = time.time()

    try:
        response = requests.post(f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}',
            headers={'content-type' : 'application/json',},
            json={
                'system_instruction': {
                    'parts': [{
                        'text': (
                            'You are a pedagogical assistant for an educational platform. '
                            'When given a resource title and type, respond ONLY with a valid JSON object '
                            'in this exact format, no extra text, no markdown, no backticks: '
                            '{"description": "a helpful 2-3 sentence description for students", '
                            '"tags": ["tag1", "tag2", "tag3"]}'
                        )}]},
            'contents' : [{
                'parts':[{
                    'text': f'Title: {title}\nType: {type}'
                }]}]},
        timeout = 30
        )
        latency = round(time.time() - start_time, 2)
        result = response.json()

        content = result['candidates'][0]['content']['parts'][0]['text']
        TokenUsage = result.get('usageMetadata', {}).get('promptTokenCount',0)

        logger.info(
            f'[AI Request] Title="{title}", TokenUsage={TokenUsage}, Latency={latency}s'
        )
        parsed = json.loads(content)
        return Response(parsed)
    except Exception as e:
        logger.error(f'[AI error] {str(e)}')
        return Response({'error': 'Ai service failure. Try again'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

