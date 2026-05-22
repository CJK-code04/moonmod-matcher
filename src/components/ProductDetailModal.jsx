import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingBag, Sparkles } from "lucide-react";
import WatchPreview from "./WatchPreview.jsx";
import DetailRow from "./DetailRow.jsx";
import ScorePill from "./ScorePill.jsx";

export default function ProductDetailModal({ combo, onClose, onLike, isLiked }) {
  if (!combo) return null;

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal" initial={{ y: 24, scale: 0.98, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 24, scale: 0.98, opacity: 0 }} onClick={(event) => event.stopPropagation()}>
        <div className="modal-topbar">
          <button className="ghost-button" onClick={onClose}><ArrowLeft size={18} /> Terug</button>
          <button className="outline-button" onClick={() => onLike(combo)}><Heart size={18} /> {isLiked ? "Opgeslagen" : "Opslaan"}</button>
        </div>
        <div className="modal-grid">
          <div>
            <div className="large-preview"><WatchPreview combo={combo} /></div>
            <div className="thumb-grid">
              {['Voorkant', 'Close-up', 'Band/detail'].map((label) => (
                <div className="thumb" key={label}>
                  <WatchPreview combo={combo} small />
                  <p>{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <ScorePill score={combo.score} />
            <h1>{combo.name}</h1>
            <p className="muted">Grotere productpagina met de combinatie, onderdelen, Snoopy-info, stijl-tags en match-uitleg.</p>
            <section className="info-box">
              <h3><ShoppingBag size={17} /> Onderdelen</h3>
              <DetailRow label="MoonSwatch" value={`${combo.moon.name} · ${combo.moon.color}`} />
              <DetailRow label="Snoopy" value={combo.moon.snoopy} />
              <DetailRow label="Tachymeter" value={`${combo.bezel.name} · ${combo.bezel.color}`} />
              <DetailRow label="Kast" value={combo.watchCase.name} />
              <DetailRow label="Band" value={`${combo.strap.name} · ${combo.strap.material}`} />
            </section>
            <section className="info-box">
              <h3><Sparkles size={17} /> Match-uitleg</h3>
              <ul>
                {(combo.scoreExplanation.length ? combo.scoreExplanation : ["Deze combinatie past binnen de gekozen filters."]).map((reason) => <li key={reason}>{reason}</li>)}
              </ul>
            </section>
            <section className="info-box">
              <h3>Stijl-tags</h3>
              <div className="tag-list">{combo.tags.slice(0, 12).map((tag) => <span key={tag}>{tag}</span>)}</div>
            </section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
