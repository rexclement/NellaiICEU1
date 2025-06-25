// import React from 'react';
// import './HomePage.css';

// const HomePage = () => {
//   return (
//     <div className="homepage-container">
//       <header className="homepage-header">
//         <div className="homepage-logo">MySite</div>
//         <nav className="homepage-nav">
//           <a href="#hero">Home</a>
//           <a href="#about">About Us</a>
//           <a href="#contact">Contact</a>
//           <button className="homepage-login">Login</button>
//         </nav>
//       </header>

//       <section className="homepage-hero" id="hero">
//         <div className="hero-content">
//           <img 
//             src="https://source.unsplash.com/800x400/?team,technology" 
//             alt="Hero Illustration" 
//             className="hero-image" 
//           />
//           <div className="hero-text">
//             <h1>Welcome to Our Beautiful Site</h1>
//             <p>We create wonderful experiences for everyone.</p>
//           </div>
//         </div>
//       </section>

//       <section className="homepage-about" id="about">
//         <h2>About Us</h2>
//         <p>
//           We are a team of passionate creators delivering excellence in every project.
//           Our mission is to transform ideas into reality through design and innovation.
//         </p>
//       </section>

//       <section className="homepage-contact" id="contact">
//         <h2>Contact Us</h2>
//         <form>
//           <input type="text" placeholder="Your Name" required />
//           <input type="email" placeholder="Your Email" required />
//           <textarea placeholder="Your Message" rows="5" required></textarea>
//           <button type="submit">Send</button>
//         </form>
//       </section>

//       <footer className="homepage-footer">
//         <p>&copy; 2025 MySite. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;
// import React, { useState } from 'react';
// import './HomePage.css';
// import axios from 'axios';

// const BASE_URL = 'http://localhost:5000';

// export default function HomePage({ onLoginSuccess }) {
//   const [showLogin, setShowLogin] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${BASE_URL}/login`, formData, { withCredentials: true });
//       console.log("response.data.success:",response.data.success);
//       const check = await axios.get(`${BASE_URL}/check-auth`, { withCredentials: true });
//       console.log("check.data:",check.data);

//       if (response.data.success) {
//         onLoginSuccess();
//       } else {
//         alert('Login failed');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       alert('Login failed');
//     }
//   };

//   return (
//     <div className="homepage-container">
//       <header className="homepage-header">
//         <div className="homepage-logo">YouthConnect</div>
//         <nav className="homepage-nav">
//           <a href="#about">About</a>
//           <a href="#contact">Contact</a>
//           <button className="homepage-login" onClick={() => setShowLogin(true)}>Login</button>
//         </nav>
//       </header>

//       {showLogin && (
//         <div className="login-modal">
//           <form className="login-form" onSubmit={handleLogin}>
//             <button type="button" className="close-button" onClick={() => setShowLogin(false)}>&times;</button>
//             <h2>Login</h2>
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//             <button type="submit">Login</button>
//           </form>
//         </div>
//       )}

//       <section className="homepage-hero">
//         <div className="hero-content">
//           <img
//             className="hero-image"
//             src="https://source.unsplash.com/800x500/?youth,technology"
//             alt="Hero"
//           />
//           <div className="hero-text">
//             <h1>Empowering Youth Through Connection</h1>
//             <p>Join the revolution of youth inspiring change, creativity, and community.</p>
//           </div>
//         </div>
//       </section>

//       <section id="about" className="homepage-about">
//         <h2>About Us</h2>
//         <p>
//           YouthConnect is a digital platform crafted to connect and empower young individuals. We offer
//           resources, community building, and tools to help youth make a real difference in the world.
//         </p>
//       </section>

//       <section id="contact" className="homepage-contact">
//         <h2>Contact Us</h2>
//         <form>
//           <input type="text" placeholder="Your Name" required />
//           <input type="email" placeholder="Your Email" required />
//           <textarea placeholder="Your Message" rows="5" required></textarea>
//           <button type="submit">Send Message</button>
//         </form>
//       </section>

//       <footer className="homepage-footer">
//         &copy; {new Date().getFullYear()} YouthConnect. All rights reserved.
//       </footer>
//     </div>
//   );
// }

import React, { useState } from 'react';
import './HomePage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const BASE_URL = 'https://iceu.onrender.com';
// const BASE_URL = "http://localhost:5000";

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
  //     const response = await axios.post(`${BASE_URL}/login`, formData, {
  //       withCredentials: true,
  //     });

  //     if (response.data.success) {
  //       navigate('/welcome');
  //     } else {
  //       alert('Invalid credentials. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     alert('Login failed. Try again later.');
  //   }
  const formData = new FormData(e.target);
  const username = formData.get('username');
  const password = formData.get('password');
  
  const response = await axios.post(`${BASE_URL}/login`, { username, password }, { withCredentials: true });

  if (response.data.success) {
    
  
    // Wait until the session is confirmed from backend
    const authCheck = await axios.get(`${BASE_URL}/check-auth`, { withCredentials: true });
  
    if (authCheck.data.loggedIn) {
      console.log("hiiiiiiiiiiiiiii");
      navigate('/welcome');
    } else {
      console.log("❌ Session not ready");
    }
  }
} catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Try again later.');
    }
  };

 


  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="homepage-header">
        <div className="homepage-logo">YouthConnect</div>
        <nav className="homepage-nav">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <button className="homepage-login" onClick={() => setShowLogin(true)}>
            Login
          </button>
        </nav>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="login-modal">
          <form className="login-form" onSubmit={handleLogin}>
            <button
              type="button"
              className="close-button"
              onClick={() => setShowLogin(false)}
            >
              &times;
            </button>
            <h2>Member Login</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      )}

      {/* Hero Section */}
      <section className="homepage-hero">
        <div className="hero-content">
          <img
            className="hero-image"
            src="https://source.unsplash.com/800x500/?youth,technology"
            alt="Empower Youth"
          />
          <div className="hero-text">
            <h1>Empowering Youth Through Connection</h1>
            <p>Join a movement built on faith, unity, and purpose.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="homepage-about">
        <h2>About Us</h2>
        <p>
          YouthConnect is a Christ-centered community designed to encourage young minds through events, mentorship,
          and leadership opportunities, fostering personal and spiritual growth.
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="homepage-contact">
        <h2>Contact Us</h2>
        <form>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        &copy; {new Date().getFullYear()} YouthConnect. All rights reserved.
      </footer>
    </div>
  );
}
