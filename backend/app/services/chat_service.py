import os
from dotenv import load_dotenv
from openai import OpenAI
from app.models.schemas import Source

load_dotenv()

SYSTEM_PROMPT = '''You are a helpful assistant that answers questions based ONLY on the provided document excerpts below.

If the answer is not in the excerpts, say: "I don't have information about that in the uploaded documents."

Never make up information. Always cite which document your answer comes from by mentioning the document name.

Document excerpts:
{context}
'''


async def generate_answer(question: str, sources: list[Source], history: list) -> str:
    if not sources:
        return 'No documents have been uploaded yet. Please upload some documents first.'

    client = OpenAI(
        base_url='https://openrouter.ai/api/v1',
        api_key=os.getenv('OPENROUTER_API_KEY'),
    )

    context = '\n\n'.join(
        f'[{s.document_name}]\n{s.excerpt}' for s in sources
    )
    system = SYSTEM_PROMPT.format(context=context)

    messages = [{'role': 'system', 'content': system}]

    for h in history[-6:]:
        messages.append({'role': h['role'], 'content': h['content']})

    messages.append({'role': 'user', 'content': question})

    response = client.chat.completions.create(
        model='qwen/qwen3-coder:free',
        messages=messages,
    )

    return response.choices[0].message.content
