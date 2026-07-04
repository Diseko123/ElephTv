const items = [
  ["How do I get activated?", "Choose a plan, enter your email, and complete the DPO Pay card checkout. Your activation code is delivered after successful payment verification."],
  ["Which plan should I choose?", "Basic supports 1 device, Standard supports 2 devices, and Premium supports 4 devices."],
  ["Is Eleph TV connected to Fate Vision?", "Eleph TV is presented here as an official reseller powered by Fate Vision."],
  ["Can I track orders?", "Yes. Existing order creation and admin order tracking remain connected to the backend API."],
];

function FAQ() {
  return (
    <section className="section" id="faq">
      <div className="section-inner">
        <div className="section-heading">
          <span className="eyebrow">FAQ</span>
          <h2>Clear answers before checkout.</h2>
        </div>
        <div className="faq-list">
          {items.map(([question, answer]) => (
            <article className="faq-item" key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
