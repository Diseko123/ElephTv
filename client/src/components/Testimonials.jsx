const testimonials = [
  ["The setup was straightforward and the activation arrived quickly.", "Mpho, Gaborone"],
  ["The plan options are clear, and support helped me choose the right device count.", "Kago, Francistown"],
  ["It feels like a proper streaming brand now, from the site to checkout.", "Naledi, Maun"],
];

function Testimonials() {
  return (
    <section className="section">
      <div className="section-inner">
        <div className="section-heading">
          <span className="eyebrow">Customer feedback</span>
          <h2>Designed to feel premium before the first stream starts.</h2>
        </div>
        <div className="card-grid">
          {testimonials.map(([quote, name]) => (
            <article className="quote-card" key={name}>
              <p>“{quote}”</p>
              <h3>{name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
