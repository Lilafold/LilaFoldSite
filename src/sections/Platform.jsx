import { useRef, useState } from "react";
import SectionHead from "./SectionHead.jsx";
import { FoldMark } from "../components/Icons.jsx";

const PROMPT = "Explain this alert: 14 failed SSH logins from 203.0.113.7";

const snippets = {
  curl: [
    "curl https://api.lilafold.io/v1/generate \\",
    '  -H "Authorization: Bearer $LILAFOLD_KEY" \\',
    '  -H "Content-Type: application/json" \\',
    "  -d '{",
    '    "model": "lilafold-sec",',
    `    "input": "${PROMPT}"`,
    "  }'",
  ].join("\n"),
  python: [
    "from lilafold import LilaFold",
    "",
    "client = LilaFold()  # reads LILAFOLD_KEY",
    "",
    "result = client.generate(",
    '    model="lilafold-sec",',
    `    input="${PROMPT}",`,
    ")",
    "print(result.text)",
  ].join("\n"),
  js: [
    'import LilaFold from "lilafold";',
    "",
    "const client = new LilaFold(); // reads LILAFOLD_KEY",
    "",
    "const result = await client.generate({",
    '  model: "lilafold-sec",',
    `  input: "${PROMPT}",`,
    "});",
    "console.log(result.text);",
  ].join("\n"),
  response: [
    "{",
    '  "model": "lilafold-sec",',
    '  "category": "credential_access",',
    '  "threat_level": "medium",',
    '  "summary": "Distributed brute-force against SSH (port 22). 14 failed logins in 180s from 203.0.113.7.",',
    '  "recommended_action": "Null-route 203.0.113.7 at border firewall; audit fail2ban rules.",',
    '  "latency_ms": 8.4,',
    '  "usage": { "prompt_tokens": 14, "completion_tokens": 42 }',
    "}",
  ].join("\n"),
};

const tabs = [
  ["curl", "cURL"],
  ["python", "Python"],
  ["js", "JavaScript"],
  ["response", "Response (JSON)"],
];

const features = [
  { title: "Simple API", body: "One endpoint per task. Send text, get an answer." },
  { title: "Usage or subscription", body: "Pay per request while you test, or subscribe for steady workloads." },
  { title: "Private deployments", body: "Dedicated capacity for teams with sensitive data." },
];

const pricing = [
  { term: "Free tier", body: "for trying the models and prototyping" },
  { term: "Usage and subscriptions", body: "for production workloads" },
  { term: "Enterprise", body: "for private deployments and, later, hardware pilots" },
];

export default function Platform() {
  const [tab, setTab] = useState("curl");
  const tabRefs = useRef({});

  // roving tabindex: arrow keys, Home and End move between language tabs
  const onTabKey = (e) => {
    const i = tabs.findIndex(([k]) => k === tab);
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    if (n === null) return;
    e.preventDefault();
    const k = tabs[n][0];
    setTab(k);
    tabRefs.current[k]?.focus();
  };

  return (
    <section className="section" id="platform">
      <SectionHead title="Built so your first answer takes minutes">
        Our cloud is how you will use LilaFold models first. Get a key, make a request, pay for what you use.
      </SectionHead>

      <div className="platform">
        <ul className="feature-list sr">
          {features.map((f) => (
            <li key={f.title} className="feature">
              <FoldMark />
              <div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <figure className="code-card glow sr" style={{ "--d": 1 }}>
          <div className="code-tabs" role="tablist" aria-label="Code language" onKeyDown={onTabKey}>
            {tabs.map(([k, label]) => (
              <button
                key={k}
                ref={(el) => { tabRefs.current[k] = el; }}
                id={`tab-${k}`}
                type="button"
                role="tab"
                aria-selected={tab === k}
                aria-controls="code-panel"
                tabIndex={tab === k ? 0 : -1}
                className={`${tab === k ? "active" : ""} ${k === "response" ? "tab-response" : ""}`.trim()}
                onClick={() => setTab(k)}
              >
                {label}
              </button>
            ))}
          </div>
          <pre id="code-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
            <code>{snippets[tab]}</code>
          </pre>
          <figcaption className="fine">
            {tab === "response"
              ? "Simulated structured output from lilafold-sec running on LilaFold Cloud."
              : "A preview of the planned API. Names and fields may change before launch."}
          </figcaption>
        </figure>
      </div>

      <div className="pricing sr">
        <h3>Pricing</h3>
        <dl>
          {pricing.map((p) => (
            <div key={p.term}>
              <dt>{p.term}</dt>
              <dd>{p.body}</dd>
            </div>
          ))}
        </dl>
        <p className="fine">Prices will be announced at launch. Early access members get a discount on their first use.</p>
      </div>
    </section>
  );
}
