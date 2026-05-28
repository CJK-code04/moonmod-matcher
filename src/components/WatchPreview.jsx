function backgroundClass(combo) {
  if (combo.tags.includes("zomers")) return "preview-summer";
  if (combo.tags.includes("sportief")) return "preview-sport";
  if (combo.tags.includes("vintage")) return "preview-vintage";
  if (combo.tags.includes("formeel")) return "preview-formal";
  return "preview-default";
}

function assetSrc(part, folder) {
  if (!part?.id) return "";
  return `/assets/${folder}/${part.id}.png`;
}

const stageStyle = {
  position: "relative",
  width: "min(320px, 88vw)",
  height: "min(320px, 88vw)",
  margin: "0 auto"
};

const smallStageStyle = {
  ...stageStyle,
  width: "220px",
  height: "220px"
};

const baseLayerStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  pointerEvents: "none",
  userSelect: "none"
};

export default function WatchPreview({ combo, small = false }) {
  const strapSrc = assetSrc(combo.strap, "straps");
  const caseSrc = assetSrc(combo.watchCase, "cases");
  const dialSrc = assetSrc(combo.moon, "dials");
  const bezelSrc = assetSrc(combo.bezel, "bezels");

  return (
    <div className={`watch-preview ${small ? "watch-preview-small" : ""} ${backgroundClass(combo)}`}>
      <div className="watch-stack" style={small ? smallStageStyle : stageStyle} aria-label={`${combo.name} preview`}>
        <img src={strapSrc} alt={`${combo.strap.name} laag`} draggable="false" style={{ ...baseLayerStyle, zIndex: 1 }} />
        <img src={caseSrc} alt={`${combo.watchCase.name} laag`} draggable="false" style={{ ...baseLayerStyle, zIndex: 2 }} />
        <img src={dialSrc} alt={`${combo.moon.name} wijzerplaat`} draggable="false" style={{ ...baseLayerStyle, zIndex: 3 }} />
        <img src={bezelSrc} alt={`${combo.bezel.name} laag`} draggable="false" style={{ ...baseLayerStyle, zIndex: 4 }} />
      </div>
    </div>
  );
}
