'use client'

import { useState } from 'react'

export default function FileUploader() {
  const [translation, setTranslation] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      setTranslation(data.translation || 'Translation failed.')
    } catch (error) {
      console.error('Upload failed:', error)
      setTranslation('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto ">
      <input
        type="file"
        accept=".txt,.pdf"
        onChange={handleFileChange}
        className="mb-4 text-black border border-gray-300 rounded-2xl p-2 px-4"
      />
      {loading && <p className="text-blue-500">Translating...</p>}
      {translation && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="font-bold text-black">Bhojpuri Translation:</h2>
          <p className='text-black'>{translation}</p>
        </div>
      )}
    </div>
  )
}
