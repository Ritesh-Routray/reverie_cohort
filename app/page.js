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
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 px-4 py-10 sm:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-8 sm:p-12 border border-blue-100 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-indigo-100 opacity-50"></div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-blue-100 opacity-60"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <span className="text-5xl mr-4">🗣️</span>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dialectal
            </h1>
          </div>
          
          <p className="text-center text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Translate between <span className="font-semibold text-blue-600">Formal Hindi</span> and <span className="font-semibold text-indigo-600">Bhojpuri</span> dialect instantly.
          </p>

          <div className="bg-gray-50 p-6 rounded-3xl shadow-inner mb-8 border border-gray-100">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setPrompt(e.target.value)
              }}
              className="w-full border-0 border-b border-gray-200 rounded-xl p-4 text-lg focus:outline-none focus:border-blue-400 transition text-black bg-transparent resize-none"
              rows={5}
              placeholder={
                direction === "hindi"
                  ? "उदाहरण: मैं बाजार जा रहा हूँ।"
                  : "उदाहरण: हम बजार जा ता हई।"
              }
            />

            <div className="flex flex-wrap gap-4 justify-between mt-6">
              <div className="flex items-center">
                <label className="text-gray-700 font-medium mr-3">दिशा:</label>
                <div className="relative">
                  <select
                    className="appearance-none bg-white pl-4 pr-10 py-2 rounded-full shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 font-medium"
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                  >
                    <option value="hindi">हिंदी ➝ भोजपुरी</option>
                    <option value="bhojpuri">भोजपुरी ➝ हिंदी</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    ▼
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleVoiceInput}
                className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition flex items-center shadow-md"
              >
                <span className="mr-2">🎙️</span> बोलें
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              onClick={
                ()=>{
                  handleTranslate()
                  handleGeminiTranslate()
                }
              }
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full hover:shadow-lg transition font-semibold text-lg flex items-center"
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

          {(translated || response) && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl shadow relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-indigo-100 opacity-60"></div>
              <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-blue-100 opacity-50"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎉</span> अनुवादित परिणाम
                </h2>
                
                <div className="space-y-4">
                  {translated && (
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="text-sm font-medium text-blue-600 mb-2">MY MODEL</div>
                      <p className="text-lg text-gray-800 whitespace-pre-line">{translated}</p>
                    </div>
                  )}
                  
                  {response && (
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="text-sm font-medium text-indigo-600 mb-2">GEMINI</div>
                      <p className="text-lg text-gray-800 whitespace-pre-line">{response}</p>
                    </div>
                  )}
                </div>
              </div>
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