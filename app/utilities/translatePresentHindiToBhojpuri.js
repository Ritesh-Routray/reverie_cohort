export default function translateSimplePresent(text, dictionary) {
  const commonVerbs = [
    "करता",
    "करती",
    "करते",
    "खाता",
    "खाती",
    "खाते",
    "जाता",
    "जाती",
    "जाते",
    "पढ़ता",
    "पढ़ती",
    "पढ़ते",
    "लिखता",
    "लिखती",
    "लिखते",
    "देता",
    "देती",
    "देते",
    "पीता",
    "पीती",
    "पीते",
    "देखता",
    "देखती",
    "देखते",
    "लेता",
    "लेती",
    "लेते",
    "रखता",
    "रखती",
    "रखते",
    "सीखता",
    "सीखती",
    "सीखते",
    "उठता",
    "उठती",
    "उठते",
    "खेलता",
  ];

  const pronounMap = {
    मैं: {
      bhojpuri: "हम",
      person: "3rd",
      number: "singular",
      honorific: false,
    },
    हम: { bhojpuri: "हम", person: "1st", number: "plural", honorific: false },
    हमनी: {
      bhojpuri: "हमनी",
      person: "1st",
      number: "plural",
      honorific: false,
    },
    तू: { bhojpuri: "तू", person: "2nd", number: "singular", honorific: false },
    तुम: {
      bhojpuri: "तोहरा",
      person: "2nd",
      number: "plural",
      honorific: false,
    },
    आप: { bhojpuri: "रउआ", person: "2nd", number: "singular", honorific: true },
    रउआ: { bhojpuri: "रउआ", person: "2nd", number: "plural", honorific: true },
    वह: { bhojpuri: "ऊ", person: "3rd", number: "singular", honorific: false },
    वो: { bhojpuri: "ऊ", person: "3rd", number: "singular", honorific: false },
    वे: {
      bhojpuri: "उ लोग",
      person: "3rd",
      number: "plural",
      honorific: false,
    },
    उ: { bhojpuri: "ऊ", person: "3rd", number: "singular", honorific: false },
    "उ लोग": {
      bhojpuri: "उ लोग",
      person: "3rd",
      number: "plural",
      honorific: false,
    },
  };

  const words = text
    .trim()
    .replace(/[.,!?]/g, "")
    .split(/\s+/);

  // ❌ Remove last word if it's an auxiliary verb
  const auxWords = ["है", "हूँ", "हैं", "हो"];
  if (auxWords.includes(words[words.length - 1])) {
    words.pop();
  }

  const secondLastWord = words[words.length-2]; //second last word in the sentence

  const subject = words[0];
  const pronounInfo = pronounMap[subject];

  const person = pronounInfo.person;
  const subjectBhojpuri = pronounInfo.bhojpuri;

  let verbRoot = "";
  let matchedVerb = "";

  for (const word of words) {
    if (commonVerbs.includes(word)) {
      matchedVerb = word;
      verbRoot = word.replace(/(ता|ती|ते)$/, ""); // ✂️ remove suffix
      break;
    }
    else matchedVerb = secondLastWord; //if no verb is found then take the second last word as the verb
  }

  // ✅ Choose verb form based on person
  let bhojpuriVerb = "";
  if (person === "1st") bhojpuriVerb = `${verbRoot}अ`;
  else if (person === "2nd") bhojpuriVerb = `${verbRoot}अ`;
  else if (person === "3rd") bhojpuriVerb = `${verbRoot}एला`;
  else bhojpuriVerb = verbRoot;

  // ✅ Build object excluding the matched verb
  const object = words
    .slice(1)
    .filter((w) => w !== matchedVerb)
    .map((w) => dictionary[w] || w)
    .join(" ");

  return `${subjectBhojpuri} ${bhojpuriVerb} ${object}`.trim();
}
