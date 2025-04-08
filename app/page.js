"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [translated, setTranslated] = useState("");

  const handleTranslate = async () => {
    const res = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: input }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setTranslated(data.translated);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10 sm:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          हिंदी से भोजपुरी अनुवादक
        </h1>

        <label className="block mb-2 text-lg font-medium text-gray-700">
          हिंदी में वाक्य लिखें:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          rows={5}
          placeholder="उदाहरण: मैं बाजार जा रहा हूँ।"
        />

        <button
          onClick={handleTranslate}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
        >
          अनुवाद करें
        </button>

        {translated && (
          <div className="mt-8 p-5 bg-green-50 border border-green-300 rounded-xl">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              भोजपुरी अनुवाद:
            </h2>
            <p className="text-lg text-gray-800">{translated}</p>
          </div>
        )}
      </div>
    </main>
  );
}
