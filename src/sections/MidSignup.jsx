import SubscribeForm from "../components/SubscribeForm.jsx";

/** A quiet second chance to join, right after the API preview. */
export default function MidSignup() {
  return (
    <section className="section mid-signup" aria-labelledby="mid-signup-title">
      <div className="mid-signup-row glow sr">
        <div>
          <h2 id="mid-signup-title">Want the first API keys?</h2>
          <p>Join early access and we&rsquo;ll send yours when the cloud opens.</p>
        </div>
        <SubscribeForm compact />
      </div>
    </section>
  );
}
