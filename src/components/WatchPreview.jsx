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

const stageStyle = {
  position: "relative",
  width: "320px",
  height: "320px",
  maxWidth: "100%",
  margin: "0 auto"
};

const smallStageStyle = {
  ...stageStyle,
  width: "220px",
  height: "220px"
};

const baseLayerStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  objectFit: "contain",
  pointerEvents: "none",
  userSelect: "none"
};

const layerStyle = ({ size, zIndex, x = 0, y = 0 }) => ({
  ...baseLayerStyle,
  width: size,
  height: size,
  zIndex,
  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
});

const layerSizes = {
  regular: {
    strap: { rubber: "790px", fabric: "790px", leather: "925px", steel: "1065px", zIndex: 1 },
    case: { size: "210px", zIndex: 2 },
    dial: { size: "166px", x: -2, y: -1, zIndex: 3 },
    bezel: { size: "232px", x: -2, y: -1, zIndex: 4 }
  },
  small: {
    strap: { rubber: "545px", fabric: "545px", leather: "635px", steel: "735px", zIndex: 1 },
    case: { size: "145px", zIndex: 2 },
    dial: { size: "115px", x: -1, y: -1, zIndex: 3 },
    bezel: { size: "160px", x: -1, y: -1, zIndex: 4 }
  }
};

const bezelCorrections = {
  regular: {
    bezel_steel: { size: "235px", x: -1, y: -1 },
    bezel_black: { size: "236px", x: -3, y: -1 },
    bezel_blue: { size: "235px", x: -3, y: -2 },
    bezel_green: { size: "235px", x: -3, y: -2 },
    bezel_red: { size: "235px", x: -3, y: -2 }
  },
  small: {
    bezel_steel: { size: "162px", x: -1, y: -1 },
    bezel_black: { size: "163px", x: -2, y: -1 },
    bezel_blue: { size: "162px", x: -2, y: -1 },
    bezel_green: { size: "162px", x: -2, y: -1 },
    bezel_red: { size: "162px", x: -2, y: -1 }
  }
};

function strapSizeFor(strap, sizes) {
  if (strap.material === "Staal") return sizes.strap.steel;
  if (strap.material === "Leer") return sizes.strap.leather;
  if (strap.material === "Stoffen") return sizes.strap.fabric;
  return sizes.strap.rubber;
}

function correctedLayer(layer, correction) {
  return correction ? { ...layer, ...correction } : layer;
}

function correctedDial(layer, correction) {
  return correction ? { ...layer, x: correction.x, y: correction.y } : layer;
}

export default function WatchPreview({ combo, small = false }) {
  const strapSrc = assetSrc(combo.strap, "straps");
  const caseSrc = assetSrc(combo.watchCase, "cases");
  const dialSrc = assetSrc(combo.moon, "dials");
  const bezelSrc = assetSrc(combo.bezel, "bezels");
  const mode = small ? "small" : "regular";
  const sizes = layerSizes[mode];
  const bezelCorrection = bezelCorrections[mode][combo.bezel.id];
  const bezelStyle = correctedLayer(sizes.bezel, bezelCorrection);
  const dialStyle = correctedDial(sizes.dial, bezelCorrection);
  const strapStyle = {
    size: strapSizeFor(combo.strap, sizes),
    zIndex: sizes.strap.zIndex
  };

  return (
    <div className={`watch-preview ${small ? "watch-preview-small" : ""} ${backgroundClass(combo)}`}>
      <div className="watch-stack" style={small ? smallStageStyle : stageStyle} aria-label={`${combo.name} preview`}>
        <img src={strapSrc} alt={`${combo.strap.name} laag`} draggable="false" style={layerStyle(strapStyle)} />
        <img src={caseSrc} alt={`${combo.watchCase.name} laag`} draggable="false" style={layerStyle(sizes.case)} />
        <img src={dialSrc} alt={`${combo.moon.name} wijzerplaat`} draggable="false" style={layerStyle(dialStyle)} />
        <img src={bezelSrc} alt={`${combo.bezel.name} laag`} draggable="false" style={layerStyle(bezelStyle)} />
      </div>
    </div>
  );
}
