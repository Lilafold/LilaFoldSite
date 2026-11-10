import SectionHead from "./SectionHead.jsx";

const founders = [
  {
    name: "Marasescu Mihnea Luca",
    role: "CEO",
    bio: "Focused on AI strategy, product direction, and early design partner relationships.",
  },
  {
    name: "Jakub Soska",
    role: "CTO",
    bio: "Directing model architectures, parameter-efficient training, and systems research.",
  },
  {
    name: "Tiberiu Nagy-Stefan",
    role: "COO",
    bio: "Leading operations, hardware prototyping partnerships, and organizational growth.",
  },
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
            <div className="founder-details">
              <span className="founder-name">{f.name}</span>
              {f.bio && <p className="founder-bio">{f.bio}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
