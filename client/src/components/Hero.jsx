import { Link } from "react-router-dom";

function Hero({ onStart }) {
  return (
    <section className="hero" id="top">
      <div className="section-inner">
        <nav className="hero-nav" aria-label="Primary navigation">
          <Link className="brand" to="/#top">
            <span className="brand-mark" aria-hidden="true" />
            Eleph TV
          </Link>
          <div className="nav-links">
            <Link to="/#top">Home</Link>
            <Link to="/#features">Features</Link>
            <Link to="/#pricing">Pricing</Link>
            <Link to="/#tracking">Track Order</Link>
            <Link to="/#faq">FAQ</Link>
            <Link to="/#contact">Contact</Link>
            <Link className="admin-link" to="/admin">Admin</Link>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Official Reseller • Powered by Fate Vision</span>
            <h1>Premium streaming, activated fast.</h1>
            <p>
              Eleph TV brings live channels, entertainment, sport, and family viewing into one
              polished subscription experience, with secure card checkout and quick activation.
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={onStart}>
                View plans
              </button>
              <Link className="secondary-button" to="/#contact">
                Contact support
              </Link>
            </div>
            <div className="stats-row" aria-label="Service highlights">
              <div className="stat">
                <strong>HD</strong>
                <span>Quality streams</span>
              </div>
              <div className="stat">
                <strong>24/7</strong>
                <span>Customer help</span>
              </div>
              <div className="stat">
                <strong>DPO</strong>
                <span>Secure card checkout</span>
              </div>
            </div>
          </div>

          <div className="cinema-panel" aria-hidden="true">
            <div className="screen-stack">
              <span className="screen-strip" />
              <span className="screen-strip" />
              <span className="screen-strip" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
