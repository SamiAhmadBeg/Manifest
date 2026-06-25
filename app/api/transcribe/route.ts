import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing OPENAI_API_KEY in environment variables.' },
      { status: 500 },
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No audio file provided.' }, { status: 400 })
    }

    const body = new FormData()
    body.append('file', file, 'recording.webm')
    body.append('model', 'whisper-1')
    body.append('language', 'en')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body,
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json(
        { error: err || 'Transcription failed.' },
        { status: response.status },
      )
    }

    const data = await response.json()
    const text = data.text?.trim()
    if (!text) {
      return NextResponse.json({ error: 'No speech detected in recording.' }, { status: 400 })
    }

    return NextResponse.json({ text })
  } catch {
    return NextResponse.json({ error: 'Transcription request failed.' }, { status: 500 })
  }
}
