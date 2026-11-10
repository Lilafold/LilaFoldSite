import { ArrowRight } from "../components/Icons.jsx";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <h1 className="reveal" style={{ "--i": 2 }}>
          Small models.<br />
          <span className="soft">Serious work.</span>
        </h1>
        <p className="lede reveal" style={{ "--i": 3 }}>
          AI models trained for one job each, small enough to run privately: in our cloud first,
          then on modular hardware you own.
        </p>
        <div className="hero-ctas reveal" style={{ "--i": 4 }}>
          <a className="btn-light" href="#join">
            Join early access
            <span className="key" aria-hidden="true"><ArrowRight /></span>
          </a>
          <a className="btn-ghost" href="#products">See what we&rsquo;re building</a>
        </div>
      </div>
    </section>
  );
}
