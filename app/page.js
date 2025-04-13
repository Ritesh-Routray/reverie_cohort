"use client";

import FileUploader from "@/components/FileUploader";
import { useRef, useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [translated, setTranslated] = useState("");
  const [direction, setDirection] = useState("hindi");
  const speechRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTranslate = async () => {
    if (!input.trim()) return;
    
    setIsTranslating(true);
    
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({ text: input, direction }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setTranslated(data.translated);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsTranslating(false);
    }
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
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 px-4 py-12 font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-200 bg-opacity-40 blur-3xl"></div>
        <div className="absolute top-1/4 -left-40 w-80 h-80 rounded-full bg-blue-200 bg-opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-indigo-200 bg-opacity-30 blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header with animated effect */}
        <div className="text-center mb-12 relative">
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-70"></div>
          <div className="inline-block mb-4">
            <div className="p-4 bg-white bg-opacity-90 rounded-2xl shadow-lg transform hover:rotate-3 transition duration-300 backdrop-blur-sm border border-indigo-100">
              <span className="text-6xl">🗣️</span>
            </div>
          </div>
          <h1 className="text-7xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
            Dialectal
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Bridging cultures with seamless translations between{" "}
            <span className="font-semibold text-blue-600">Formal Hindi</span> and{" "}
            <span className="font-semibold text-purple-600">Bhojpuri</span> dialect
          </p>
          
          {/* Direction toggle styled as pill switch */}
          <div className="mt-6 inline-flex p-1 bg-white rounded-full shadow-md border border-indigo-100">
            <button
              onClick={() => setDirection("hindi")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition duration-200 ${
                direction === "hindi"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-inner"
                  : "text-gray-700 hover:bg-indigo-50"
              }`}
            >
              हिंदी ➝ भोजपुरी
            </button>
            <button
              onClick={() => setDirection("bhojpuri")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition duration-200 ${
                direction === "bhojpuri"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-inner" 
                  : "text-gray-700 hover:bg-indigo-50"
              }`}
            >
              भोजपुरी ➝ हिंदी
            </button>
          </div>
        </div>

        {/* Main content with glass effect */}
        <div className="grid md:grid-cols-7 gap-8">
          {/* Input Section - wider */}
          <div className="md:col-span-3 bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-indigo-100 transform transition duration-300 hover:translate-y-[-4px] hover:shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-2 p-2 bg-blue-100 rounded-lg text-blue-600">✏️</span> 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">लिखें या बोलें</span>
            </h2>

            <div className="relative mb-6">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setPrompt(e.target.value);
                }}
                className="w-full border-0 rounded-2xl p-5 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-800 bg-white shadow-inner resize-none"
                rows={7}
                placeholder={
                  direction === "hindi"
                    ? "उदाहरण: मैं बाजार जा रहा हूँ।"
                    : "उदाहरण: हम बजार जा ता हई।"
                }
              />
              <button
                onClick={handleVoiceInput}
                className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full hover:from-blue-600 hover:to-indigo-600 transition shadow-lg transform hover:scale-105"
                title="बोलकर इनपुट दें"
              >
                <span className="text-xl">🎙️</span>
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <h3 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                  <span className="mr-2">📁</span> फ़ाइल अपलोड
                </h3>
                <FileUploader className="bg-blue-100"/>
              </div>
            </div>

            <button
              onClick={() => {
                handleTranslate();
                handleGeminiTranslate();
              }}
              disabled={!input.trim() || isTranslating}
              className={`w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center transition duration-300 ${
                input.trim() && !isTranslating
                  ? "hover:shadow-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-[1.02]"
                  : "opacity-70 cursor-not-allowed"
              }`}
            >
              {isTranslating ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> अनुवाद हो रहा है...
                </>
              ) : (
                <>
                  <span className="mr-2">🔁</span> अनुवाद करें
                </>
              )}
            </button>
          </div>

          {/* Output Section - wider */}
          <div className="md:col-span-4 bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-indigo-100 transform transition duration-300 hover:translate-y-[-4px] hover:shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <span className="mr-2 p-2 bg-purple-100 rounded-lg text-purple-600">🎯</span>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">अनुवादित परिणाम</span>
              </h2>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  disabled={!translated && !response}
                  className={`p-3 rounded-xl transition duration-200 ${
                    translated || response
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm hover:shadow"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  title="कॉपी करें"
                >
                  <span className="text-lg">📋</span>
                </button>
                <button
                  onClick={handleSpeak}
                  disabled={!translated}
                  className={`p-3 rounded-xl transition duration-200 ${
                    translated
                      ? "bg-teal-100 hover:bg-teal-200 text-teal-700 shadow-sm hover:shadow"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  title="सुनें"
                >
                  <span className="text-lg">🔊</span>
                </button>
              </div>
            </div>

            {(!translated && !response) ? (
              <div className="h-72 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="mb-4 p-4 bg-gray-100 rounded-full">
                  <span className="text-4xl">📝</span>
                </div>
                <p className="text-lg mb-2">अनुवाद यहां दिखाया जाएगा</p>
                <p className="text-sm text-gray-400">अनुवाद शुरू करने के लिए बाईं ओर टेक्स्ट दर्ज करें</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto pr-2 py-2">
                {translated && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl shadow-sm border border-blue-100 transform transition hover:shadow hover:translate-y-[-2px]">
                    <div className="flex items-center text-sm font-medium text-blue-600 mb-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full mr-2">
                        <span>🔹</span>
                      </div>
                      API 1
                    </div>
                    <p className="text-lg text-gray-800 whitespace-pre-line">
                      {translated}
                    </p>
                  </div>
                )}

                {response && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-2xl shadow-sm border border-purple-100 transform transition hover:shadow hover:translate-y-[-2px]">
                    <div className="flex items-center text-sm font-medium text-purple-600 mb-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-full mr-2">
                        <span>🔸</span>
                      </div>
                      API 2
                    </div>
                    <p className="text-lg text-gray-800 whitespace-pre-line">
                      {response}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Features section with cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-indigo-50 transform transition duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
              <span className="text-3xl">🔄</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">द्विदिशीय अनुवाद</h3>
            <p className="text-gray-600 leading-relaxed">हिंदी से भोजपुरी और भोजपुरी से हिंदी में आसानी से अनुवाद करें। एक क्लिक से भाषाओं को बदल सकते हैं।</p>
          </div>
          
          <div className="bg-white bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-indigo-50 transform transition duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
              <span className="text-3xl">🎙️</span>
            </div> 
            <h3 className="text-xl font-bold text-gray-800 mb-3">वॉइस इनपुट</h3>
            <p className="text-gray-600 leading-relaxed">टाइप करने के बजाय अपनी आवाज से आसानी से इनपुट दें। माइक्रोफ़ोन का बटन दबाकर बोलना शुरू करें।</p>
          </div>
          
          <div className="bg-white bg-opacity-70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-indigo-50 transform transition duration-300 hover:translate-y-[-4px] hover:shadow-xl">
            <div className="bg-gradient-to-br from-purple-100 to-pink-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
              <span className="text-3xl">📁</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">फ़ाइल अपलोड</h3>
            <p className="text-gray-600 leading-relaxed">टेक्स्ट फ़ाइल अपलोड करके बड़े दस्तावेज़ों का अनुवाद करें। सिर्फ फ़ाइल चुनें और अपलोड करें।</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 bg-white bg-opacity-70 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-indigo-50">
          <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">उपयोगकर्ताओं का अनुभव</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-2xl">👨</div>
                <div className="ml-3">
                  <h3 className="font-bold text-gray-800">राजेश कुमार</h3>
                  <p className="text-xs text-gray-500">पटना, बिहार</p>
                </div>
              </div>
              <p className="text-gray-600">"मेरे परिवार के बड़े-बुजुर्ग भोजपुरी में बात करते हैं। यह ऐप हमारे बीच की भाषा की खाई को पाटने में मदद करता है।"</p>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-2xl">👩</div>
                <div className="ml-3">
                  <h3 className="font-bold text-gray-800">सुनीता देवी</h3>
                  <p className="text-xs text-gray-500">वाराणसी, उत्तर प्रदेश</p>
                </div>
              </div>
              <p className="text-gray-600">"मैं अपने व्यापार के लिए भोजपुरी क्षेत्र में विज्ञापन बनाने के लिए इस ऐप का उपयोग करती हूँ। बहुत ही उपयोगी है!"</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-2xl">👨‍🏫</div>
                <div className="ml-3">
                  <h3 className="font-bold text-gray-800">प्रो. अनिल पांडेय</h3>
                  <p className="text-xs text-gray-500">भाषा विशेषज्ञ, दिल्ली विश्वविद्यालय</p>
                </div>
              </div>
              <p className="text-gray-600">"भाषाई अध्ययन के लिए एक उत्कृष्ट टूल। मैं अपने छात्रों को भी इसका उपयोग करने की सलाह देता हूँ।"</p>
            </div>
          </div>
        </div>

        {/* Footer with glass effect */}
        <footer className="mt-16 text-center">
          <div className="inline-flex items-center justify-center space-x-3 p-4 rounded-full bg-white bg-opacity-80 backdrop-blur-sm shadow-lg border border-indigo-100">
            <span className="text-indigo-600 font-medium">Dialectal</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600">भारतीय भाषाओं का अनुवादक</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600">© 2025</span>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>सभी भारतीय भाषाओं को जोड़ने का हमारा मिशन</p>
          </div>
        </footer>
      </div>
    </main>
  );
}