import React from 'react';
import './Welcome.css';

function Welcome() {
  return (
    <div className="welcome-container">
      <header className="welcome-hero">
        <h1>Welcome to ICEU</h1>
        <p>Inspiring Change, Empowering Unity</p>
      </header>

      <section className="welcome-section fade-in">
        <h2>Our History</h2>
        <p>
          Early in 1948 Half a dozen students of CMC, Vellore, without any senior adviser felt the need for a deeper fellowship than what was provided by the existing Christian organization in the College SCM.
         In 1948, D Jayapaul, moved to Coimbatore from Madras as student for second year and missed the Christian Fellowship in Madras. However, he used to go out into the open field and pray that the Lord would raise up prayer cell in G C T hostel. In answer to prayer, the Lord sent H S Ponnuraj (then a student) from Madras, for his second year, to Coimbatore. His coming to G C T hostel was a great help and due to his dynamic leadership and zeal for witnessing, the Lord raised up a small prayer cell which grew up steadily.
         In November 1951, Dr Sterrett went to Vellore along with John Moody helped members form an Evangelical Union. The doctrinal basis was discussed, the whole Constitution was drawn up and the name Evangelical Union was accepted. Then the first CMC EU Committee was formed and got official recognition from CMC.
         The constant interaction and prayer among students and graduates led to the formation of the committee for Inter Collegiate Evangelical Union (ICEU) of Madras in 1951. A student magazine, entitled The Evangelical Student        
          The three groups had a burden and vision not only for their own places but also for the other students in India. UESI name was given to distinguish it from other students movements in India and to underline the indigenous origin of the movement. 
        </p>
      </section>

      <section className="welcome-section slide-up">
        <h2>Our Aims</h2>
        <p>
          1. To present the claims of Christ so that other students may come to a personal experience of Jesus Christ as Saviour, Lord and God, through the new birth.</p>
        <p>2. To have fellowship with all students of like precious faith, for mutual help and growth in the Christian life, especially by means of Bible study and prayer, and to encourage one another in witness for Christ.</p>

        <p>3. To raise a testimony in the colleges to the truths of the historic Christian faith, and to present its message for the whole of life and the problems of mankind.</p>

        <p>4. To present God's missionary command and so to help students discover and obey His will for them at home and abroad in world evangelization.
        </p>
      </section>

      <section className="welcome-section fade-in">
        <h2>Our Mission</h2>
        <p>
          UESI seeks to evangelize post-matric students in India, nurture them as disciples of the Lord Jesus Christ, that they may serve the Church and the society.
        </p>
      </section>

      <section className="welcome-section slide-up">
        <h2>Our Vision</h2>
        <p>
          Transformed students impacting the campuses and the nation as disciples of The Lord Jesus Christ.
        </p>
      </section>
    </div>
  );
}

export default Welcome;
