import { useState } from "react";
import { Award, BadgeCheck, Clock3, CreditCard, MessageCircle, ShieldCheck, Tv } from "lucide-react";

import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Policies from "../components/Policies";
import Pricing from "../components/Pricing";
import SupportedDevices from "../components/SupportedDevices";
import Testimonials from "../components/Testimonials";

const monthlyPlans = [
  { cycle: "Monthly", name: "Basic", price: 120, devices: "1 device", value: "Monthly Basic" },
  { cycle: "Monthly", name: "Standard", price: 200, devices: "2 devices", value: "Monthly Standard", featured: true },
  { cycle: "Monthly", name: "Premium", price: 300, devices: "4 devices", value: "Monthly Premium" },
];

const yearlyPlans = [
  { cycle: "Yearly", name: "Basic", price: 750, devices: "1 device", value: "Yearly Basic" },
  { cycle: "Yearly", name: "Standard", price: 950, devices: "2 devices", value: "Yearly Standard", featured: true },
  { cycle: "Yearly", name: "Premium", price: 1200, devices: "4 devices", value: "Yearly Premium" },
];

const trustBadges = [
  { title: "Secure DPO checkout", text: "Card payments stay in a focused payment flow.", Icon: CreditCard },
  { title: "Fast activation", text: "Codes are released after payment confirmation.", Icon: Clock3 },
  { title: "Trusted reseller", text: "Eleph TV is powered by Fate Vision support.", Icon: BadgeCheck },
  { title: "Protected orders", text: "Order details connect to the backend dashboard.", Icon: ShieldCheck },
];

function Home({ apiUrl }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  function scrollToPricing() {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSelectPlan(plan) {
    setSelectedPlan(plan);
    window.setTimeout(() => {
      document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <main className="site-shell" id="top">
      <SiteStyles />
      <Hero onStart={scrollToPricing} />
      <TrustBadges />
      <Features />
      <SupportedDevices />
      <Pricing
        apiUrl={apiUrl}
        monthlyPlans={monthlyPlans}
        yearlyPlans={yearlyPlans}
        selectedPlan={selectedPlan}
        onSelectPlan={handleSelectPlan}
      />
      <OrderTracking apiUrl={apiUrl} />
      <Testimonials />
      <FAQ />
      <Policies />
      <Contact />
      <WhatsAppButton />
      <Footer />
    </main>
  );
}

function TrustBadges() {
  return (
    <section className="trust-band" aria-label="Trust badges">
      <div className="section-inner trust-grid">
        {trustBadges.map(({ Icon, title, text }) => (
          <article className="trust-badge" key={title}>
            <Icon aria-hidden="true" size={30} strokeWidth={2.1} />
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OrderTracking({ apiUrl }) {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  async function trackOrder(event) {
    event.preventDefault();
    const trimmedId = orderId.trim();

    if (!trimmedId) {
      setStatus({ type: "error", text: "Enter your order ID to check the status." });
      return;
    }

    setIsLoading(true);
    setStatus({ type: "", text: "" });

    try {
      const response = await fetch(`${apiUrl}/orders/${encodeURIComponent(trimmedId)}`);
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || "Order not found yet. Please check the ID and try again.");
      }

      const order = payload.order || payload.data || payload;
      const label = order.status || order.deliveryStatus || order.paymentStatus || "Order received";
      setStatus({ type: "success", text: `Order ${trimmedId}: ${label}` });
    } catch (error) {
      setStatus({ type: "error", text: error.message || "Unable to track this order right now." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="section" id="tracking">
      <div className="section-inner tracking-panel">
        <div>
          <span className="eyebrow">Order tracking</span>
          <h2>Check your activation status.</h2>
          <p>Use the order ID from your checkout confirmation to see the latest delivery status.</p>
        </div>
        <form className="tracking-form" onSubmit={trackOrder}>
          <label htmlFor="order-id">Order ID</label>
          <div className="tracking-row">
            <input
              id="order-id"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Enter order ID"
            />
            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading ? "Checking..." : "Track"}
            </button>
          </div>
          {status.text && <div className={`form-message ${status.type}`}>{status.text}</div>}
        </form>
      </div>
    </section>
  );
}

function WhatsAppButton() {
  return (
    <a
      className="whatsapp-button"
      href="https://wa.me/?text=Hi%20Eleph%20TV%2C%20I%20need%20help%20with%20a%20subscription."
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Eleph TV on WhatsApp"
    >
      <MessageCircle aria-hidden="true" size={24} strokeWidth={2.4} />
      <span>WhatsApp</span>
    </a>
  );
}

function SiteStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        background: #050713;
        color: #f7f8ff;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      a { color: inherit; }
      button, input, select { font: inherit; }
      h1, h2, h3, p { margin-top: 0; }
      p { color: #aeb8d4; line-height: 1.65; }

      .site-shell {
        min-height: 100vh;
        overflow-x: hidden;
        background:
          radial-gradient(circle at 12% 0%, rgba(125, 92, 255, 0.20), transparent 27rem),
          radial-gradient(circle at 88% 4%, rgba(31, 182, 255, 0.16), transparent 30rem),
          linear-gradient(180deg, #050713 0%, #080b16 42%, #0a0e1d 100%);
      }

      .section,
      .trust-band {
        padding: 54px 26px;
        position: relative;
      }

      .section-inner {
        margin: 0 auto;
        width: min(1160px, 100%);
      }

      .section-heading {
        margin-bottom: 26px;
        max-width: 760px;
      }

      .eyebrow {
        color: #78d7ff;
        display: inline-flex;
        font-size: 13px;
        font-weight: 900;
        letter-spacing: 0;
        margin-bottom: 10px;
      }

      .section-heading h2,
      .tracking-panel h2 {
        color: #ffffff;
        font-size: clamp(30px, 4vw, 44px);
        line-height: 1.08;
        margin-bottom: 10px;
      }

      .hero {
        min-height: 680px;
        padding: 0 26px 72px;
      }

      .hero-nav {
        align-items: center;
        display: grid;
        gap: 18px;
        grid-template-columns: auto minmax(0, 1fr);
        min-height: 74px;
      }

      .brand {
        align-items: center;
        display: inline-flex;
        gap: 9px;
        font-size: 17px;
        font-weight: 950;
        text-decoration: none;
        white-space: nowrap;
      }

      .brand-mark {
        align-items: center;
        background: rgba(125, 92, 255, 0.12);
        border: 1px solid rgba(142, 199, 255, 0.28);
        border-radius: 7px;
        box-shadow: 0 0 22px rgba(125, 92, 255, 0.28);
        color: #9ecbff;
        display: inline-flex;
        height: 30px;
        justify-content: center;
        width: 30px;
      }

      .brand-mark::before {
        content: "";
        background: currentColor;
        border-radius: 3px;
        height: 14px;
        width: 18px;
      }

      .nav-links {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: clamp(14px, 3vw, 34px);
        justify-content: flex-end;
      }

      .nav-links a {
        color: #d7dded;
        font-size: 13px;
        font-weight: 850;
        text-decoration: none;
      }

      .admin-link {
        color: #78d7ff !important;
      }

      .hero-grid {
        align-items: center;
        display: grid;
        gap: 42px;
        grid-template-columns: minmax(0, 0.95fr) minmax(320px, 0.75fr);
        min-height: 580px;
      }

      .hero-copy h1 {
        color: #fff;
        font-size: clamp(44px, 7vw, 88px);
        letter-spacing: 0;
        line-height: 0.98;
        margin-bottom: 24px;
        max-width: 790px;
      }

      .hero-copy p {
        font-size: clamp(16px, 2vw, 20px);
        max-width: 660px;
      }

      .hero-actions,
      .stats-row {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-top: 26px;
      }

      .primary-button,
      .secondary-button,
      .select-plan-button {
        border: 0;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 950;
        padding: 14px 18px;
        text-decoration: none;
        transition: transform 180ms ease, box-shadow 180ms ease;
      }

      .primary-button,
      .select-plan-button {
        background: linear-gradient(135deg, #7d5cff, #1fb6ff);
        box-shadow: 0 18px 42px rgba(51, 119, 255, 0.28);
        color: #fff;
      }

      .secondary-button {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #fff;
      }

      .primary-button:hover,
      .secondary-button:hover,
      .select-plan-button:hover {
        transform: translateY(-3px);
      }

      .stats-row {
        margin-top: 34px;
      }

      .stat {
        border-left: 2px solid rgba(120, 215, 255, 0.45);
        min-width: 118px;
        padding-left: 14px;
      }

      .stat strong {
        color: #fff;
        display: block;
        font-size: 24px;
      }

      .stat span {
        color: #aeb8d4;
        font-size: 13px;
        font-weight: 800;
      }

      .cinema-panel {
        aspect-ratio: 0.82;
        border: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 8px;
        background:
          linear-gradient(145deg, rgba(125, 92, 255, 0.28), rgba(31, 182, 255, 0.10)),
          linear-gradient(180deg, #151b2c, #090d18);
        box-shadow: 0 34px 100px rgba(0, 0, 0, 0.36), 0 0 80px rgba(31, 182, 255, 0.14);
        display: grid;
        overflow: hidden;
        place-items: center;
      }

      .screen-stack {
        display: grid;
        gap: 18px;
        width: 72%;
      }

      .screen-strip {
        background: linear-gradient(90deg, rgba(120, 215, 255, 0.22), rgba(255,255,255,0.07));
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 7px;
        height: 84px;
      }

      .trust-band {
        padding-top: 0;
      }

      .trust-grid,
      .card-grid,
      .policy-grid,
      .plans-row {
        display: grid;
        gap: 20px;
      }

      .trust-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .trust-badge,
      .feature-card,
      .device-card,
      .quote-card,
      .policy-card,
      .faq-item,
      .payment-panel,
      .plan-card,
      .contact-panel,
      .tracking-panel {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.025)), #0d111d;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
      }

      .trust-badge {
        align-items: flex-start;
        display: flex;
        gap: 14px;
        min-height: 132px;
        padding: 20px;
      }

      .trust-badge svg,
      .contact-icon,
      .device-icon,
      .policy-icon {
        color: #78d7ff;
        flex: 0 0 auto;
      }

      .trust-badge h2,
      .feature-card h3,
      .device-card h3,
      .quote-card h3,
      .policy-card h3,
      .faq-item h3,
      .contact-method h3,
      .plan-card h3 {
        color: #fff;
        margin-bottom: 8px;
      }

      .trust-badge p,
      .quote-card p,
      .policy-card p {
        font-size: 14px;
        margin: 0;
      }

      .card-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .feature-card,
      .device-card,
      .quote-card,
      .policy-card,
      .faq-item {
        min-width: 0;
        padding: 24px;
      }

      .feature-visual {
        align-items: center;
        color: #78d7ff;
        display: flex;
        height: 86px;
        justify-content: center;
        margin-bottom: 16px;
        position: relative;
      }

      .feature-visual svg {
        height: 82px;
        width: 108px;
      }

      .svg-line {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 3;
      }

      .svg-fill-soft {
        fill: rgba(120, 215, 255, 0.16);
      }

      .svg-fill-bright {
        fill: rgba(125, 92, 255, 0.72);
      }

      .device-grid,
      .policy-grid {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }

      .policy-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .faq-list {
        display: grid;
        gap: 14px;
      }

      .pricing-toolbar {
        align-items: end;
        display: flex;
        gap: 18px;
        justify-content: space-between;
        margin-bottom: 24px;
      }

      .currency-control {
        display: grid;
        gap: 7px;
        min-width: 220px;
      }

      .currency-control label,
      .tracking-form label,
      .payment-panel label {
        color: #e5ebff;
        font-size: 14px;
        font-weight: 900;
      }

      .currency-control select,
      .tracking-form input,
      .payment-panel input {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 8px;
        color: #fff;
        outline: none;
        padding: 13px 14px;
      }

      .currency-control option {
        background: #0d111d;
      }

      .pricing-layout,
      .plan-group {
        display: grid;
        gap: 22px;
      }

      .plans-row {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .plan-card {
        color: #fff;
        display: flex;
        flex-direction: column;
        min-height: 270px;
        min-width: 0;
        overflow: hidden;
        padding: 26px;
        transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
      }

      .plan-card:hover {
        border-color: rgba(142, 199, 255, 0.42);
        box-shadow: 0 28px 80px rgba(0, 0, 0, 0.38), 0 0 40px rgba(31, 182, 255, 0.16);
        transform: translateY(-5px);
      }

      .plan-card.selected {
        background: linear-gradient(145deg, rgba(125, 92, 255, 0.26), rgba(31, 182, 255, 0.12)), #0d111d;
        border-color: rgba(142, 199, 255, 0.46);
      }

      .plan-card small {
        color: #9ecbff;
        font-weight: 900;
        margin-bottom: 12px;
      }

      .plan-price {
        color: #5bbdff;
        display: block;
        font-size: 38px;
        font-weight: 950;
        margin: 14px 0 2px;
      }

      .base-price {
        color: #8f9cbb;
        font-size: 13px;
        font-weight: 800;
        margin-bottom: 12px;
      }

      .plan-features {
        display: grid;
        gap: 10px;
        list-style: none;
        margin: 12px 0 22px;
        padding: 0;
      }

      .plan-features li {
        color: #cbd6f2;
        font-size: 14px;
        line-height: 1.45;
        margin: 0;
        padding-left: 18px;
        position: relative;
      }

      .plan-features li::before {
        background: #5bbdff;
        border-radius: 999px;
        box-shadow: 0 0 16px rgba(91, 189, 255, 0.55);
        content: "";
        height: 7px;
        left: 0;
        position: absolute;
        top: 0.62em;
        width: 7px;
      }

      .select-plan-button {
        margin-top: auto;
        width: 100%;
      }

      .select-plan-button[aria-pressed="true"] {
        background: linear-gradient(135deg, #1fb6ff, #5bbdff);
      }

      .checkout-placeholder,
      .payment-panel,
      .tracking-panel,
      .contact-panel {
        padding: 28px;
      }

      .checkout-placeholder {
        border: 1px dashed rgba(120, 215, 255, 0.35);
        border-radius: 8px;
        color: #b9c7e7;
        text-align: center;
      }

      .payment-panel form {
        display: grid;
        gap: 16px;
      }

      .payment-panel label {
        display: grid;
        gap: 8px;
      }

      .payment-summary,
      .dpo-box {
        background: rgba(255, 255, 255, 0.045);
        border: 1px solid rgba(255, 255, 255, 0.09);
        border-radius: 8px;
        padding: 16px;
      }

      .payment-summary span {
        color: #9ca8c4;
        display: block;
        font-size: 13px;
        font-weight: 900;
      }

      .payment-summary strong {
        display: block;
        font-size: 24px;
        margin-top: 6px;
      }

      .dpo-box {
        border-style: dashed;
        color: #cfe3ff;
        font-size: 14px;
        line-height: 1.55;
      }

      .form-message {
        border-radius: 8px;
        font-size: 14px;
        font-weight: 800;
        line-height: 1.5;
        padding: 12px;
      }

      .form-message.success {
        background: rgba(35, 206, 123, 0.12);
        color: #9ff0c6;
      }

      .form-message.error {
        background: rgba(255, 93, 93, 0.12);
        color: #ffb8b8;
      }

      .tracking-panel {
        align-items: center;
        display: grid;
        gap: 28px;
        grid-template-columns: minmax(0, 0.8fr) minmax(320px, 0.65fr);
      }

      .tracking-form {
        display: grid;
        gap: 10px;
      }

      .tracking-row {
        display: grid;
        gap: 10px;
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .contact-panel {
        align-items: center;
        display: grid;
        gap: 24px;
        grid-template-columns: minmax(0, 0.85fr) minmax(300px, 1fr) auto;
      }

      .contact-methods {
        display: grid;
        gap: 12px;
      }

      .contact-method {
        align-items: center;
        display: flex;
        gap: 14px;
      }

      .contact-method p {
        margin: 0;
      }

      .whatsapp-button {
        align-items: center;
        background: #20c765;
        border-radius: 8px;
        bottom: 22px;
        box-shadow: 0 18px 50px rgba(32, 199, 101, 0.35);
        color: #04100a;
        display: inline-flex;
        font-weight: 950;
        gap: 8px;
        padding: 13px 16px;
        position: fixed;
        right: 22px;
        text-decoration: none;
        z-index: 20;
      }

      .footer {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding: 28px 26px;
      }

      .footer-inner {
        align-items: center;
        display: flex;
        gap: 20px;
        justify-content: space-between;
        margin: 0 auto;
        width: min(1160px, 100%);
      }

      .footer p {
        margin: 6px 0 0;
      }

      .footer-links {
        display: flex;
        gap: 18px;
      }

      .footer-links a {
        color: #d7dded;
        font-weight: 850;
        text-decoration: none;
      }

      @media (max-width: 980px) {
        .hero-grid,
        .tracking-panel,
        .contact-panel {
          grid-template-columns: 1fr;
        }

        .trust-grid,
        .card-grid,
        .device-grid,
        .plans-row {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .hero {
          min-height: auto;
        }
      }

      @media (max-width: 680px) {
        .section,
        .trust-band,
        .hero {
          padding-left: 18px;
          padding-right: 18px;
        }

        .hero-nav,
        .pricing-toolbar,
        .footer-inner {
          align-items: stretch;
          grid-template-columns: 1fr;
          flex-direction: column;
        }

        .nav-links {
          justify-content: flex-start;
        }

        .trust-grid,
        .card-grid,
        .device-grid,
        .policy-grid,
        .plans-row,
        .tracking-row {
          grid-template-columns: 1fr;
        }

        .cinema-panel {
          aspect-ratio: 1.15;
        }

        .whatsapp-button {
          bottom: 16px;
          right: 16px;
        }
      }
    `}</style>
  );
}

export default Home;
