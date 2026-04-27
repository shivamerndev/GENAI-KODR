import { Mistral } from '@mistralai/mistralai';
import "dotenv/config"

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

export async function invokeAI(messages) {

    const chatResponse = await client.chat.complete({
        model: 'mistral-medium-latest',
        messages
    })

    return chatResponse.choices[0].message
}