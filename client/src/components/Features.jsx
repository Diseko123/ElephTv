const features = [
  {
    id: "live-tv",
    title: "Live TV",
    text: "Stream live entertainment, news, and family channels with a premium viewing feel.",
  },
  {
    id: "movies",
    title: "Movies",
    text: "Enjoy movie-night access with a polished Eleph TV subscription experience.",
  },
  {
    id: "series",
    title: "Series",
    text: "Keep up with episodic entertainment on supported household screens.",
  },
  {
    id: "sports",
    title: "Sports",
    text: "Follow big matches and must-watch events with smooth streaming access.",
  },
  {
    id: "fast-activation",
    title: "Fast Activation",
    text: "Your order is created through the existing purchase workflow and delivered after checkout.",
  },
  {
    id: "secure-card-payments",
    title: "Secure Card Payments",
    text: "Use the focused DPO Pay card checkout flow for secure subscription purchases.",
  },
];

function FeatureVisual({ id }) {
  if (id === "live-tv") {
    return (
      <span className="feature-visual feature-visual-tv" aria-hidden="true">
        <span className="visual-screen">
          <svg viewBox="0 0 80 56" role="presentation">
            <rect className="svg-line" x="10" y="8" width="60" height="34" rx="6" />
            <path className="svg-line" d="M32 48h16M40 42v6" />
            <path className="svg-fill-soft" d="M18 16h44v18H18z" />
          </svg>
        </span>
        <span className="visual-base" />
      </span>
    );
  }

  if (id === "movies") {
    return (
      <span className="feature-visual feature-visual-movie" aria-hidden="true">
        <span className="visual-screen">
          <svg viewBox="0 0 80 56" role="presentation">
            <rect className="svg-line" x="10" y="12" width="60" height="34" rx="8" />
            <path className="svg-line" d="M14 22h52M22 12l-8 10M38 12l-8 10M54 12l-8 10" />
            <path className="svg-fill-soft" d="M24 30h20l8 8H24z" />
          </svg>
        </span>
        <span className="visual-card-offset" />
      </span>
    );
  }

  if (id === "series") {
    return (
      <span className="feature-visual feature-visual-series" aria-hidden="true">
        <span className="visual-stack visual-stack-back" />
        <span className="visual-stack visual-stack-mid" />
        <span className="visual-screen">
          <svg viewBox="0 0 80 56" role="presentation">
            <rect className="svg-line" x="10" y="10" width="60" height="36" rx="8" />
            <path className="svg-fill-bright" d="M35 22v12l12-6z" />
          </svg>
        </span>
      </span>
    );
  }

  if (id === "sports") {
    return (
      <span className="feature-visual feature-visual-sports" aria-hidden="true">
        <span className="visual-screen">
          <svg viewBox="0 0 80 56" role="presentation">
            <path className="svg-line" d="M28 12h24v10c0 9-5 16-12 16S28 31 28 22z" />
            <path className="svg-line" d="M28 17H18c0 9 4 14 12 15M52 17h10c0 9-4 14-12 15M40 38v8M30 46h20" />
            <path className="svg-fill-soft" d="M34 18h12v7c0 4-2 7-6 7s-6-3-6-7z" />
          </svg>
        </span>
        <span className="visual-play-dot" />
      </span>
    );
  }

  if (id === "fast-activation") {
    return (
      <span className="feature-visual feature-visual-zap" aria-hidden="true">
        <span className="visual-screen">
          <svg viewBox="0 0 80 56" role="presentation">
            <path className="svg-fill-bright" d="M44 6 22 32h17l-5 18 24-28H41z" />
            <path className="svg-line" d="M44 6 22 32h17l-5 18 24-28H41z" />
          </svg>
        </span>
        <span className="visual-pulse" />
      </span>
    );
  }

  return (
    <span className="feature-visual feature-visual-secure" aria-hidden="true">
      <span className="visual-card">
        <svg viewBox="0 0 84 56" role="presentation">
          <rect className="svg-line" x="8" y="12" width="68" height="36" rx="8" />
          <path className="svg-line" d="M8 24h68M18 38h18" />
        </svg>
      </span>
      <span className="visual-shield">
        <svg viewBox="0 0 64 64" role="presentation">
          <path className="svg-line" d="M32 8 50 15v15c0 13-8 22-18 26-10-4-18-13-18-26V15z" />
          <path className="svg-line" d="m23 32 6 6 13-15" />
        </svg>
      </span>
    </span>
  );
}

function Features() {
  return (
    <section className="section" id="features">
      <div className="section-inner">
        <div className="section-heading">
          <span className="eyebrow">Streaming built for everyday viewing</span>
          <h2>A commercial-grade experience from purchase to playback.</h2>
          <p>
            The customer journey is focused, secure, and easy to complete on desktop or mobile.
          </p>
        </div>
        <div className="card-grid">
          {features.map(({ id, title, text }) => (
            <article className="feature-card" key={title}>
              <FeatureVisual id={id} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
