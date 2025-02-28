import './Header.css';
import logo from "../assets/logo-white.png"

export default function Footer() {
  return (
    <header>
      <div className="inner-container">
        <a href="/"><img src={logo} className='logo' alt="MOJ Logo" /></a>
       </div>
    </header>
  );
}