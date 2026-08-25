# llm-script

A minimal LangChain example: sends one prompt to Claude and prints the response.

## Setup

```bash
cd llm-script
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# then edit .env and set ANTHROPIC_API_KEY
```

## Run

```bash
python main.py
```
