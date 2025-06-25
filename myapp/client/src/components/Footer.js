// import React, { useState } from 'react';
// import './Footer.css';
// import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

// const Footer = () => {
//   const [showForm, setShowForm] = useState(false);

//   const toggleForm = () => {
//     setShowForm(prev => !prev);
//   };

//   return (
//     <footer className="footer-container">
//       <div className="footer-grid">
//         <div className="footer-section">
//           <h3>About Us</h3>
//           <p>
//             We are committed to delivering the best experience with quality and care. Your trust is our priority.
//           </p>
//         </div>

//         <div className="footer-section">
//           <h3>Quick Links</h3>
//           <ul>
//             <li><a href="/">Home</a></li>
//             <li><a href="/">Services</a></li>
//             <li><a href="/">Portfolio</a></li>
//             <li><a href="/">Contact</a></li>
//           </ul>
//         </div>

//         <div className="footer-section">
//           <h3>Contact Us</h3>
//           <p><FaPhone /> +123 456 7890</p>
//           <p><FaEnvelope /> info@example.com</p>
//           <div className="social-icons">
//             <a href="/"><FaFacebook /></a>
//             <a href="/"><FaTwitter /></a>
//             <a href="/"><FaInstagram /></a>
//           </div>
//         </div>
//       </div>

//       <div className="footer-bottom">
//         <p>&copy; 2025 Your Company. All rights reserved.</p>
//         <button className="change-button" onClick={toggleForm}>
//           Change Me
//         </button>

//         {showForm && (
//           <form className="footer-form">
//             <input type="text" placeholder="Username" name="username" required />
//             <input type="password" placeholder="Password" name="password" required />
//             <button type="submit" onClick={ handlesubmit() } >Submit</button>
//           </form>
//         )}
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React, { useState } from 'react';
import './Footer.css';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';


// const BASE_URL = "http://localhost:5000";

const Footer = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const toggleForm = () => {
    setShowForm(prev => !prev);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form to backend using axios
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      const response = await axios.post(`/changeme`, formData);
      
      alert('Changed successful!');
    } catch (error) {
      console.error(' failed:', error);
      alert('Failed to change !');
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-grid">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            We are committed to delivering the best experience with quality and care. Your trust is our priority.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/">Services</a></li>
            <li><a href="/">Portfolio</a></li>
            <li><a href="/">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p><FaPhone /> +123 456 7890</p>
          <p><FaEnvelope /> info@example.com</p>
          <div className="social-icons">
            <a href="/"><FaFacebook /></a>
            <a href="/"><FaTwitter /></a>
            <a href="/"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Your Company. All rights reserved.</p>
        <button className="change-button" onClick={toggleForm}>
          Change Me
        </button>

        {showForm && (
          <form className="footer-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </footer>
  );
};

export default Footer;
