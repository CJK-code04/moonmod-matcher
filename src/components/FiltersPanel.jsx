import { Filter, Trophy, Shuffle } from "lucide-react";

const filterConfig = [
  { key: "style", label: "Soort horloge", options: ["Alle", "Zomers", "Zakelijk", "Formeel", "Sportief", "Casual", "Vintage", "Opvallend", "Daily"] },
  { key: "moonswatchColor", label: "MoonSwatch kleur", options: ["Alle", "Blauw", "Donkerblauw", "Lichtblauw", "Wit", "Zwart", "Grijs", "Groen", "Rood", "Wit/Rood", "Roze", "Felroze", "Beige", "Beige/Bruin", "Crème/Bordeaux", "Geel", "Bruin"] },
  { key: "snoopy", label: "Snoopy", options: ["Alle", "Nee", "Ja"] },
  { key: "bezelColor", label: "Tachymeter", options: ["Alle", "Staal", "Wit", "Zwart", "Blauw", "Lichtblauw", "Groen", "Rood", "Felroze", "Bruin"] },
  { key: "caseColor", label: "Kast", options: ["Alle", "Staal", "Zwart"] },
  { key: "strapColor", label: "Band kleur", options: ["Alle", "Staal", "Wit", "Zwart", "Grijs", "Donkerblauw", "Lichtblauw", "Donkergroen", "Lichtbruin", "Donkerbruin"] },
  { key: "strapMaterial", label: "Band materiaal", options: ["Alle", "Staal", "Leer", "Rubber", "Stoffen"] }
];

function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="select-label">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default function FiltersPanel({ filters, setFilter, resetFilters, hasActiveFilters, resultCount, discoveryMode, setDiscoveryMode, reshuffle }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2><Filter size={20} /> Filters</h2>
        {hasActiveFilters && <button className="ghost-button" onClick={resetFilters}>Reset</button>}
      </div>

      <div className="filter-grid">
        {filterConfig.map((filter) => (
          <SelectFilter key={filter.key} label={filter.label} value={filters[filter.key]} options={filter.options} onChange={(value) => setFilter(filter.key, value)} />
        ))}
      </div>

      <div className="sort-box">
        <h3><Trophy size={16} /> Volgorde</h3>
        <button className={discoveryMode === "top" ? "mode-button active" : "mode-button"} onClick={() => setDiscoveryMode("top")}>Beste matches eerst</button>
        <button className={discoveryMode === "balanced" ? "mode-button active" : "mode-button"} onClick={() => setDiscoveryMode("balanced")}>Gebalanceerd ontdekken</button>
        <button className={discoveryMode === "surprise" ? "mode-button active" : "mode-button"} onClick={() => setDiscoveryMode("surprise")}>Verrassingsmodus</button>
        <button className="shuffle-button" onClick={reshuffle}><Shuffle size={16} /> Shuffle opnieuw</button>
        <p>{resultCount} combinaties gevonden. De score blijft meetellen, maar shuffle voorkomt dat je steeds dezelfde volgorde ziet.</p>
      </div>
    </section>
  );
}
