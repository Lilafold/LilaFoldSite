import SectionHead from "./SectionHead.jsx";
import { FoldMark } from "../components/Icons.jsx";

const next = ["Freight and logistics", "Software engineering", "Forecasting", "Research workflows"];

const principles = [
  { title: "Depth over breadth", body: "A model trained for one field spends its capacity where it counts." },
  { title: "Efficient per token", body: "Fewer parameters mean less memory and energy for every answer." },
  { title: "Private by design", body: "Small enough to run on hardware you control, not only in someone else's data centre." },
];

export default function Models() {
  return (
    <section className="section" id="models">
      <SectionHead title="Built for the job, not for everything">
        General models are huge because they try to know everything. Ours are trained for one field each,
        so they can be small, fast and cheap to run.
      </SectionHead>

      <ul className="principles">
        {principles.map((p, i) => (
          <li key={p.title} className="principle glow sr" style={{ "--d": i }}>
            <FoldMark />
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ul>

      <div className="model-first glow sr">
        <div>
          <span className="tag soon">In development</span>
          <h3>Cybersecurity</h3>
          <p>Log triage, threat explanations and alert summaries that stay inside your network.</p>
        </div>
      </div>

      <div className="model-next sr">
        <p className="model-next-label">Exploring next</p>
        <ul>
          {next.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </div>
    </section>
  );
}
