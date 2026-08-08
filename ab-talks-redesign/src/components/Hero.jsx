import React from "react";

function Hero({ navigate }) {
  return (
    <main>

      <section className="hero">

        <div className="hero-content">

          <div className="presented">
            🔥 ABTALKS PRESENTS
          </div>

          <h1>
            60 DAYS
            <br />
            <span>CODING</span>
            <br />
            CHALLENGE
          </h1>

          <div className="yellow-line"></div>

          <p className="hero-message">
            You don't have to be great
            <br />
            at coding.
            <br />
            Just show up <strong>every day.</strong>
          </p>

          <div className="hero-stats">
            <span>★ 60 Days</span>
            <span>•</span>
            <span>60 Problems</span>
            <span>•</span>
            <span>Better You</span>
          </div>

          <button
            className="start-button"
            onClick={() => navigate("/dashboard")}
          >
            JOIN THE 60 DAY CHALLENGE →
          </button>

        </div>

      </section>


      <section className="why" id="why">

        <p className="section-label">
          WHY ABTALKS?
        </p>

        <h2>
          Small steps.
          <br />
          Big change.
        </h2>

        <div className="why-grid">

          <div className="why-card">
            <span>🔥</span>

            <h3>
              Build Consistency
            </h3>

            <p>
              One problem every day
              builds a real habit.
            </p>
          </div>

          <div className="why-card">
            <span>📈</span>

            <h3>
              Improve Daily
            </h3>

            <p>
              Learn something new
              every single day.
            </p>
          </div>

          <div className="why-card">
            <span>🏆</span>

            <h3>
              Reach Day 60
            </h3>

            <p>
              Finish what you started.
            </p>
          </div>

        </div>

      </section>


      <section className="final-cta">

        <p>
          YOUR DAY 1 STARTS TODAY.
        </p>

        <h2>
          Don't wait
          <br />
          for motivation.
        </h2>

        <button
          onClick={() => navigate("/dashboard")}
        >
          START THE CHALLENGE →
        </button>

      </section>

    </main>
  );
}

export default Hero;