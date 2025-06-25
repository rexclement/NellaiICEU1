import React, { useState } from "react";
import './Navbar.css';
import tnLogo from '../TN.png';


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <img className="iceu-logo" src={tnLogo}  alt="Logo" height={50} width={50}/>
      <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
        &#9776;
      </button>
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="/document">Services</a></li>
        <li><a href="#">Portfolio</a></li>
        <li><a href="#">Contact</a></li>
        <li >Login</li>
        <li>Sign Up</li>
      </ul>
    </nav>
  );
}

export default Navbar;