import { motion, useMotionValue, useTransform } from "framer-motion";
import { Maximize2 } from "lucide-react";
import WatchPreview from "./WatchPreview.jsx";
import ScorePill from "./ScorePill.jsx";

export default function SwipeCard({ combo, onLike, onReject, onOpenDetail }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 0, 240], [-16, 0, 16]);
  const likeOpacity = useTransform(x, [40, 150], [0, 1]);
  const rejectOpacity = useTransform(x, [-150, -40], [1, 0]);

  function handleDragEnd(_, info) {
    if (info.offset.x > 130 || info.velocity.x > 700) return onLike(combo);
    if (info.offset.x < -130 || info.velocity.x < -700) return onReject(combo);
  }

  return (
    <motion.div
      className="swipe-card"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <button className="icon-button detail-floating" onClick={() => onOpenDetail(combo)} aria-label="Open details">
        <Maximize2 size={18} />
      </button>
      <div className="score-floating"><ScorePill score={combo.score} /></div>
      <motion.div style={{ opacity: likeOpacity }} className="stamp stamp-like">Opslaan</motion.div>
      <motion.div style={{ opacity: rejectOpacity }} className="stamp stamp-nope">Nope</motion.div>

      <button className="preview-click" onClick={() => onOpenDetail(combo)}>
        <WatchPreview combo={combo} />
      </button>
      <div className="card-content">
        <h2>{combo.name}</h2>
        <p>{combo.moon.name} met {combo.bezel.name.toLowerCase()}, {combo.watchCase.name.toLowerCase()} en {combo.strap.name.toLowerCase()}.</p>
        <div className="chip-grid">
          <span>MoonSwatch: {combo.moon.color}</span>
          <span>Snoopy: {combo.moon.snoopy}</span>
          <span>Tachy: {combo.bezel.color}</span>
          <span>Band: {combo.strap.material}</span>
        </div>
      </div>
    </motion.div>
  );
}
