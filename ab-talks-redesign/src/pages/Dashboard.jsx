import React, { useEffect, useState } from "react";

function Dashboard({ navigate }) {
    const API_URL = "trustworthy-hope-production-749d.up.railway.app";
    const STUDENT_ID = "student-001";
    const TOTAL_DAYS = 60;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH STUDENT DATA
    // =====================================================

    const fetchStudentData = async () => {
        const response = await fetch(
            `${API_URL}/api/student`
        );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch student data."
            );
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(
                result.message ||
                "Unable to load challenge data."
            );
        }

        return result;
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const result =
                    await fetchStudentData();

                setData(result);
            } catch (err) {
                console.error(
                    "DASHBOARD ERROR:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load your challenge data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // =====================================================
    // START CHALLENGE
    // =====================================================

    const startChallenge = async () => {
        try {
            setStarting(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/challenge/start`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        studentId:
                            STUDENT_ID,

                        name:
                            data?.student?.name || "",

                        avatar:
                            data?.student?.avatar || null
                    })
                }
            );

            const result =
                await response.json();

            console.log(
                "START CHALLENGE:",
                result
            );

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    "Unable to start challenge."
                );
            }

            // ---------------------------------------------
            // IMPORTANT:
            // Update dashboard state first
            // ---------------------------------------------

            const updatedData =
                await fetchStudentData();

            setData(updatedData);

            // ---------------------------------------------
            // THEN GO TO DAY 1
            // ---------------------------------------------

            const currentDay =
                Number(
                    updatedData.challenge
                        ?.currentDay
                ) || 1;

            navigate(
                `/day/${currentDay}`
            );

        } catch (err) {
            console.error(
                "START CHALLENGE ERROR:",
                err
            );

            setError(
                err.message ||
                "Unable to start challenge."
            );
        } finally {
            setStarting(false);
        }
    };

    // =====================================================
    // OPEN CURRENT DAY
    // =====================================================

    const openCurrentDay = () => {
        if (!data?.challenge) {
            return;
        }

        const currentDay =
            Number(
                data.challenge.currentDay
            ) || 1;

        navigate(
            `/day/${currentDay}`
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <main>

                <p className="section-label">
                    ABTALKS
                </p>

                <h2>
                    Loading your challenge...
                </h2>

            </main>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error && !data) {
        return (
            <main>

                <section className="error-box">

                    <p className="section-label">
                        ABTALKS
                    </p>

                    <h2>
                        Something went wrong.
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="dashboard-home"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        TRY AGAIN
                    </button>

                </section>

            </main>
        );
    }

    // =====================================================
    // SAFE DATA
    // =====================================================

    const student =
        data?.student || {};

    const challenge =
        data?.challenge || {};

    const completedDays =
        Array.isArray(
            challenge.completedDays
        )
            ? challenge.completedDays
            : [];

    const totalDays =
        Number(
            challenge.totalDays
        ) || TOTAL_DAYS;

    const completedCount =
        completedDays.length;

    const progress =
        Math.min(
            100,
            (completedCount / totalDays) * 100
        );

    const currentDay =
        Math.min(
            totalDays,
            Math.max(
                1,
                Number(
                    challenge.currentDay
                ) || 1
            )
        );

    const streak =
        Number(
            challenge.streak
        ) || 0;

    const hasProfile =
        Boolean(
            student.name &&
            student.name.trim()
        );

    const challengeStarted =
        Boolean(
            student.challengeStarted
        );

    const isFirstDay =
        challengeStarted &&
        currentDay === 1 &&
        completedCount === 0 &&
        streak === 0;

    const missedDays =
        Array.isArray(
            challenge.missedDays
        )
            ? challenge.missedDays
            : [];

    const hasMissedDay =
        missedDays.length > 0;

    const challengeCompleted =
        Boolean(
            challenge.challengeCompleted
        );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main>

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="dashboard-header">

                <button
                    className="dashboard-logo"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    AB<span>TALKS</span>
                </button>

                <button className="profile-button">
                    {hasProfile
                        ? "👤"
                        : "○"}
                </button>

            </header>


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
                <div className="submit-error">
                    {error}
                </div>
            )}


            {/* =================================================
                INTRO
            ================================================= */}

            <section className="dashboard-intro">

                {challengeStarted ? (

                    <>
                        <p className="section-label">
                            WELCOME BACK
                        </p>

                        <h1>
                            Hey,{" "}
                            <span>
                                {hasProfile
                                    ? student.name
                                    : "Coder"}
                            </span>.
                        </h1>

                        <p>
                            Keep showing up.
                            One day at a time.
                        </p>
                    </>

                ) : (

                    <>
                        <p className="section-label">
                            WELCOME TO ABTALKS
                        </p>

                        <h1>
                            Your journey
                            <br />
                            starts{" "}
                            <span>
                                today.
                            </span>
                        </h1>

                        <p>
                            You don't need to be
                            perfect. You just need
                            to keep showing up.
                        </p>
                    </>

                )}

            </section>


            {/* =================================================
                PROFILE CARD
            ================================================= */}

            {!hasProfile && (
                <section className="profile-empty-card">

                    <div className="empty-profile-icon">
                        👤
                    </div>

                    <div>

                        <h3>
                            Complete your profile
                        </h3>

                        <p>
                            Add your name to
                            personalize your
                            ABTalks experience.
                        </p>

                    </div>

                </section>
            )}


            {/* =================================================
                STREAK
            ================================================= */}

            <section className="streak-card">

                <div className="streak-icon">
                    🔥
                </div>

                <div>

                    <small>
                        CURRENT STREAK
                    </small>

                    <strong>
                        {streak} DAYS
                    </strong>

                </div>

                <p className="streak-message">

                    {!challengeStarted
                        ? "Start today"
                        : streak === 0
                        ? "Start today"
                        : "Keep going!"}

                </p>

            </section>


            {/* =================================================
                FIRST DAY
            ================================================= */}

            {isFirstDay && (
                <section className="first-day-card">

                    <span>
                        🚀
                    </span>

                    <div>

                        <strong>
                            Your first day starts now.
                        </strong>

                        <p>
                            Everyone starts at
                            Day 1. Complete
                            today's challenge
                            and build your
                            first streak.
                        </p>

                    </div>

                </section>
            )}


            {/* =================================================
                MISSED DAY
            ================================================= */}

            {hasMissedDay && (
                <section className="missed-day-card">

                    <span>
                        💛
                    </span>

                    <div>

                        <strong>
                            No shame. Just continue.
                        </strong>

                        <p>
                            You missed Day{" "}
                            {
                                missedDays[
                                    missedDays.length - 1
                                ]
                            }.
                            That's okay.
                            Today's challenge
                            is still waiting
                            for you.
                        </p>

                    </div>

                </section>
            )}


            {/* =================================================
                NOT STARTED
            ================================================= */}

            {!challengeStarted ? (

                <section className="today-card">

                    <div className="today-top">

                        <div>

                            <p className="section-label">
                                60 DAY CODING CHALLENGE
                            </p>

                            <h2>
                                DAY 1
                            </h2>

                        </div>

                        <div className="progress-circle">
                            0%
                        </div>

                    </div>


                    <div className="challenge-info">

                        <span className="difficulty">
                            CHALLENGE
                        </span>

                        <h3>
                            Your coding journey
                            starts here.
                        </h3>

                        <p>
                            Start the 60 Day
                            Coding Challenge,
                            complete one task
                            every day, and
                            submit your proof
                            of work.
                        </p>

                    </div>


                    <button
                        className="dashboard-start"
                        onClick={
                            startChallenge
                        }
                        disabled={starting}
                    >

                        {starting
                            ? "STARTING..."
                            : "START DAY 1"}

                        {!starting && (
                            <span>
                                →
                            </span>
                        )}

                    </button>

                </section>

            ) : challengeCompleted ? (

                /* =================================================
                   CHALLENGE COMPLETED
                ================================================= */

                <section className="today-card">

                    <div className="today-top">

                        <div>

                            <p className="section-label">
                                CONGRATULATIONS
                            </p>

                            <h2>
                                60 DAYS COMPLETE
                            </h2>

                        </div>

                        <div className="progress-circle">
                            100%
                        </div>

                    </div>


                    <div className="challenge-info">

                        <span className="difficulty">
                            COMPLETED
                        </span>

                        <h3>
                            You completed the
                            entire challenge! 🎉
                        </h3>

                        <p>
                            60 days of consistency.
                            Great work.
                        </p>

                    </div>

                </section>

            ) : (

                /* =================================================
                   ACTIVE CHALLENGE
                ================================================= */

                <section className="today-card">

                    <div className="today-top">

                        <div>

                            <p className="section-label">
                                TODAY'S CHALLENGE
                            </p>

                            <h2>
                                DAY {currentDay}
                            </h2>

                        </div>

                        <div className="progress-circle">

                            {Math.round(
                                progress
                            )}%

                        </div>

                    </div>


                    <div className="challenge-info">

                        <span className="difficulty">
                            CHALLENGE
                        </span>

                        <h3>
                            Today's coding
                            challenge
                        </h3>

                        <p>
                            Complete today's
                            task and submit
                            your proof of work
                            to continue your
                            journey.
                        </p>

                    </div>


                    <button
                        className="dashboard-start"
                        onClick={
                            openCurrentDay
                        }
                    >

                        START DAY{" "}
                        {currentDay}

                        <span>
                            →
                        </span>

                    </button>

                </section>

            )}


            {/* =================================================
                PROGRESS
            ================================================= */}

            <section className="progress-card">

                <div className="card-heading">

                    <h2>
                        Your Progress
                    </h2>

                    <span>
                        {completedCount}/
                        {totalDays}
                    </span>

                </div>


                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{
                            width:
                                `${progress}%`
                        }}
                    />

                </div>


                <div className="progress-labels">

                    <span>
                        DAY 1
                    </span>

                    <span>
                        DAY {totalDays}
                    </span>

                </div>

            </section>


            {/* =================================================
                ACHIEVEMENTS
            ================================================= */}

            <section className="achievements">

                <h2>
                    Achievements
                </h2>


                <div className="achievement-grid">

                    {/* FIRST STEP */}

                    <div
                        className={
                            completedCount >= 1
                                ? "achievement-card"
                                : "achievement-card locked"
                        }
                    >

                        <span>
                            🚀
                        </span>

                        <strong>
                            First Step
                        </strong>

                        <small>
                            Complete Day 1
                        </small>

                    </div>


                    {/* 7 DAY STREAK */}

                    <div
                        className={
                            streak >= 7
                                ? "achievement-card"
                                : "achievement-card locked"
                        }
                    >

                        <span>
                            🔥
                        </span>

                        <strong>
                            7 Day Streak
                        </strong>

                        <small>
                            Stay consistent
                        </small>

                    </div>


                    {/* HALF WAY */}

                    <div
                        className={
                            completedCount >= 30
                                ? "achievement-card"
                                : "achievement-card locked"
                        }
                    >

                        <span>
                            🏆
                        </span>

                        <strong>
                            Halfway
                        </strong>

                        <small>
                            Complete 30 days
                        </small>

                    </div>

                </div>

            </section>


            {/* =================================================
                MOTIVATION
            ================================================= */}

            <section className="dashboard-motivation">

                <span>
                    {completedCount}/{totalDays}
                </span>

                <small>
                    DAYS INTO THE CHALLENGE
                </small>

                <p>
                    You don't have to be great
                    at coding. You just have to
                    keep showing up.
                </p>

            </section>


            {/* =================================================
                BACK HOME
            ================================================= */}

            <button
                className="dashboard-home"
                onClick={() =>
                    navigate("/")
                }
            >
                ← BACK TO HOME
            </button>

        </main>
    );
}

export default Dashboard;