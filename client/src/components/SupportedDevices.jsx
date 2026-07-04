import { Laptop, MonitorSmartphone, Smartphone, Tablet, Tv } from "lucide-react";

const devices = [
  { id: "smart-tv", name: "Smart TV" },
  { id: "android-phone", name: "Android Phone" },
  { id: "android-tv-box", name: "Android TV Box" },
  { id: "laptop", name: "Laptop / PC" },
  { id: "tablet", name: "Tablet" },
];

function DeviceIcon({ id }) {
  const icons = {
    "smart-tv": Tv,
    "android-phone": Smartphone,
    "android-tv-box": MonitorSmartphone,
    laptop: Laptop,
    tablet: Tablet,
  };
  const Icon = icons[id] || Tv;

  return (
    <span className="device-icon">
      <Icon aria-hidden="true" size={42} strokeWidth={2} />
    </span>
  );
}

function SupportedDevices() {
  return (
    <section className="section" id="devices">
      <div className="section-inner">
        <div className="section-heading">
          <span className="eyebrow">Supported devices</span>
          <h2>Watch on the screens your household already uses.</h2>
          <p>
            Choose the plan that matches your device count and keep your entertainment simple.
          </p>
        </div>
        <div className="card-grid device-grid">
          {devices.map(({ id, name }) => (
            <article className="device-card" key={name}>
              <DeviceIcon id={id} />
              <h3>{name}</h3>
              <p>Optimized for stable viewing, quick setup, and premium access.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SupportedDevices;
