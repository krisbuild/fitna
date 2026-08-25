from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic

load_dotenv()

llm = ChatAnthropic(model="claude-opus-5")

prompt = "What is the capital of France?"
response = llm.invoke(prompt)

print(response.content)
