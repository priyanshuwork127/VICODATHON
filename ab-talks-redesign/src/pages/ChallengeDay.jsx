import React, { useState } from "react";

function ChallengeDay() {
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Get day from URL
  const path = window.location.pathname;

  // Example:
  // /day/12 → ["day", "12"]
  const parts = path.split("/");

  const currentDay = parts[2] || "1";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!github && !linkedin) {
      alert("Please submit at least one proof of work.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className="challenge-day">

      {/* BACK */}

      <a href="/dashboard" className="back-button">
        ← Dashboard
      </a>


      {/* HEADER */}

      <section className="day-header">

        <div>
          <p className="section-label">
            60 DAY CODING CHALLENGE
          </p>

          <h1>
            DAY {currentDay}
          </h1>
        </div>


        <div className="day-counter">

          <strong>
            {currentDay}
          </strong>

          <small>
            / 60
          </small>

        </div>

      </section>


      {/* TASK */}

      <section className="task-card">

        <div className="task-meta">

          <span>
            DAY {currentDay}
          </span>

          <span>
            DSA
          </span>

          <span>
            MEDIUM
          </span>

        </div>


        <h2>
          Two Sum
        </h2>


        <p className="task-description">
          Solve today's coding problem and submit
          your proof of work.

          Focus on understanding the approach
          instead of simply copying the solution.
        </p>


        <hr />


        <h3>
          Today's Goal
        </h3>


        <ul>

          <li>
            Understand the problem completely.
          </li>

          <li>
            Write your own solution.
          </li>

          <li>
            Test your solution with different inputs.
          </li>

          <li>
            Submit your proof of work.
          </li>

        </ul>


        <div className="goal-box">

          <strong>
            💡 REMEMBER
          </strong>

          <p>
            You don't need to solve everything perfectly.
            The goal is to learn something every day.
          </p>

        </div>

      </section>


      {/* PROOF OF WORK */}

      {!submitted ? (

        <section className="submission">

          <p className="section-label">
            PROOF OF WORK
          </p>


          <h2>
            Show that you did it.
          </h2>


          <p>
            Submit your GitHub repository or commit
            and optionally share your progress on LinkedIn.
          </p>


          <form
            className="proof-form"
            onSubmit={handleSubmit}
          >

            <label>

              GitHub Repository / Commit

              <input
                type="url"
                placeholder="https://github.com/..."
                value={github}
                onChange={(e) =>
                  setGithub(e.target.value)
                }
              />

            </label>


            <label>

              LinkedIn Post

              <input
                type="url"
                placeholder="https://linkedin.com/posts/..."
                value={linkedin}
                onChange={(e) =>
                  setLinkedin(e.target.value)
                }
              />

            </label>


            <button
              type="submit"
              className="submit-button"
            >
              SUBMIT DAY {currentDay} →
            </button>

          </form>

        </section>

      ) : (

        <section className="success">

          <span>
            ✓
          </span>


          <h2>
            DAY {currentDay} COMPLETE!
          </h2>


          <p>
            You showed up today.
          </p>


          <a
            href="/dashboard"
            className="submit-button"
          >
            BACK TO DASHBOARD →
          </a>

        </section>

      )}


      {/* MOTIVATION */}

      <section className="day-motivation">

        <strong>
          {currentDay}/60
        </strong>


        <p>
          You're already ahead of everyone
          who never started.
        </p>


        <b>
          Keep going. See you tomorrow.
        </b>

      </section>

    </main>
  );
}

export default ChallengeDay;