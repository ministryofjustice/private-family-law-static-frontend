import './Header.css';
import logo from "../assets/logo.png"

export default function Header() {
  return (
    <header>
      <div>
        <a href="/"><img src={logo} className='logo' alt="Wyser Logo" /></a>
       </div>
    </header>
  );
}