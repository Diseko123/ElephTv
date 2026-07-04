import { FileText, RotateCcw, Shield } from "lucide-react";

const policies = [
  { id: "terms", title: "Terms", text: "Plans are subject to device limits shown on the selected subscription." },
  { id: "privacy", title: "Privacy", text: "Customer details are used to process orders and deliver activation support." },
  { id: "refund", title: "Refund", text: "Codes are released only after successful payment verification." },
];

function PolicyIcon({ id }) {
  const icons = {
    terms: FileText,
    privacy: Shield,
    refund: RotateCcw,
  };
  const Icon = icons[id] || FileText;

  return (
    <span className="policy-icon">
      <Icon aria-hidden="true" size={42} strokeWidth={2} />
    </span>
  );
}

function Policies() {
  return (
    <section className="section">
      <div className="section-inner">
        <div className="section-heading">
          <span className="eyebrow">Policies</span>
          <h2>Simple purchase terms.</h2>
        </div>
        <div className="policy-grid">
          {policies.map(({ id, title, text }) => (
            <article className="policy-card" key={title}>
              <PolicyIcon id={id} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Policies;
