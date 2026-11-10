import SectionHead from "./SectionHead.jsx";

const steps = [
  { when: "Now", title: "Specialised models", body: "Research efficient architectures and build our first model, for cybersecurity.", now: true },
  { when: "Next", title: "Cloud early access", body: "Open the API to early users, with usage pricing and subscriptions." },
  { when: "Then", title: "Two-module prototype", body: "Show models running across connected NPU modules." },
  { when: "Later", title: "Hardware pilots", body: "Work with design partners, refine the modules and move toward manufacturing." },
];

export default function Roadmap() {
  return (
    <section className="section" id="roadmap">
      <SectionHead eyebrow="Roadmap" title="Where we are going" center>
        Models and cloud first. Hardware follows once we have validated it.
      </SectionHead>
      <ol className="timeline">
        {steps.map((s, i) => (
          <li key={s.when} className={`step sr${s.now ? " now" : ""}`} style={{ "--d": i }}>
            <span className="node" aria-hidden="true" />
            <p className="when">{s.when}</p>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
