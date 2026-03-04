from .models import Resource
from .schemas import smartAssistRequest
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


class ResourceViewSet(viewsets.ModelViewSet):  # handles CRUD operations automatically

    queryset = Resource.objects.all()

    serializer_class = ResourceSerializer


@api_view(["GET"])
def health_check(request):
    return Response({"status": "ok"})


@api_view(["POST"])
def smart_assist(request):
    try:
        payload = smartAssistRequest(**request.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    title = payload.title
    type = payload.type
    if not title or not type:
        return Response(
            {"error:": "title and type are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    api_key = os.getenv("APIKey")
    # print(f'API KEY FOUND: {(api_key)}')
    start_time = time.time()

    # try except loop in case groq doesnt respond correctly
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "content-type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "max_tokens": 500,
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are a pedagogical assistant for an educational platform. "
                            "When given a resource title and type, respond ONLY with a valid JSON object "
                            "in this exact format, no extra text, no markdown, no backticks: "
                            '{"description": "a helpful 2-3 sentence description for students", '
                            '"tags": ["tag1", "tag2", "tag3"]}'
                        ),
                    },
                    {"role": "user", "content": f"Title: {title}\nType: {type}"},
                ],
            },
            timeout=30,
        )
        latency = round(time.time() - start_time, 2)
        result = response.json()
        # print (f'RESULT: {result}')#debug print to check what groq sent back

        content = result["choices"][0]["message"]["content"]
        token_usage = result.get("usage", {}).get("prompt_tokens", 0)

        logger.info(
            f'[AI Request] Title="{title}", TokenUsage={token_usage}, Latency={latency}s'
        )
        parsed = json.loads(content)
        return Response(parsed)
    except Exception as e:
        logger.error(f"[AI error] {str(e)}")
        return Response(
            {"error": "Ai service failure. Try again"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
