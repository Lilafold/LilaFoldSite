import SectionHead from "./SectionHead.jsx";
import { Plus } from "../components/Icons.jsx";

const faqs = [
  {
    q: "What is early access?",
    a: "A first group of people who get API keys before the public launch. Leave your email and we will write when the cloud opens, with a discount on your first use.",
  },
  {
    q: "When does it open?",
    a: "We have not set a date. We are an early-stage company and our first model is still in development. People on the list hear first.",
  },
  {
    q: "What will it cost?",
    a: "Usage-based pricing and monthly subscriptions, with a free tier for prototyping. Exact prices will be published at launch.",
  },
  {
    q: "Which model comes first?",
    a: "Cybersecurity: log triage, threat explanations and alert summaries. Freight and logistics, software engineering, forecasting and research workflows are the fields we are exploring next.",
  },
  {
    q: "Can I buy the hardware?",
    a: "Not yet. The modules are in research and the pictures on this page are concept illustrations. We plan to validate a two-module prototype first, then run pilots with early partners.",
  },
];

export default function Faq() {
  return (
    <section className="section faq" id="faq">
      <SectionHead title="Fair questions" />
      <div className="faq-list">
        {faqs.map((f, i) => (
          <details key={f.q} name="faq" className="faq-item glow sr" style={{ "--d": i }}>
            <summary>
              {f.q}
              <span className="faq-icon" aria-hidden="true"><Plus /></span>
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
