import { NextResponse } from 'next/server'

type IncomingMessage = {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing OPENAI_API_KEY in environment variables.' },
      { status: 500 },
    )
  }

  let messages: IncomingMessage[]
  try {
    const body = await request.json()
    messages = body.messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are Manifest AI, a concise voice assistant in a biosignal-native OS. Keep replies short, clear, and conversational.',
        },
        ...messages,
      ],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return NextResponse.json(
      { error: err || 'OpenAI request failed.' },
      { status: response.status },
    )
  }

  const data = await response.json()
  const reply = data.choices?.[0]?.message?.content?.trim()

  if (!reply) {
    return NextResponse.json({ error: 'Empty response from model.' }, { status: 502 })
  }

  return NextResponse.json({ reply })
}
