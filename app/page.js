"use client";

import { useRef, useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [translated, setTranslated] = useState("");
  const [direction, setDirection] = useState("hindi");
  const speechRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleGeminiTranslate = async () => {
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: prompt }),
      });
      const data = await res.json();
      setResponse(data.summary);
      console.log(data.summary,response)
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleTranslate = async () => {
    const res = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: input, direction }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    setTranslated(data.translated);
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
    const recognition = new (window).webkitSpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 px-4 py-10 sm:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-8 sm:p-12 border border-blue-100">
        <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-6">
          🗣️ Dialectal
        </h1>
        <p className="text-center text-gray-600 text-lg mb-8">
          Translate between <span className="font-semibold text-blue-600">Formal Hindi</span> and <span className="font-semibold text-green-600">Bhojpuri</span> dialect instantly.
        </p>

        <div className="mb-6">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setPrompt(e.target.value)
            }}
            className="w-full border border-gray-300 rounded-2xl p-4 text-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black"
            rows={5}
            placeholder={
              direction === "hindi"
                ? "उदाहरण: मैं बाजार जा रहा हूँ।"
                : "उदाहरण: हम बजार जा ता हई।"
            }
          />
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={
              ()=>{
                handleTranslate()
                handleGeminiTranslate()

              }
            }
            className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            🔁 अनुवाद करें
          </button>
          <button
            onClick={handleCopy}
            className="bg-gray-300 px-5 py-2 rounded-xl hover:bg-gray-400 transition"
          >
            📋 कॉपी करें
          </button>
          <button
            onClick={handleSpeak}
            className="bg-green-500 text-white px-5 py-2 rounded-xl hover:bg-green-600 transition"
          >
            🔊 सुनें
          </button>
          <button
            onClick={handleVoiceInput}
            className="bg-purple-500 text-white px-5 py-2 rounded-xl hover:bg-purple-600 transition"
          >
            🎙️ बोलें
          </button>
        </div>

        <div className="text-center mb-6">
          <label className="text-gray-700 font-medium">दिशा बदलें:</label>
          <select
            className="ml-2 border p-2 rounded-xl shadow-sm"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
          >
            <option value="hindi">हिंदी ➝ भोजपुरी</option>
            <option value="bhojpuri">भोजपुरी ➝ हिंदी</option>
          </select>
        </div>

        {(translated || response) && (
          <div className="mt-6 p-6 bg-green-50 border border-green-300 rounded-2xl shadow">
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              🎉 अनुवादित वाक्य:
            </h2>
            <p className="text-lg text-gray-800 whitespace-pre-line">MY MODEL: {translated}</p>
            <p className="text-lg text-black whitespace-pre-line">GEMINI: {response}</p>
          </div>
        )}
      </div>
    </main>
  );
}
