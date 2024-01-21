import json
import click

from openai import OpenAI

client = OpenAI()

def complete_json(q):
    click.echo("AI Prompt Query: " + q)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a helpful assistant designed to output JSON with strings properly escaped."},
            {"role": "user", "content": q}
        ]
    )
    js = response.choices[0].message.content
    print(js)
    return json.loads(js)
