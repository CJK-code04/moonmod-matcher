# MoonMod Matcher

Werkend React/Vite project voor het MoonSwatch-mod prototype.

## Wat zit erin?

- Swipe-interface met vloeiend slepen naar links/rechts.
- De volgende kaart staat alvast achter de huidige kaart.
- Productdetail/inzoompagina bij klikken op een horloge.
- Filters voor stijl, MoonSwatch-kleur, Snoopy, tachymeter, kast, bandkleur en bandmateriaal.
- Ontdekkingsmodi: beste matches, gebalanceerd ontdekken en verrassingsmodus.
- Shuffle-knop zodat je niet steeds dezelfde volgorde ziet.
- Matchscore met uitleg waarom combinaties goed passen.
- MoonSwatch-afbeeldingen uit de zip staan in `public/assets/moonswatches/`.
- De MoonSwatch-afbeeldingen worden alleen gebruikt als wijzerplaatlaag.
- `Mission to the Moon Moonshine Gold Harvest` is niet toegevoegd.

## Installeren en draaien

Open een terminal in deze map en voer uit:

```bash
npm install
npm run dev
```

Daarna opent Vite meestal op:

```text
http://localhost:5173
```

## Belangrijke mappen

```text
public/assets/moonswatches/   echte MoonSwatch-afbeeldingen
src/data/moonswatches.js      data van de MoonSwatches
src/data/bezels.js            tijdelijke bezel-data
src/data/cases.js             tijdelijke kast-data
src/data/straps.js            bandjes-data
src/utils/scoring.js          matchscore, shuffle en combinatiegenerator
src/components/               losse UI-componenten
```

## Later toevoegen

De accessoires zijn nu nog visuele placeholders. Zodra er echte foto’s zijn voor bezels, kasten en bandjes, kunnen die op dezelfde manier worden toegevoegd als losse lagen.
