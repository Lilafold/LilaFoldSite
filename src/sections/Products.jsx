import SectionHead from "./SectionHead.jsx";
import { ArrowRight } from "../components/Icons.jsx";

// The three products are the three bands of the logo's ribbon, top to bottom.
const folds = [
  {
    key: "models",
    status: "First up",
    title: "Specialised models",
    body: "Compact models of 100M to 500M parameters, a small fraction of today's large models, each trained for one field. The first is for cybersecurity.",
    href: "#models",
    link: "The models",
  },
  {
    key: "cloud",
    status: "Early access",
    title: "LilaFold Cloud",
    body: "Our models behind a simple API. Pay per request or subscribe. No GPUs to rent or manage.",
    href: "#platform",
    link: "The platform",
  },
  {
    key: "hardware",
    status: "In research",
    title: "Modular hardware",
    body: "NPU modules that connect together. Start with one and add more as your workload grows.",
    href: "#hardware",
    link: "The hardware",
  },
];

export default function Products() {
  return (
    <section className="section" id="products">
      <SectionHead title="One ribbon, three folds">
        Our logo is a ribbon folded three times, and so is the company. Models first, then the cloud that
        serves them, then hardware that lets you run them on your own terms.
      </SectionHead>
      <div className="folds">
        {folds.map((f, i) => (
          <a key={f.key} className={`fold fold-${f.key} sr`} style={{ "--d": i }} href={f.href}>
            <div className="fold-title">
              <span className="fold-status">{f.status}</span>
              <h3>{f.title}</h3>
            </div>
            <p>{f.body}</p>
            <span className="fold-link">{f.link} <ArrowRight /></span>
          </a>
        ))}
      </div>
    </section>
  );
}
