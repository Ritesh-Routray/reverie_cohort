'use client'
import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [translation, setTranslation] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append('file', file) // selectedFile is your input file
  
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
  
    const data = await res.json()
    console.log('Translation:', data.translation)
  }

  console.log(file)
  
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 bg-gray-100">
      <h1 className="text-3xl font-bold">Bhojpuri Translator (PDF / TXT)</h1>

      <input
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => setFile(e.target.files[0])}
        className="p-2 border border-gray-300 rounded"
      />

      <button
        onClick={handleUpload}
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        {loading ? 'Translating...' : 'Upload and Translate'}
      </button>

      {translation && (
        <div className="w-full max-w-3xl p-4 mt-6 bg-white border rounded shadow">
          <h2 className="mb-2 text-xl font-semibold">Bhojpuri Translation:</h2>
          <p className="whitespace-pre-line">{translation}</p>
        </div>
      )}
    </main>
  )
}
