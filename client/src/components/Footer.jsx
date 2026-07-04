import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong>Eleph TV</strong>
          <p>Official Reseller • Powered by Fate Vision</p>
        </div>
        <div className="footer-links">
          <Link to="/#pricing">Pricing</Link>
          <Link to="/#contact">Contact</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
