function backgroundClass(combo) {
  if (combo.tags.includes("zomers")) return "preview-summer";
  if (combo.tags.includes("sportief")) return "preview-sport";
  if (combo.tags.includes("vintage")) return "preview-vintage";
  if (combo.tags.includes("formeel")) return "preview-formal";
  return "preview-default";
}

export default function WatchPreview({ combo, small = false }) {
  return (
    <div className={`watch-preview ${small ? "watch-preview-small" : ""} ${backgroundClass(combo)}`}>
      <div className="preview-badge">Wijzerplaatlaag</div>
      <div className="watch-stack">
        <div className={`strap strap-top ${combo.strap.className}`} />
        <div className={`case ${combo.watchCase.className}`}>
          <div className={`bezel ${combo.bezel.className}`}>
            <div className={`dial ${combo.moon.dialClass}`}>
              {combo.moon.image && (
                <img
                  src={combo.moon.image}
                  alt={combo.moon.name}
                  className="dial-image"
                  style={{
                    objectPosition: `${combo.moon.imageFit?.x ?? 50}% ${combo.moon.imageFit?.y ?? 50}%`,
                    transform: `scale(${combo.moon.imageFit?.scale ?? 1})`
                  }}
                />
              )}
              <div className="hand hand-minute" />
              <div className="hand hand-hour" />
              <div className="hand-dot" />
            </div>
          </div>
        </div>
        <div className={`strap strap-bottom ${combo.strap.className}`} />
      </div>
    </div>
  );
}
