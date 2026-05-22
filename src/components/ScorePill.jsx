import { Sparkles } from "lucide-react";

export default function ScorePill({ score }) {
  let label = "Prima match";
  if (score >= 90) label = "Topmatch";
  else if (score >= 65) label = "Sterke match";
  else if (score < 25) label = "Experimenteel";

  return (
    <span className="score-pill">
      <Sparkles size={15} /> {label} · {score} punten
    </span>
  );
}
