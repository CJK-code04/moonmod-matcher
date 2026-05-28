function backgroundClass(combo) {
  if (combo.tags.includes("zomers")) return "preview-summer";
  if (combo.tags.includes("sportief")) return "preview-sport";
  if (combo.tags.includes("vintage")) return "preview-vintage";
  if (combo.tags.includes("formeel")) return "preview-formal";
  return "preview-default";
}

function assetSrc(part, folder) {
  if (!part?.id) return "";
  const baseUrl = import.meta.env.BASE_URL || "/";
  return `${baseUrl}assets/${folder}/${part.id}.png`;
}

const dimensions = {
  normal: {
    stage: 320,
    strap: 790,
    case: 210,
    dial: 158,
    bezel: 210
  },
  small: {
    stage: 220,
    strap: 545,
    case: 145,
    dial: 109,
    bezel: 145
  }
};

const offsets = {
  normal: {
    strap: { x: 0, y: 0 },
    case: { x: 0, y: 0 },
    dial: { x: -4, y: -3 },
    bezel: { x: -4, y: -3 }
  },
  small: {
    strap: { x: 0, y: 0 },
    case: { x: 0, y: 0 },
    dial: { x: -3, y: -2 },
    bezel: { x: -3, y: -2 }
  }
};

function stageStyle(size) {
  return {
    position: "relative",
    width: `${size.stage}px`,
    height: `${size.stage}px`,
    maxWidth: "88vw",
    maxHeight: "88vw",
    margin: "0 auto"
  };
}

function layerStyle(size, offsetSet, layer, zIndex) {
  const offset = offsetSet[layer] || { x: 0, y: 0 };

  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: `${size[layer]}px`,
    height: `${size[layer]}px`,
    objectFit: "contain",
    transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
    pointerEvents: "none",
    userSelect: "none",
    zIndex
  };
}

export default function WatchPreview({ combo, small = false }) {
  const mode = small ? "small" : "normal";
  const size = dimensions[mode];
  const offsetSet = offsets[mode];
  const strapSrc = assetSrc(combo.strap, "straps");
  const caseSrc = assetSrc(combo.watchCase, "cases");
  const dialSrc = assetSrc(combo.moon, "dials");
  const bezelSrc = assetSrc(combo.bezel, "bezels");

  return (
    <div className={`watch-preview ${small ? "watch-preview-small" : ""} ${backgroundClass(combo)}`}>
      <div className="watch-stack" style={stageStyle(size)} aria-label={`${combo.name} preview`}>
        <img src={strapSrc} alt={`${combo.strap.name} laag`} draggable="false" style={layerStyle(size, offsetSet, "strap", 1)} />
        <img src={caseSrc} alt={`${combo.watchCase.name} laag`} draggable="false" style={layerStyle(size, offsetSet, "case", 2)} />
        <img src={dialSrc} alt={`${combo.moon.name} wijzerplaat`} draggable="false" style={layerStyle(size, offsetSet, "dial", 3)} />
        <img src={bezelSrc} alt={`${combo.bezel.name} laag`} draggable="false" style={layerStyle(size, offsetSet, "bezel", 4)} />
      </div>
    </div>
  );
}
