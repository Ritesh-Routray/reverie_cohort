import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export async function POST(request) {
    const { text } = await request.json();
    
    // Read the JSON file
    const jsonPath = path.join(
      process.cwd(),
      "data",
      "hindiBhojpuri.json"
    );
    const jsonData = readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(jsonData);
    
    // Find the translation for the given text
    const words = text.split(/\s+/);
    const translated = words.map((word) => data[word] || word).join(" ");
    
    return NextResponse.json({ translated });
}