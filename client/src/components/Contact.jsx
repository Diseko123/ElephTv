import { Clock3, Mail, MessageCircle } from "lucide-react";

const contactMethods = [
  { id: "whatsapp", title: "WhatsApp", text: "Fast help for plan selection and activation." },
  { id: "email", title: "Email", text: "support@elephtvcode.store" },
  { id: "business-hours", title: "Business Hours", text: "Monday to Saturday support coverage." },
];

function ContactIcon({ id }) {
  return (
    <span className="contact-icon">
      {id === "email" && <Mail aria-hidden="true" size={42} strokeWidth={2} />}
      {id === "business-hours" && <Clock3 aria-hidden="true" size={42} strokeWidth={2} />}
      {(id === "whatsapp" || !id) && <MessageCircle aria-hidden="true" size={42} strokeWidth={2} />}
    </span>
  );
}

function Contact() {
  return (
    <section className="section" id="contact">
      <div className="section-inner">
        <div className="contact-panel">
          <div>
            <span className="eyebrow">Need help?</span>
            <h2>Talk to Eleph TV support.</h2>
            <p>
              Get plan guidance, activation help, or reseller support before choosing your package.
            </p>
          </div>
          <div className="contact-methods">
            {contactMethods.map(({ id, title, text }) => (
              <article className="contact-method" key={title}>
                <ContactIcon id={id} />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
          <a className="secondary-button" href="mailto:support@elephtvcode.store">
            Email support
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
