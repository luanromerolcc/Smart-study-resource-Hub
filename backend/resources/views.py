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
    start_time = time.time()

    # Request to Groq API with timeout: 5s connect, 30s read
    # This ensures we don't hang on slower connections while allowing LLM processing time
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
            timeout=(5, 30),
        )
        latency = round(time.time() - start_time, 2)
        result = response.json()

        content = result["choices"][0]["message"]["content"]
        token_usage = result.get("usage", {}).get("prompt_tokens", 0)

        logger.info(
            f'[AI Request] Title="{title}", TokenUsage={token_usage}, Latency={latency}s'
        )
        parsed = json.loads(content)
        return Response(parsed)
    except requests.exceptions.Timeout:
        logger.error("[AI error] Request timeout - Groq API took too long to respond")
        return Response(
            {"error": "AI service is slow. Please try again in a moment."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    except requests.exceptions.RequestException as e:
        logger.error(f"[AI error] Network request failed: {str(e)}")
        return Response(
            {"error": "Network error connecting to AI service. Check your connection."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    except (json.JSONDecodeError, KeyError) as e:
        logger.error(f"[AI error] Invalid API response format: {str(e)}")
        return Response(
            {"error": "AI service returned invalid response. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    except Exception as e:
        logger.error(f"[AI error] Unexpected error: {str(e)}")
        return Response(
            {"error": "An unexpected error occurred. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
