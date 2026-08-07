import React from "react";

export default function Hero() {
  return (
    <>
      {/* ================= HERO ================= */}

      <section className="hero" id="home">

        <div className="hero-glow"></div>

        <div className="hero-content">

          <div className="presented">
            <span>🔥</span>
            ABTALKS PRESENTS
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
            <i>•</i>
            <span>60 Problems</span>
            <i>•</i>
            <span>Better You</span>
          </div>

          <a href="/challenge" className="start-btn">
            START DAY 01
            <span>→</span>
          </a>

        </div>

        {/* Developer illustration / card */}

        <div className="hero-visual">

          <div className="code-symbol">
            &lt;/&gt;
          </div>

          <div className="day-floating-card">
            <small>DAY</small>
            <strong>01</strong>
            <span>/ 60</span>
          </div>

          <div className="developer">
            <div className="head"></div>
            <div className="hair"></div>
            <div className="body"></div>
            <div className="arm"></div>

            <div className="monitor">
              <div className="screen-line"></div>
              <div className="screen-line short"></div>
              <div className="screen-line"></div>
              <div className="screen-line tiny"></div>
              <div className="screen-line short"></div>
            </div>

            <div className="desk"></div>
          </div>

        </div>

      </section>


      {/* ================= PROGRESS ================= */}

      <section className="progress-section">

        <div className="progress-card">

          <div className="progress-heading">
            <span>↗</span>
            YOUR PROGRESS
          </div>

          <div className="milestone-row">

            <Milestone
              number="01"
              label="Start"
              active
            />

            <div className="dash"></div>

            <Milestone
              number="15"
              label="Build"
            />

            <div className="dash"></div>

            <Milestone
              number="30"
              label="Grow"
            />

            <div className="dash"></div>

            <Milestone
              number="45"
              label="Push"
            />

            <div className="dash"></div>

            <Milestone
              number="60"
              label="Complete"
              final
            />

          </div>

        </div>

      </section>


      {/* ================= WHY JOIN ================= */}

      <section
        className="section why-section"
        id="challenge"
      >

        <SectionTitle
          title="WHY JOIN?"
        />

        <div className="why-grid">

          <div className="why-card">
            <div className="why-icon purple">▣</div>

            <h3>Build Consistency</h3>

            <p>
              One problem every day
              builds a strong habit.
            </p>
          </div>


          <div className="why-card">
            <div className="why-icon green">↗</div>

            <h3>Improve Daily</h3>

            <p>
              Learn new concepts and
              get better step by step.
            </p>
          </div>


          <div className="why-card">
            <div className="why-icon yellow">♛</div>

            <h3>Reach Day 60</h3>

            <p>
              Don't break the chain.
              Finish what you started.
            </p>
          </div>

        </div>

      </section>


      {/* ================= JOURNEY ================= */}

      <section
        className="section journey-section"
        id="journey"
      >

        <SectionTitle
          title="THE 60-DAY JOURNEY"
        />

        <div className="journey-line">

          <JourneyPoint
            number="01"
            title="START"
            text="Take the first step."
            active
          />

          <JourneyPoint
            number="15"
            title="BUILD"
            text="The habit starts forming."
          />

          <JourneyPoint
            number="30"
            title="GROW"
            text="You start seeing the difference."
          />

          <JourneyPoint
            number="45"
            title="PUSH"
            text="You're closer than you think."
          />

          <JourneyPoint
            number="60"
            title="COMPLETE"
            text="You didn't quit."
            final
          />

        </div>

      </section>


      {/* ================= PLATFORMS ================= */}

      <section
        className="section platforms-section"
        id="platforms"
      >

        <SectionTitle
          title="PRACTICE WHERE YOU ALREADY CODE"
        />

        <div className="platform-list">

          <PlatformCard
            icon="LC"
            title="LeetCode"
            text="Solve problems and improve your DSA skills."
            type="leetcode"
          />

          <div className="platform-arrow">→</div>

          <PlatformCard
            icon="CC"
            title="CodeChef"
            text="Practice, compete and level up your problem solving."
            type="codechef"
          />

          <div className="platform-arrow">→</div>

          <PlatformCard
            icon="&lt;/&gt;"
            title="ABTalks"
            text="Track your progress and complete the 60-day challenge."
            type="abt"
          />

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="final-section">

        <div className="final-card">

          <div className="confetti confetti-one">◆</div>
          <div className="confetti confetti-two">◆</div>

          <div className="final-copy">

            <h2>
              Your <span>Day 1</span>
              <br />
              starts today.
            </h2>

            <p>
              One problem today.
              <br />
              A better developer
              60 days from now.
            </p>

            <a
              href="/challenge"
              className="final-btn"
            >
              JOIN THE 60 DAY CHALLENGE
              <span>→</span>
            </a>

          </div>

          <div className="trophy">
            🏆
          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section
        className="about-section"
        id="about"
      >
        <div className="about-code">
          &lt;/&gt;
        </div>

        <p>
          Learn • Practice • Complete
        </p>

        <strong>
          See you on <span>Day 60.</span> 💙
        </strong>
      </section>

    </>
  );
}


/* ================= COMPONENTS ================= */

function Milestone({
  number,
  label,
  active,
  final
}) {
  return (
    <div
      className={`milestone ${
        active ? "active" : ""
      } ${final ? "final" : ""}`}
    >
      <div className="milestone-circle">
        {number}
      </div>

      <span>{label}</span>
    </div>
  );
}


function SectionTitle({ title }) {
  return (
    <div className="section-title">

      <h2>{title}</h2>

      <div></div>

    </div>
  );
}


function JourneyPoint({
  number,
  title,
  text,
  active,
  final
}) {
  return (
    <div
      className={`journey-point ${
        active ? "active" : ""
      } ${final ? "final" : ""}`}
    >

      <div className="journey-circle">
        {number}
      </div>

      <strong>{title}</strong>

      <p>{text}</p>

    </div>
  );
}


function PlatformCard({
  icon,
  title,
  text,
  type
}) {
  return (
    <div className={`platform-card ${type}`}>

      <div className="platform-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>

    </div>
  );
}