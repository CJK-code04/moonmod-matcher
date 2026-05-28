function backgroundClass(combo) {
  if (combo.tags.includes("zomers")) return "preview-summer";
  if (combo.tags.includes("sportief")) return "preview-sport";
  if (combo.tags.includes("vintage")) return "preview-vintage";
  if (combo.tags.includes("formeel")) return "preview-formal";
  return "preview-default";
}

function assetSrc(part, folder) {
  if (!part) return "";
  return part.image || `/assets/${folder}/${part.id}.png`;
}

export default function WatchPreview({ combo, small = false }) {
  const strapSrc = assetSrc(combo.strap, "straps");
  const caseSrc = assetSrc(combo.watchCase, "cases");
  const dialSrc = assetSrc(combo.moon, "dials");
  const bezelSrc = assetSrc(combo.bezel, "bezels");

  return (
    <div className={`watch-preview ${small ? "watch-preview-small" : ""} ${backgroundClass(combo)}`}>
      <div className="watch-stack" aria-label={`${combo.name} preview`}>
        <img src={strapSrc} alt={`${combo.strap.name} laag`} className="watch-layer watch-layer-strap" draggable="false" />
        <img src={caseSrc} alt={`${combo.watchCase.name} laag`} className="watch-layer watch-layer-case" draggable="false" />
        <img src={dialSrc} alt={`${combo.moon.name} wijzerplaat`} className="watch-layer watch-layer-dial" draggable="false" />
        <img src={bezelSrc} alt={`${combo.bezel.name} laag`} className="watch-layer watch-layer-bezel" draggable="false" />
      </div>
    </div>
  );
}
