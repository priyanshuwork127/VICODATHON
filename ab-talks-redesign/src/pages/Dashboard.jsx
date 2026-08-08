import React from "react";

function Dashboard({ navigate }) {
  return (
    <main className="dashboard-page">

      {/* HEADER */}

      <header className="dashboard-header">

        <button
          className="dashboard-logo"
          onClick={() => navigate("/")}
        >
          AB<span>Talks</span>
        </button>

        <button
          className="profile-button"
          onClick={() => alert("Profile coming soon")}
        >
          👤
        </button>

      </header>


      {/* GREETING */}

      <section className="dashboard-intro">

        <p className="section-label">
          YOUR CODING JOURNEY
        </p>

        <h1>
          Keep going,
          <br />
          <span>Priyanshu.</span>
        </h1>

        <p>
          One problem today.
          <br />
          A better developer tomorrow.
        </p>

      </section>


      {/* STREAK */}

      <section className="streak-card">

        <div className="streak-icon">
          🔥
        </div>

        <div>
          <small>
            CURRENT STREAK
          </small>

          <strong>
            12 DAYS
          </strong>
        </div>

        <span className="streak-message">
          Keep it alive!
        </span>

      </section>


      {/* TODAY */}

      <section className="today-card">

        <div className="today-top">

          <div>
            <p className="section-label">
              TODAY'S CHALLENGE
            </p>

            <h2>
              DAY 12
            </h2>
          </div>

          <div className="progress-circle">
            20%
          </div>

        </div>


        <div className="challenge-info">

          <span className="difficulty">
            MEDIUM
          </span>

          <h3>
            Two Sum
          </h3>

          <p>
            Solve today's problem and
            understand the approach.
          </p>

        </div>


        <button
          className="dashboard-start"
          onClick={() => navigate("/day/12")}
        >
          START DAY 12
          <span>→</span>
        </button>

      </section>


      {/* PROGRESS */}

      <section className="progress-card">

        <div className="card-heading">

          <div>
            <p className="section-label">
              YOUR PROGRESS
            </p>

            <h2>
              12 / 60
            </h2>
          </div>

          <span>
            20%
          </span>

        </div>


        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: "20%"
            }}
          ></div>

        </div>


        <div className="progress-labels">

          <span>
            DAY 1
          </span>

          <span>
            DAY 60
          </span>

        </div>

      </section>


      {/* ACHIEVEMENTS */}

      <section className="achievements">

        <p className="section-label">
          ACHIEVEMENTS
        </p>

        <h2>
          You're building something.
        </h2>


        <div className="achievement-grid">

          <div className="achievement-card active">

            <span>
              🔥
            </span>

            <strong>
              7 DAY
            </strong>

            <small>
              STREAK
            </small>

          </div>


          <div className="achievement-card active">

            <span>
              ⚡
            </span>

            <strong>
              10
            </strong>

            <small>
              PROBLEMS
            </small>

          </div>


          <div className="achievement-card locked">

            <span>
              🏆
            </span>

            <strong>
              30
            </strong>

            <small>
              DAYS
            </small>

          </div>

        </div>

      </section>


      {/* MOTIVATION */}

      <section className="dashboard-motivation">

        <div>
          <span>
            12
          </span>

          <small>
            DAYS DONE
          </small>
        </div>


        <p>
          "Consistency beats
          motivation."
        </p>

      </section>


      {/* BACK TO HOME */}

      <button
        className="dashboard-home"
        onClick={() => navigate("/")}
      >
        ← BACK TO HOME
      </button>

    </main>
  );
}

export default Dashboard;