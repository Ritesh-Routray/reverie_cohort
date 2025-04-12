export default function translatePresentContinuous(text, dictionary) {
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
      मैं: { bhojpuri: "हम", person: "1st" },
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
  const subject = words[0];
  const pronounInfo = pronounMap[subject];
  if (!pronounInfo) return "❌ Unknown subject";

  const person = pronounInfo.person;
  const subjectBhojpuri = pronounInfo.bhojpuri;
  const gender = text.includes("रही") ? "female" : "male";

  let verbRoot = "";
  for (const word of words) {
    if (commonVerbs.includes(word)) {
      verbRoot = word;
      break;
    }
  }

  if (!verbRoot) return "❌ Verb not found";

  const verb =
    person === "1st"
      ? gender === "female"
        ? `${verbRoot} तानी`
        : `${verbRoot} ता नी`
      : `${verbRoot} ता`;

  const object = words
    .slice(1)
    .filter((w) => !w.includes("रहा") && !commonVerbs.includes(w))
    .map((w) => dictionary[w] || w)
    .join(" ");

  return `${subjectBhojpuri} ${verb} ${object}`.trim();
}
