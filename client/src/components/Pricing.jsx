import { useState } from "react";

const currencies = {
  BWP: { label: "Botswana pula", rate: 1, maximumFractionDigits: 0 },
  USD: { label: "US dollar", rate: 0.073, maximumFractionDigits: 2 },
  ZAR: { label: "South African rand", rate: 1.32, maximumFractionDigits: 0 },
  GBP: { label: "British pound", rate: 0.054, maximumFractionDigits: 2 },
};

function formatCurrency(price, currency = "BWP") {
  const safePrice = Number.isFinite(Number(price)) ? Number(price) : 0;
  const config = currencies[currency] || currencies.BWP;

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: config.maximumFractionDigits,
  }).format(safePrice * config.rate);
}

function Pricing({
  apiUrl,
  monthlyPlans,
  yearlyPlans,
  selectedPlan,
  onSelectPlan,
}) {
  const [email, setEmail] = useState("");
  const [displayCurrency, setDisplayCurrency] = useState("BWP");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const planGroups = [
    ["Monthly", monthlyPlans],
    ["Yearly", yearlyPlans],
  ];

  const submitOrder = async (event) => {
    event.preventDefault();

    if (!selectedPlan) {
      setMessage({ type: "error", text: "Choose a plan before starting checkout." });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${apiUrl}/deliver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          plan: selectedPlan.value,
          amount: formatCurrency(selectedPlan.price, "BWP"),
          amountBwp: selectedPlan.price,
          baseCurrency: "BWP",
          displayCurrency,
          displayAmount: selectedPlan.price * currencies[displayCurrency].rate,
          displayPrice: formatCurrency(selectedPlan.price, displayCurrency),
          paymentMethod: "DPO Pay Card",
          paymentStatus: "Paid",
          product: "Eleph TV Subscription",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create order.");
      }

      setMessage({
        type: "success",
        text: data.message || "Payment verified. Your activation code will be delivered shortly.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Unable to start DPO Pay checkout. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section" id="pricing">
      <div className="section-inner">
        <div className="pricing-toolbar">
          <div className="section-heading">
            <span className="eyebrow">Plans and secure checkout</span>
            <h2>Choose your Eleph TV plan.</h2>
            <p>
              Compare monthly and yearly options first. The payment page appears only after you select a plan.
            </p>
          </div>

          <div className="currency-control">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              value={displayCurrency}
              onChange={(event) => setDisplayCurrency(event.target.value)}
            >
              {Object.entries(currencies).map(([code, config]) => (
                <option key={code} value={code}>
                  {code} - {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pricing-layout">
          {planGroups.map(([label, plans]) => (
            <div className="plan-group" key={label}>
              <h3>{label}</h3>
              <div className="plans-row">
                {plans.map((plan) => {
                  const selected = selectedPlan?.value === plan.value;
                  return (
                    <article
                      className={`plan-card${selected ? " selected" : ""}`}
                      key={plan.value}
                    >
                      <small>{plan.cycle}</small>
                      <h3>{plan.name}</h3>
                      <span className="plan-price">{formatCurrency(plan.price, displayCurrency)}</span>
                      {displayCurrency !== "BWP" && (
                        <span className="base-price">Base price: {formatCurrency(plan.price, "BWP")}</span>
                      )}
                      <ul className="plan-features">
                        <li>{plan.devices}</li>
                        <li>Credit/Debit Card only</li>
                        <li>DPO Pay secure checkout</li>
                      </ul>
                      <button
                        className="select-plan-button"
                        type="button"
                        onClick={() => onSelectPlan(plan)}
                        aria-pressed={selected}
                      >
                        {selected ? "Continue to payment" : "Choose Plan"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}

          <div id="checkout">
            {selectedPlan ? (
              <aside className="payment-panel" aria-label="Card checkout">
                <form onSubmit={submitOrder}>
                  <div className="payment-summary">
                    <span>Selected plan</span>
                    <strong>{selectedPlan.cycle} {selectedPlan.name}</strong>
                    <p>
                      {formatCurrency(selectedPlan.price, displayCurrency)} - {selectedPlan.devices}
                    </p>
                  </div>

                  <label htmlFor="checkout-email">
                    Email for activation
                    <input
                      id="checkout-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      required
                    />
                  </label>

                  <div className="dpo-box">
                    Credit/Debit Card only. DPO Pay creates a payment token, redirects to hosted checkout,
                    verifies the result, then releases the activation code after successful card payment.
                  </div>

                  <button className="primary-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Starting DPO Pay..." : "Pay by Card"}
                  </button>

                  {message.text && <div className={`form-message ${message.type}`}>{message.text}</div>}
                </form>
              </aside>
            ) : (
              <div className="checkout-placeholder">
                Select a subscription above to open the secure payment page.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
