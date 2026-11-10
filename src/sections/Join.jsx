import SubscribeForm from "../components/SubscribeForm.jsx";

export default function Join() {
  return (
    <section className="section join" id="join">
      <div className="join-card beam glow condense">
        <img className="join-logo" src={`${import.meta.env.BASE_URL}logo.png`} alt="" width="72" height="72" />
        <h2>Be first in line</h2>
        <p className="section-lede">
          Join early access for the first API keys, news when our models ship and a discount on your first use.
        </p>
        <SubscribeForm />
      </div>
    </section>
  );
}
