import SectionHead from "./SectionHead.jsx";

const founders = [
  { name: "Marasescu Mihnea Luca", role: "CEO" },
  { name: "Jakub Soska", role: "CTO" },
  { name: "Tiberiu Nagy-Stefan", role: "COO" },
];

export default function Team() {
  return (
    <section className="section" id="team">
      <SectionHead title="Three founders, one bet">
        LilaFold Labs is an early-stage research company. We think useful AI should be small enough to own,
        and we are building the models and hardware to prove it.
      </SectionHead>
      <ul className="team">
        {founders.map((f, i) => (
          <li key={f.name} className="founder sr" style={{ "--d": i }}>
            <span className="founder-role">{f.role}</span>
            <span className="founder-name">{f.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
