// app/api/upload/route.js
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const formData = await req.formData()
  const file = formData.get('file')

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const text = await file.text()

  // Call Gemini for translation
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Translate the following text to Bhojpuri:\n\n${text} and give only the translated text nothing else.`
  const result = await model.generateContent(prompt)
  const response = await result.response
  const translation = response.text()

  return NextResponse.json({ translation })
}
