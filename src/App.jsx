import { useCallback, useState } from "react";
import SilkBackground from "./components/SilkBackground.jsx";
import Blossoms from "./components/Blossoms.jsx";
import Nav from "./components/Nav.jsx";
import SubscribeForm from "./components/SubscribeForm.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [noGl, setNoGl] = useState(false);
  const handleNoGl = useCallback(() => setNoGl(true), []);

  return (
    <div className={`page${noGl ? " no-gl" : ""}`}>
      <SilkBackground onUnsupported={handleNoGl} />
      <Blossoms />

      <Nav />

      <main>
        <div className="hero-inner">
          <h1 className="reveal" style={{ "--i": 1 }}>
            Something is <span className="soft">unfolding.</span>
          </h1>
          <p className="lede reveal" style={{ "--i": 2 }}>
            Subscribe to be the first to know about all our events and get a discount on your first use.
          </p>
          <SubscribeForm className="reveal" style={{ "--i": 3 }} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
