import { useCallback, useState } from "react";
import SilkBackground from "./components/SilkBackground.jsx";
import Blossoms from "./components/Blossoms.jsx";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import CookieBanner from "./components/CookieBanner.jsx";
import Hero from "./sections/Hero.jsx";
import Sponsors from "./sections/Sponsors.jsx";
import Manifesto from "./sections/Manifesto.jsx";
import Products from "./sections/Products.jsx";
import Models from "./sections/Models.jsx";
import Platform from "./sections/Platform.jsx";
import MidSignup from "./sections/MidSignup.jsx";
import Hardware from "./sections/Hardware.jsx";
import Roadmap from "./sections/Roadmap.jsx";
import Team from "./sections/Team.jsx";
import Faq from "./sections/Faq.jsx";
import Join from "./sections/Join.jsx";
import { useMistScroll } from "./lib/useScroll.js";
import { useSpotlight } from "./lib/useSpotlight.js";

export default function App() {
  const [noGl, setNoGl] = useState(false);
  const handleNoGl = useCallback(() => setNoGl(true), []);
  useMistScroll();
  useSpotlight();

  return (
    <div className={`site${noGl ? " no-gl" : ""}`}>
      {/* the silk smoke stays fixed behind the whole site; a low mist bank sits
          behind the content so sections appear to rise out of it */}
      <div className="backdrop" aria-hidden="true">
        <SilkBackground onUnsupported={handleNoGl} />
        <Blossoms />
        <div className="backdrop-dim" />
        <div className="mist-floor">
          <span className="wisp w1" />
          <span className="wisp w2" />
          <span className="wisp w3" />
          <span className="wisp w4" />
        </div>
      </div>

      <Nav />

      <main>
        <Hero />
        <Sponsors />
        <Manifesto />
        <Products />
        <Models />
        <Platform />
        <MidSignup />
        <Hardware />
        <Roadmap />
        <Team />
        <Faq />
        <Join />
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
