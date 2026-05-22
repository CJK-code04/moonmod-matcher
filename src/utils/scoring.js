import { moonswatches } from "../data/moonswatches.js";
import { bezels } from "../data/bezels.js";
import { cases } from "../data/cases.js";
import { straps } from "../data/straps.js";

const normalizeTag = (tag) => tag.toLowerCase();

function sharedTags(...parts) {
  const counts = {};
  parts.flatMap((part) => part.tags || []).forEach((tag) => {
    const key = normalizeTag(tag);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function areClashingColors(colorA, colorB) {
  const pair = [colorA, colorB].sort().join("-");
  return new Set(["Felroze-Rood", "Groen-Rood", "Bruin-Felroze", "Donkerbruin-Felroze"]).has(pair);
}

function isNeutral(part) {
  return ["Neutraal", "Aarde"].includes(part.colorFamily) || ["Staal", "Wit", "Zwart", "Bruin", "Donkerbruin", "Lichtbruin", "Grijs", "Beige", "Beige/Bruin", "Crème/Bordeaux"].includes(part.color);
}

function colorHarmonyScore(moon, bezel, strap) {
  let score = 0;
  const explanation = [];
  const visibleColorParts = [moon, bezel, strap];

  if (moon.color === strap.color) {
    score += 24;
    explanation.push(`${moon.color} komt mooi terug in de band`);
  }
  if (moon.color === bezel.color) {
    score += 18;
    explanation.push(`${moon.color} wijzerplaat en tachymeter vormen één geheel`);
  }
  if (bezel.color === strap.color) {
    score += 14;
    explanation.push(`${bezel.color} tachymeter en band sluiten op elkaar aan`);
  }

  if (moon.colorFamily === strap.colorFamily && moon.color !== strap.color && !isNeutral(moon) && !isNeutral(strap)) {
    score += 18;
    explanation.push(`${moon.color} en ${strap.color} zitten in dezelfde kleurfamilie`);
  }
  if (moon.colorFamily === bezel.colorFamily && moon.color !== bezel.color && !isNeutral(moon) && !isNeutral(bezel)) {
    score += 12;
    explanation.push(`${moon.color} en ${bezel.color} werken als ton-sur-ton combinatie`);
  }

  const summerColors = visibleColorParts.filter((part) => ["Lichtblauw", "Felroze", "Roze", "Wit", "Geel"].includes(part.color)).length;
  if (summerColors > 0) {
    score += summerColors * 8;
    explanation.push("Lichte of felle kleur geeft een zomerse uitstraling");
  }

  const clashes = [
    [moon.color, bezel.color],
    [moon.color, strap.color],
    [bezel.color, strap.color]
  ].filter(([a, b]) => areClashingColors(a, b)).length;

  if (clashes > 0) {
    score -= clashes * 24;
    explanation.push("Een paar kleuren kunnen met elkaar vloeken");
  }

  const brightParts = visibleColorParts.filter((part) => ["Fel", "Licht"].includes(part.colorTone) && part.color !== "Wit");
  const sameFamilyBright = new Set(brightParts.map((part) => part.colorFamily)).size <= 1;

  if (brightParts.length >= 2 && sameFamilyBright) {
    score += 14;
    explanation.push("Meerdere frisse kleuren blijven rustig doordat ze bij elkaar horen");
  } else if (brightParts.length >= 3 && clashes === 0) {
    score += 4;
    explanation.push("Opvallend, maar zonder duidelijke kleurclash");
  }

  return { score, explanation };
}

function scoreCombination(moon, bezel, watchCase, strap) {
  let score = 0;
  const explanation = [];
  const tagCounts = sharedTags(moon, bezel, watchCase, strap);

  Object.entries(tagCounts).forEach(([tag, count]) => {
    if (count >= 2) score += count * 8;
    if (count >= 3) explanation.push(`Sterke ${tag}-match`);
  });

  if (watchCase.color === "Staal" && strap.material === "Staal") {
    score += 18;
    explanation.push("Stalen kast en stalen band passen goed samen");
  }
  if (watchCase.color === "Zwart" && strap.color === "Zwart") {
    score += 16;
    explanation.push("Zwarte kast en zwarte band geven een strak geheel");
  }
  if (strap.material === "Leer" && ["Staal", "Zwart"].includes(watchCase.color)) {
    score += 10;
    explanation.push("Leren band maakt de combinatie netter");
  }

  const harmony = colorHarmonyScore(moon, bezel, strap);
  score += harmony.score;
  explanation.push(...harmony.explanation);

  if (["Blauw", "Donkerblauw", "Lichtblauw"].includes(moon.color) && ["Donkerbruin", "Lichtbruin", "Bruin"].includes(strap.color)) {
    score += 16;
    explanation.push("Blauw met bruin geeft een sterke casual/chique combinatie");
  }

  const neutralSupport = [bezel, watchCase, strap].filter(isNeutral).length;
  if (neutralSupport >= 2 && ["Fel", "Licht"].includes(moon.colorTone)) {
    score += 10;
    explanation.push("Rustige onderdelen laten de wijzerplaat mooi spreken");
  }

  return { score, explanation: explanation.slice(0, 3) };
}

export function buildCombinations() {
  const combinations = [];
  moonswatches.forEach((moon) => {
    bezels.forEach((bezel) => {
      cases.forEach((watchCase) => {
        straps.forEach((strap) => {
          const scoring = scoreCombination(moon, bezel, watchCase, strap);
          const tags = Array.from(new Set([...moon.tags, ...bezel.tags, ...watchCase.tags, ...strap.tags].map(normalizeTag)));
          combinations.push({
            id: `${moon.id}-${bezel.id}-${watchCase.id}-${strap.id}`,
            name: `${moon.color} / ${bezel.color} / ${strap.name}`,
            moon,
            bezel,
            watchCase,
            strap,
            tags,
            score: scoring.score,
            scoreExplanation: scoring.explanation
          });
        });
      });
    });
  });
  return combinations;
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return function random() {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function sortCombinations(combinations, mode, seed) {
  const random = seededRandom(seed || 1);
  return [...combinations]
    .map((combo) => {
      const randomBoost = random() * 100;
      const stableNoise = (hashString(`${combo.id}-${seed}`) % 100) / 100;
      let sortValue = combo.score;
      if (mode === "balanced") sortValue = combo.score * 0.72 + randomBoost * 0.28 + stableNoise;
      if (mode === "surprise") sortValue = combo.score * 0.45 + randomBoost * 0.55 + stableNoise;
      if (mode === "top") sortValue = combo.score;
      return { ...combo, sortValue };
    })
    .sort((a, b) => b.sortValue - a.sortValue);
}

export function getDailySeed() {
  const today = new Date();
  return Number(`${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`);
}
