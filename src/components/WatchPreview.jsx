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
    strap: 420,
    case: 238,
    dial: 182,
    bezel: 238
  },
  small: {
    stage: 220,
    strap: 292,
    case: 164,
    dial: 126,
    bezel: 164
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

function layerStyle(size, layer, zIndex) {
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: `${size[layer]}px`,
    height: `${size[layer]}px`,
    objectFit: "contain",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    userSelect: "none",
    zIndex
  };
}

export default function WatchPreview({ combo, small = false }) {
  const size = small ? dimensions.small : dimensions.normal;
  const strapSrc = assetSrc(combo.strap, "straps");
  const caseSrc = assetSrc(combo.watchCase, "cases");
  const dialSrc = assetSrc(combo.moon, "dials");
  const bezelSrc = assetSrc(combo.bezel, "bezels");

  return (
    <div className={`watch-preview ${small ? "watch-preview-small" : ""} ${backgroundClass(combo)}`}>
      <div className="watch-stack" style={stageStyle(size)} aria-label={`${combo.name} preview`}>
        <img src={strapSrc} alt={`${combo.strap.name} laag`} draggable="false" style={layerStyle(size, "strap", 1)} />
        <img src={caseSrc} alt={`${combo.watchCase.name} laag`} draggable="false" style={layerStyle(size, "case", 2)} />
        <img src={dialSrc} alt={`${combo.moon.name} wijzerplaat`} draggable="false" style={layerStyle(size, "dial", 3)} />
        <img src={bezelSrc} alt={`${combo.bezel.name} laag`} draggable="false" style={layerStyle(size, "bezel", 4)} />
      </div>
    </div>
  );
}
