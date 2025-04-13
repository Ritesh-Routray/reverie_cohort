export default function translatePresentPerfect(text, dictionary) {
  const commonVerbs = [
    "कर",
    "खा",
    "जा",
    "देख",
    "पढ़",
    "लिख",
    "दे",
    "ले",
    "पी",
    "रख",
    "सीख",
  ];

  const pronounMap = {
    मैं: { bhojpuri: "हम", person: "3rd" },
    हम: { bhojpuri: "हम", person: "1st" },
    तू: { bhojpuri: "तू", person: "2nd" },
    तुम: { bhojpuri: "तोहरा", person: "2nd" },
    आप: { bhojpuri: "रउआ", person: "2nd" },
    वह: { bhojpuri: "ऊ", person: "3rd" },
    वे: { bhojpuri: "उ लोग", person: "3rd" },
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

  const secondLastWord = words[words.length - 2];
  const subject = words[0];
  const pronounInfo = pronounMap[subject];

  const subjectBhojpuri = pronounInfo?.bhojpuri || subject;

  let verbRoot = "";
  for (const word of words) {
    if (commonVerbs.includes(word)) {
      verbRoot = word;
      break;
    }
    else verbRoot = secondLastWord;
  }

  if (!verbRoot) return "❌ Verb not found";

  const verb = `${verbRoot} ले बा`;

  const object = words
    .slice(1)
    .filter((w) => !w.includes("चुका") && !commonVerbs.includes(w))
    .map((w) => dictionary[w] || w)
    .join(" ");

  return `${subjectBhojpuri} ${verb}`.trim();
}
