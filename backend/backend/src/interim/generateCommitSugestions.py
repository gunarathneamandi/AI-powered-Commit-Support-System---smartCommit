from fastapi import APIRouter, HTTPException, Request
import requests
import json
import os
from dotenv import load_dotenv
from backend.src.models.commitModel import CommitMessageRequest

# Load environment variables
load_dotenv()

router = APIRouter()

# Load API key and endpoint from .env
LLAMA_KEY = os.getenv("LLAMA_KEY")
OPENROUTER_API_URL = os.getenv("OPENROUTER_API_URL")

# Fail fast if missing configuration
if not LLAMA_KEY or not OPENROUTER_API_URL:
    raise RuntimeError("Missing LLAMA_KEY or OPENROUTER_API_URL in environment variables.")

class ManualCommitHandler:
    def __init__(self, rules_file=None):
        self.RULES_FILE = rules_file or os.path.abspath(os.path.join("backend", "src", "interim", "rules.txt"))

    def retrieve_all_rules(self):
        try:
            with open(self.RULES_FILE, "r") as f:
                rules = [line.strip() for line in f.readlines()]
            return rules
        except FileNotFoundError:
            raise HTTPException(status_code=500, detail=f"Rules file not found at {self.RULES_FILE}")

    def generate_commit_message(self, commit_message_example):
        company_rules = self.retrieve_all_rules()

        if not company_rules:
            return commit_message_example

        prompt = (
            "You are an AI assistant that reviews commit messages to ensure they follow company guidelines.\n"
            "Below are the company rules that must be strictly followed:\n\n"
            f"{chr(10).join(company_rules)}\n\n"
            "Give short suggestions on how to apply the given rules and improve the given commit message.\n"
            "Do not mention anything about the rules that's already been followed by the commit message.\n"
            "Keep it concise.\n"
            "Give an example commit message at the end.\n\n"
            "Commit message:\n"
            f"{commit_message_example}"
        )

        response = requests.post(
            url=OPENROUTER_API_URL,
            headers={
                "Authorization": f"Bearer {LLAMA_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:8000",  # Replace with your actual domain if deployed
                "X-Title": "Commit Message Reviewer"
            },
            data=json.dumps({
                "model": "meta-llama/llama-3.3-70b-instruct",
                "messages": [{"role": "user", "content": prompt}]
            })
        )

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to generate commit message.")

        content = response.json().get('choices', [{}])[0].get('message', {}).get('content', "No content generated.")
        return content.strip()

@router.post("/generate-commit-suggestions")
async def review_commit_message(request: CommitMessageRequest):
    try:
        commit_message_example = request.commit_message

        if not commit_message_example:
            raise HTTPException(status_code=400, detail="'commit_message' is required.")

        handler = ManualCommitHandler()
        result = handler.generate_commit_message(commit_message_example)

        suggestion_lines = [
            line.strip()
            for line in result.split('\n')
            if line.strip() and not line.strip().startswith("Suggestions:")
        ]

        return {"suggestions": suggestion_lines}
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Rules file error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating commit suggestions: {str(e)}")
