import fs from "fs";

// Load your original raw file (place it in the root or adjust the path)
const raw = JSON.parse(
  fs.readFileSync("./Hindi - Bhojpuri Word2.json", "utf-8")
);

const dict = {};

raw.forEach((entry) => {
  const hindi = entry["Hindi Word"]?.trim();
  const bhojpuri = entry["Bhojpuri Word"]?.trim();

  if (hindi && bhojpuri) {
    const parts = hindi.split(",").map((p) => p.trim());
    parts.forEach((part) => {
      dict[part] = bhojpuri;
    });
  }
});

fs.writeFileSync(
  "./hindiBhojpuri.json",
  JSON.stringify(dict, null, 2),
  "utf-8"
);
console.log("✅ Cleaned dictionary saved to public/hindiBhojpuri.json");
