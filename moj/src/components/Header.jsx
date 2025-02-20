import './Header.css';
import logo from "../assets/logo.png"

export default function Footer() {
  return (
    <header>
      <div className="container">
        <a href="/"><img src={logo} className='logo' alt="MOJ Logo" /></a>
       </div>
    </header>
  );
}