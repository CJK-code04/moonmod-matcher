import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, RotateCcw, Star, Watch, X, Layers3 } from "lucide-react";
import FiltersPanel from "./components/FiltersPanel.jsx";
import ProductDetailModal from "./components/ProductDetailModal.jsx";
import SwipeCard from "./components/SwipeCard.jsx";
import WatchPreview from "./components/WatchPreview.jsx";
import ScorePill from "./components/ScorePill.jsx";
import { buildCombinations, getDailySeed, sortCombinations } from "./utils/scoring.js";

const defaultFilters = {
  style: "Alle",
  moonswatchColor: "Alle",
  snoopy: "Alle",
  bezelColor: "Alle",
  caseColor: "Alle",
  strapColor: "Alle",
  strapMaterial: "Alle"
};

export default function App() {
  const [filters, setFilters] = useState(defaultFilters);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [activeTab, setActiveTab] = useState("swipe");
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [discoveryMode, setDiscoveryMode] = useState("balanced");
  const [shuffleSeed, setShuffleSeed] = useState(() => getDailySeed());

  const allCombinations = useMemo(() => buildCombinations(), []);
  const likedIds = useMemo(() => new Set(liked.map((item) => item.id)), [liked]);

  const filteredCombinations = useMemo(() => {
    const selectedStyle = filters.style === "Alle" ? null : filters.style.toLowerCase();
    const matches = allCombinations.filter((combo) => {
      const styleMatch = !selectedStyle || combo.tags.includes(selectedStyle);
      const moonMatch = filters.moonswatchColor === "Alle" || combo.moon.color === filters.moonswatchColor;
      const snoopyMatch = filters.snoopy === "Alle" || combo.moon.snoopy === filters.snoopy;
      const bezelMatch = filters.bezelColor === "Alle" || combo.bezel.color === filters.bezelColor;
      const caseMatch = filters.caseColor === "Alle" || combo.watchCase.color === filters.caseColor;
      const strapColorMatch = filters.strapColor === "Alle" || combo.strap.color === filters.strapColor;
      const strapMaterialMatch = filters.strapMaterial === "Alle" || combo.strap.material === filters.strapMaterial;
      return styleMatch && moonMatch && snoopyMatch && bezelMatch && caseMatch && strapColorMatch && strapMaterialMatch;
    });
    return sortCombinations(matches, discoveryMode, shuffleSeed);
  }, [allCombinations, filters, discoveryMode, shuffleSeed]);

  const current = filteredCombinations[index];
  const next = filteredCombinations[index + 1];
  const progress = filteredCombinations.length === 0 ? 0 : Math.min((index / filteredCombinations.length) * 100, 100);
  const hasActiveFilters = Object.values(filters).some((value) => value !== "Alle");

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setIndex(0);
    setRejected([]);
  }

  function resetFilters() {
    setFilters(defaultFilters);
    setIndex(0);
    setRejected([]);
  }

  function reshuffle() {
    setShuffleSeed(Date.now());
    setIndex(0);
    setRejected([]);
  }

  function changeDiscoveryMode(mode) {
    setDiscoveryMode(mode);
    setIndex(0);
    setRejected([]);
  }

  function nextCombo() {
    setIndex((prev) => Math.min(prev + 1, filteredCombinations.length));
  }

  function likeCombo(combo) {
    if (!combo) return;
    if (!likedIds.has(combo.id)) setLiked((prev) => [...prev, combo]);
    nextCombo();
  }

  function rejectCombo(combo) {
    if (!combo) return;
    setRejected((prev) => [...prev, combo]);
    nextCombo();
  }

  function restart() {
    setIndex(0);
    setLiked([]);
    setRejected([]);
    setActiveTab("swipe");
  }

  return (
    <main className="app-shell">
      <div className="container">
        <header className="hero">
          <div>
            <div className="eyebrow"><Watch size={17} /> MoonSwatch mod prototype</div>
            <h1>MoonMod Matcher</h1>
            <p>Swipe door automatisch gegenereerde combinaties. De MoonSwatch-foto’s uit je zip worden gebruikt als wijzerplaatlaag.</p>
          </div>
          <nav className="tabs">
            <button className={activeTab === "swipe" ? "active" : ""} onClick={() => setActiveTab("swipe")}>Swipen</button>
            <button className={activeTab === "favorites" ? "active" : ""} onClick={() => setActiveTab("favorites")}>Favorieten ({liked.length})</button>
            <button className={activeTab === "plan" ? "active" : ""} onClick={() => setActiveTab("plan")}>Plan</button>
          </nav>
        </header>

        {activeTab === "swipe" && (
          <div className="layout-grid">
            <section className="panel swipe-panel">
              <div className="progress-row">
                <span>{filteredCombinations.length === 0 ? "Geen combinaties" : `Combinatie ${Math.min(index + 1, filteredCombinations.length)} van ${filteredCombinations.length}`}</span>
                <span>{Math.round(progress)}% bekeken</span>
              </div>
              <div className="progress-bar"><div style={{ width: `${progress}%` }} /></div>

              <div className="card-stage">
                {filteredCombinations.length === 0 ? (
                  <div className="empty-state">
                    <Layers3 size={48} />
                    <h2>Geen resultaten</h2>
                    <p>Deze filtercombinatie heeft geen opties. Zet een filter terug naar Alle.</p>
                    <button className="primary-button" onClick={resetFilters}>Filters resetten</button>
                  </div>
                ) : current ? (
                  <AnimatePresence mode="popLayout">
                    {next && (
                      <motion.div key={`next-${next.id}`} className="next-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 0.94, opacity: 0.7 }}>
                        <WatchPreview combo={next} />
                        <div className="card-content"><h2>{next.name}</h2><p>Volgende combinatie</p></div>
                      </motion.div>
                    )}
                    <SwipeCard key={current.id} combo={current} onLike={likeCombo} onReject={rejectCombo} onOpenDetail={setSelectedCombo} />
                  </AnimatePresence>
                ) : (
                  <div className="empty-state">
                    <Star size={48} />
                    <h2>Alles bekeken</h2>
                    <p>Je hebt {liked.length} combinatie{liked.length === 1 ? "" : "s"} opgeslagen. Pas je filters aan of shuffle opnieuw.</p>
                    <div className="button-row"><button className="primary-button" onClick={() => setActiveTab("favorites")}>Bekijk favorieten</button><button className="outline-button" onClick={() => setIndex(0)}>Nog een keer</button></div>
                  </div>
                )}
              </div>

              {current && (
                <div className="swipe-actions">
                  <button className="outline-button large" onClick={() => rejectCombo(current)}><X size={20} /> Niet mooi</button>
                  <button className="primary-button large" onClick={() => likeCombo(current)}><Heart size={20} /> Opslaan</button>
                </div>
              )}
              <p className="hint">Sleep de kaart naar links of rechts. Klik op het horloge voor de productpagina.</p>
            </section>

            <aside className="side-stack">
              <FiltersPanel filters={filters} setFilter={setFilter} resetFilters={resetFilters} hasActiveFilters={hasActiveFilters} resultCount={filteredCombinations.length} discoveryMode={discoveryMode} setDiscoveryMode={changeDiscoveryMode} reshuffle={reshuffle} />
              {current && (
                <section className="panel">
                  <h2>Huidige match</h2>
                  <ScorePill score={current.score} />
                  <div className="mini-details">
                    <p><strong>MoonSwatch:</strong> {current.moon.name}</p>
                    <p><strong>Snoopy:</strong> {current.moon.snoopy}</p>
                    <p><strong>Tachymeter:</strong> {current.bezel.name}</p>
                    <p><strong>Kast:</strong> {current.watchCase.name}</p>
                    <p><strong>Band:</strong> {current.strap.name}</p>
                  </div>
                </section>
              )}
            </aside>
          </div>
        )}

        {activeTab === "favorites" && (
          <section>
            {liked.length === 0 ? (
              <div className="panel empty-state"><Heart size={48} /><h2>Nog geen favorieten</h2><p>Sla eerst een paar combinaties op tijdens het swipen.</p></div>
            ) : (
              <div className="favorites-grid">
                {liked.map((combo) => (
                  <article className="favorite-card" key={combo.id}>
                    <button onClick={() => setSelectedCombo(combo)}><WatchPreview combo={combo} small /></button>
                    <h3>{combo.name}</h3>
                    <p>{combo.moon.name} · {combo.strap.name}</p>
                    <ScorePill score={combo.score} />
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "plan" && (
          <section className="plan-grid">
            <div className="panel">
              <h2>Projectstructuur</h2>
              <p>De code is nu opgesplitst in losse bestanden: data, componenten, styling en scorelogica. Daardoor wordt het project niet meer te groot voor één canvasbestand.</p>
              <ul>
                <li><strong>src/data</strong>: MoonSwatches, bezels, kasten en bandjes.</li>
                <li><strong>src/components</strong>: swipekaart, preview, filters en productpagina.</li>
                <li><strong>src/utils/scoring.js</strong>: matchscore, shuffle en volgorde.</li>
                <li><strong>public/assets/moonswatches</strong>: de echte foto’s uit je zip.</li>
              </ul>
            </div>
            <div className="panel">
              <h2>Wat nog ontbreekt</h2>
              <p>De MoonSwatch-foto’s zitten erin. De accessoires zijn nu nog visuele placeholders. Zodra je bezels, kasten en bandjes als foto's stuurt, kunnen die ook als echte lagen worden toegevoegd.</p>
            </div>
          </section>
        )}

        <footer className="footer-bar">
          <span>Totaal gegenereerd: {allCombinations.length} · Modus: {discoveryMode === "top" ? "beste matches" : discoveryMode === "balanced" ? "gebalanceerd" : "verrassing"} · Afgewezen: {rejected.length} · Opgeslagen: {liked.length}</span>
          <button className="outline-button" onClick={restart}><RotateCcw size={16} /> Reset</button>
        </footer>
      </div>

      <AnimatePresence>
        {selectedCombo && <ProductDetailModal combo={selectedCombo} onClose={() => setSelectedCombo(null)} onLike={likeCombo} isLiked={likedIds.has(selectedCombo.id)} />}
      </AnimatePresence>
    </main>
  );
}
