import { GoogleGenerativeAI } from '@google/generative-ai'
import pdfParse from 'pdf-parse'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function extractText(file) {
  const buffer = Buffer.from(await file.arrayBuffer())

  if (file.name.endsWith('.pdf')) {
    const data = await pdfParse(buffer)
    return data.text
  } else if (file.name.endsWith('.txt')) {
    return buffer.toString('utf-8')
  } else {
    throw new Error('Unsupported file type')
  }
}

async function translateToBhojpuri(text) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Translate the following text into Bhojpuri:\n\n${text}`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const text = await extractText(file)
    const bhojpuriTranslation = await translateToBhojpuri(text)

    return NextResponse.json({ translation: bhojpuriTranslation })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
