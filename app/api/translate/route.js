import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

import translatePresentPerfect from "@/app/utilities/translatePresentPerfect"; // Your present perfect function
import translatePresentPerfectContinuous from "@/app/utilities/translatePresentPerfectContinuous"; // Your present perfect continuous function
import translatePresentContinuous from "@/app/utilities/translatePresentContinuous"; // Your present continuous function
import translateSimplePresent from "@/app/utilities/translatePresentHindiToBhojpuri"; // Your simple present function

// Detect type of present tense
export default function detectPresentTenseType(text) {
  const clean = text.trim().toLowerCase();

  if (/से.*रहा हूँ|से.*रही हूँ|से.*रहे हो/.test(clean))
    return "presentPerfectContinuous";

  if (
    clean.includes("चुका हूँ") ||
    clean.includes("चुकी हूँ") ||
    clean.includes("चुके हैं") ||
    clean.includes("चुका है") ||
    clean.includes("चुका हो") ||
    clean.includes("चुकी हो") ||
    clean.includes("चुके हो") ||
    clean.includes("चुका") ||
    clean.includes("चुकी") ||
    clean.includes("चुके")

  )
    return "presentPerfect";

  if (
    clean.includes("रहा हूँ") ||
    clean.includes("रहा हो") ||
    clean.includes("रहा ह") ||
    clean.includes("रहा है") ||
    clean.includes("रही हूँ") ||
    clean.includes("रही हो") ||
    clean.includes("रही ह") ||
    clean.includes("रही है") ||
    clean.includes("रहे हो") 
  )
    return "presentContinuous";

  if (
    clean.includes("है") ||
    clean.includes("हो") ||
    clean.includes("हूँ") ||
    clean.includes("हैं") ||
    clean.includes("हों")
  )
    return "presentSimple";

  return null;
}

export async function POST(request) {
  const { text } = await request.json();

  // Load dictionary
  const jsonPath = path.join(process.cwd(), "data", "hindiBhojpuri.json");
  const jsonData = readFileSync(jsonPath, "utf-8");
  const dictionary = JSON.parse(jsonData);

  const tenseType = detectPresentTenseType(text);

  let translated = ""

  switch (tenseType) {
    case "presentSimple":
      translated = translateSimplePresent(text, dictionary);
      break;
    case "presentContinuous":
      translated = translatePresentContinuous(text, dictionary);
      break;
    case "presentPerfect":
      translated = translatePresentPerfect(text, dictionary);
      break;
    case "presentPerfectContinuous":
      translated = translatePresentPerfectContinuous(text, dictionary);
      break;
    default:
      translated = "❌ Unsupported or unrecognized tense.";
  }

  return NextResponse.json({ translated });
}
