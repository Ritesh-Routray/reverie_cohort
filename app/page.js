"use client";

import { useRef, useState } from "react";
import FileUploader from "@/components/FileUploader";

export default function Home() {
  const [input, setInput] = useState("");
  const [translated, setTranslated] = useState("");
  const [direction, setDirection] = useState("hindi");
  const [engine, setEngine] = useState("huggingface"); // NEW: model source
  const speechRef = useRef(null);

  const handleTranslate = async () => {;

    const res = await fetch(
      "https://api-inference.huggingface.co/models/rrgr8/bhojpuri-translator",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs:String(input) }),
      }
    );

    const data = await res.json();
    const output = data[0]?.generated_text;
    setTranslated(output || "❌ Translation failed");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translated);
  };

  const handleSpeak = () => {
    if (translated) {
      const utterance = new SpeechSynthesisUtterance(translated);
      utterance.lang = "hi-IN";
      speechSynthesis.speak(utterance);
      speechRef.current = utterance;
    }
  };

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 px-4 py-10 sm:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-8 sm:p-12 border border-blue-100 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-indigo-100 opacity-50"></div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-blue-100 opacity-60"></div>

        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
            🗣️ Dialectal
          </h1>

          <p className="text-center text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Translate between{" "}
            <span className="font-semibold text-blue-600">Formal Hindi</span>{" "}
            and <span className="font-semibold text-indigo-600">Bhojpuri</span>{" "}
            dialect instantly using custom-trained AI.
          </p>

          <div className="bg-gray-50 p-6 rounded-3xl shadow-inner mb-8 border border-gray-100">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border-0 border-b border-gray-200 rounded-xl p-4 text-lg focus:outline-none focus:border-blue-400 transition text-black bg-transparent resize-none"
              rows={5}
              placeholder="उदाहरण: मैं बाजार जा रहा हूँ।"
            />

            <div className="flex flex-wrap justify-between mt-6 gap-4">
              <div className="flex gap-3 items-center">
                <label className="text-gray-700 font-medium">दिशा:</label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="bg-white px-4 py-2 rounded-full border shadow-sm"
                >
                  <option value="hindi">हिंदी ➝ भोजपुरी</option>
                  <option value="bhojpuri">भोजपुरी ➝ हिंदी</option>
                </select>

                <label className="ml-6 text-gray-700 font-medium">मॉडल:</label>
                <select
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  className="bg-white px-4 py-2 rounded-full border shadow-sm"
                >
                  <option value="huggingface">
                    🧠 Hugging Face (Your Model)
                  </option>
                  <option value="gemini">🔮 Gemini (Fallback)</option>
                </select>
              </div>

              <button
                onClick={handleVoiceInput}
                className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition flex items-center shadow-md"
              >
                <span className="mr-2">🎙️</span> बोलें
              </button>
            </div>

            {/* File Upload */}
            <div className="mt-6">
              <FileUploader />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              onClick={handleTranslate}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full hover:shadow-lg transition font-semibold text-lg flex items-center"
            >
              <span className="mr-2">🔁</span> अनुवाद करें
            </button>
            <button
              onClick={handleCopy}
              className="bg-gray-200 text-gray-700 px-5 py-3 rounded-full hover:bg-gray-300 transition flex items-center shadow-sm"
            >
              <span className="mr-2">📋</span> कॉपी करें
            </button>
            <button
              onClick={handleSpeak}
              className="bg-teal-500 text-white px-5 py-3 rounded-full hover:bg-teal-600 transition flex items-center shadow-sm"
            >
              <span className="mr-2">🔊</span> सुनें
            </button>
          </div>

          {translated && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl shadow relative overflow-hidden">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                <span className="mr-2">🎉</span> अनुवादित परिणाम
              </h2>
              <p className="text-lg text-gray-800 whitespace-pre-line">
                {translated}
              </p>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            Dialectal • भारतीय भाषाओं का अनुवादक • © 2025
          </div>
        </div>
      </div>
    </main>
  );
}
