import React, {
    useEffect,
    useState
} from "react";

function ChallengeDay({ navigate }) {

    const API_URL ="https://trustworthy-hope-production-749d.up.railway.app";

    const STUDENT_ID =
        "student-001";

    const TOTAL_DAYS =
        60;


    // =====================================================
    // STATE
    // =====================================================

    const [challenge, setChallenge] =
        useState(null);

    const [studentData, setStudentData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [github, setGithub] =
        useState("");

    const [linkedin, setLinkedin] =
        useState("");

    const [submitted, setSubmitted] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [submitError, setSubmitError] =
        useState("");

    const [remainingMs, setRemainingMs] =
        useState(null);

    const [deadlineExpired, setDeadlineExpired] =
        useState(false);


    // =====================================================
    // GET DAY FROM URL
    // =====================================================

    const path =
        window.location.pathname;

    const requestedDay =
        Number(
            path.split("/")[2]
        ) || 1;


    // =====================================================
    // FETCH STUDENT
    // =====================================================

    const fetchStudentData =
        async () => {

            const response =
                await fetch(
                    `${API_URL}/api/student`
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load student data."
                );
            }


            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load student data."
                );
            }


            return data;
        };


    // =====================================================
    // LOAD CHALLENGE
    // =====================================================

    const loadChallenge =
        async () => {

            try {

                setLoading(
                    true
                );

                setError("");

                setSubmitError("");


                // -----------------------------------------
                // STUDENT
                // -----------------------------------------

                const student =
                    await fetchStudentData();


                setStudentData(
                    student
                );


                // -----------------------------------------
                // CHECK STARTED
                // -----------------------------------------

                if (
                    !student.student.challengeStarted
                ) {

                    setError(
                        "You have not started the 60 Day Challenge yet."
                    );

                    return;
                }


                // -----------------------------------------
                // SERVER CURRENT DAY
                // -----------------------------------------

                const currentDay =
                    Number(
                        student
                            ?.challenge
                            ?.currentDay
                    ) || 1;


                // -----------------------------------------
                // INVALID DAY
                // -----------------------------------------

                if (
                    requestedDay < 1 ||
                    requestedDay > TOTAL_DAYS
                ) {

                    setError(
                        `Day must be between 1 and ${TOTAL_DAYS}.`
                    );

                    return;
                }


                // -----------------------------------------
                // FUTURE DAY
                // -----------------------------------------

                if (
                    requestedDay >
                    currentDay
                ) {

                    setError(
                        `Day ${requestedDay} is not available yet. Current day is Day ${currentDay}.`
                    );

                    return;
                }


                // -----------------------------------------
                // COMPLETED DAYS
                // -----------------------------------------

                const completedDays =
                    student
                        ?.challenge
                        ?.completedDays ||
                    [];


                const isCompleted =
                    completedDays.includes(
                        requestedDay
                    );


                setSubmitted(
                    isCompleted
                );


                // -----------------------------------------
                // TIMER
                //
                // Backend returns:
                //
                // student.challenge.time
                // -----------------------------------------

                const time =
                    student
                        ?.challenge
                        ?.time;


                if (time) {

                    const serverRemainingMs =
                        Number(
                            time.remainingMs
                        ) || 0;


                    setRemainingMs(
                        serverRemainingMs
                    );


                    setDeadlineExpired(

                        Boolean(

                            time.expired ||

                            serverRemainingMs <=
                            0

                        )
                    );

                } else {

                    setRemainingMs(
                        0
                    );

                    setDeadlineExpired(
                        true
                    );
                }


                // -----------------------------------------
                // FETCH CHALLENGE
                // -----------------------------------------

                const response =
                    await fetch(

                        `${API_URL}/api/challenges/day/${requestedDay}`

                    );


                if (!response.ok) {

                    throw new Error(
                        "Challenge not found."
                    );
                }


                const data =
                    await response.json();


                if (!data.success) {

                    throw new Error(
                        data.message ||
                        "Challenge not found."
                    );
                }


                setChallenge(
                    data
                );

            } catch (err) {

                console.error(
                    "CHALLENGE ERROR:",
                    err
                );


                setError(
                    err.message ||
                    "Unable to load challenge."
                );

            } finally {

                setLoading(
                    false
                );
            }
        };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {

            loadChallenge();

        },
        [requestedDay]
    );


    // =====================================================
    // COUNTDOWN
    // =====================================================

    useEffect(
        () => {

            if (
                remainingMs === null ||
                remainingMs <= 0 ||
                deadlineExpired
            ) {

                return;
            }


            const timer =
                setInterval(
                    () => {

                        setRemainingMs(
                            (previous) => {

                                if (
                                    previous <=
                                    1000
                                ) {

                                    return 0;
                                }


                                return (
                                    previous -
                                    1000
                                );
                            }
                        );

                    },
                    1000
                );


            return () => {

                clearInterval(
                    timer
                );
            };

        },
        [deadlineExpired]
    );


    // =====================================================
    // DETECT TIMER EXPIRY
    // =====================================================

    useEffect(
        () => {

            if (
                remainingMs === null
            ) {

                return;
            }


            if (
                remainingMs <= 0 &&
                !deadlineExpired
            ) {

                setDeadlineExpired(
                    true
                );
            }

        },
        [
            remainingMs,
            deadlineExpired
        ]
    );


    // =====================================================
    // WHEN TIMER EXPIRES
    // ASK SERVER FOR CURRENT DAY
    // =====================================================

    useEffect(
        () => {

            if (
                !deadlineExpired
            ) {

                return;
            }


            const refresh =
                async () => {

                    try {

                        const student =
                            await fetchStudentData();


                        setStudentData(
                            student
                        );


                        const currentDay =
                            Number(
                                student
                                    ?.challenge
                                    ?.currentDay
                            ) || 1;


                        // -------------------------------------
                        // NEXT DAY AVAILABLE
                        // -------------------------------------

                        if (
                            currentDay >
                            requestedDay
                        ) {

                            navigate(
                                `/day/${currentDay}`
                            );

                            return;
                        }


                        // -------------------------------------
                        // REFRESH SERVER TIMER
                        // -------------------------------------

                        const time =
                            student
                                ?.challenge
                                ?.time;


                        if (time) {

                            const serverRemainingMs =
                                Number(
                                    time.remainingMs
                                ) || 0;


                            if (
                                serverRemainingMs >
                                0
                            ) {

                                setRemainingMs(
                                    serverRemainingMs
                                );

                                setDeadlineExpired(
                                    false
                                );
                            }
                        }

                    } catch (error) {

                        console.error(
                            "TIMER REFRESH ERROR:",
                            error
                        );
                    }
                };


            refresh();

        },
        [
            deadlineExpired,
            requestedDay,
            navigate
        ]
    );


    // =====================================================
    // FORMAT TIME
    // =====================================================

    const formatTime =
        (milliseconds) => {

            if (
                milliseconds === null ||
                milliseconds <= 0
            ) {

                return "00:00:00";
            }


            const totalSeconds =
                Math.floor(
                    milliseconds /
                    1000
                );


            const hours =
                Math.floor(
                    totalSeconds /
                    3600
                );


            const minutes =
                Math.floor(

                    (
                        totalSeconds %
                        3600
                    ) /

                    60

                );


            const seconds =
                totalSeconds %
                60;


            return (

                String(hours)
                    .padStart(
                        2,
                        "0"
                    ) +

                ":" +

                String(minutes)
                    .padStart(
                        2,
                        "0"
                    ) +

                ":" +

                String(seconds)
                    .padStart(
                        2,
                        "0"
                    )
            );
        };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit =
        async (e) => {

            e.preventDefault();


            setSubmitError("");


            // -----------------------------------------
            // CHALLENGE CHECK
            // -----------------------------------------

            if (
                !challenge
            ) {

                setSubmitError(
                    "Challenge is not available."
                );

                return;
            }


            // -----------------------------------------
            // TIMER CHECK
            // -----------------------------------------

            if (

                deadlineExpired ||

                remainingMs === null ||

                remainingMs <= 0

            ) {

                setSubmitError(
                    "This day's time has expired."
                );

                return;
            }


            // -----------------------------------------
            // PROOF CHECK
            // -----------------------------------------

            if (

                !github.trim() &&

                !linkedin.trim()

            ) {

                setSubmitError(
                    "Please provide GitHub or LinkedIn proof."
                );

                return;
            }


            try {

                setSubmitting(
                    true
                );


                // -----------------------------------------
                // SUBMIT
                // -----------------------------------------

                const response =
                    await fetch(

                        `${API_URL}/api/submissions`,

                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"
                            },

                            body:

                                JSON.stringify({

                                    studentId:
                                        STUDENT_ID,

                                    day:
                                        challenge.day,

                                    github:
                                        github.trim() ||
                                        null,

                                    linkedin:
                                        linkedin.trim() ||
                                        null
                                })
                        }
                    );


                const result =
                    await response.json();


                // -----------------------------------------
                // ERROR
                // -----------------------------------------

                if (
                    !response.ok
                ) {

                    throw new Error(
                        result.message ||
                        "Submission failed."
                    );
                }


                console.log(
                    "SUBMITTED:",
                    result
                );


                // -----------------------------------------
                // SUCCESS
                // -----------------------------------------

                setSubmitted(
                    true
                );


                setGithub(
                    ""
                );


                setLinkedin(
                    ""
                );


                // -----------------------------------------
                // REFRESH STUDENT
                // -----------------------------------------

                const updatedStudent =
                    await fetchStudentData();


                setStudentData(
                    updatedStudent
                );


                // -----------------------------------------
                // REFRESH TIMER
                // -----------------------------------------

                const time =
                    updatedStudent
                        ?.challenge
                        ?.time;


                if (time) {

                    const updatedRemainingMs =
                        Number(
                            time.remainingMs
                        ) || 0;


                    setRemainingMs(
                        updatedRemainingMs
                    );


                    setDeadlineExpired(

                        Boolean(

                            time.expired ||

                            updatedRemainingMs <=
                            0

                        )
                    );
                }

            } catch (err) {

                console.error(
                    "SUBMISSION ERROR:",
                    err
                );


                setSubmitError(
                    err.message ||
                    "Unable to submit proof."
                );

            } finally {

                setSubmitting(
                    false
                );
            }
        };


    // =====================================================
    // PREVIOUS DAY
    // =====================================================

    const goToPreviousDay =
        () => {

            if (
                requestedDay > 1
            ) {

                navigate(
                    `/day/${requestedDay - 1}`
                );
            }
        };


    // =====================================================
    // NEXT DAY
    // =====================================================

    const goToNextDay =
        () => {

            const currentDay =
                Number(

                    studentData
                        ?.challenge
                        ?.currentDay

                ) || 1;


            if (
                requestedDay <
                currentDay
            ) {

                navigate(
                    `/day/${requestedDay + 1}`
                );
            }
        };


    // =====================================================
    // LOADING
    // =====================================================

    if (
        loading
    ) {

        return (

            <main>

                <p className="section-label">
                    ABTALKS
                </p>

                <h2>
                    Loading Day {requestedDay}...
                </h2>

            </main>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (
        error ||
        !challenge
    ) {

        return (

            <main>

                <button
                    className="back-button"

                    onClick={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                >
                    ← Dashboard
                </button>


                <div className="error-box">

                    <h2>
                        Challenge Not Available
                    </h2>


                    <p>
                        {error}
                    </p>


                    <button
                        className="submit-button"

                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                    >
                        BACK TO DASHBOARD
                    </button>

                </div>

            </main>
        );
    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <main>

            {/* =================================================
                BACK
            ================================================= */}

            <button
                className="back-button"

                onClick={() =>
                    navigate(
                        "/dashboard"
                    )
                }
            >
                ← Dashboard
            </button>


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="day-header">

                <div>

                    <p className="section-label">
                        60 DAY CODING CHALLENGE
                    </p>


                    <h1>
                        DAY {challenge.day}
                    </h1>

                </div>


                <div className="day-counter">

                    <strong>

                        {String(
                            challenge.day
                        ).padStart(
                            2,
                            "0"
                        )}

                    </strong>


                    <small>
                        / {TOTAL_DAYS}
                    </small>

                </div>

            </section>


            {/* =================================================
                COUNTDOWN
            ================================================= */}

            {!submitted && (

                <section className="countdown-card">

                    <p className="section-label">
                        TIME REMAINING
                    </p>


                    <h2>

                        {deadlineExpired

                            ? "TIME EXPIRED"

                            : formatTime(
                                remainingMs
                            )

                        }

                    </h2>


                    <p>

                        {deadlineExpired

                            ? "Checking for the next challenge..."

                            : "Complete today's challenge before the timer ends."

                        }

                    </p>

                </section>

            )}


            {/* =================================================
                COMPLETED
            ================================================= */}

            {submitted && (

                <section className="countdown-card">

                    <p className="section-label">
                        DAY COMPLETED
                    </p>


                    <h2>
                        ✓ COMPLETED
                    </h2>


                    <p>
                        Your submission is saved.
                    </p>


                    <small>

                        Day {challenge.day}
                        {" "}
                        will remain active
                        until its time window ends.

                    </small>

                </section>

            )}


            {/* =================================================
                TASK
            ================================================= */}

            <section className="task-card">

                <div className="task-meta">

                    <span>
                        DAY {challenge.day}
                    </span>


                    <span>
                        {challenge.category}
                    </span>


                    <span>
                        {challenge.difficulty}
                    </span>

                </div>


                <h2>
                    {challenge.title}
                </h2>


                <p className="task-description">
                    {challenge.description}
                </p>


                <hr />


                <h3>
                    Today's Goal
                </h3>


                <div className="goal-box">

                    <strong>
                        🎯 GOAL
                    </strong>


                    <p>
                        {challenge.goal}
                    </p>

                </div>


                <div className="goal-box">

                    <strong>
                        💡 REMEMBER
                    </strong>


                    <p>

                        You don't need to solve
                        everything perfectly.
                        The goal is to learn
                        something every day.

                    </p>

                </div>

            </section>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div className="day-navigation">

                <button
                    className="day-nav-button"

                    disabled={
                        requestedDay === 1
                    }

                    onClick={
                        goToPreviousDay
                    }
                >
                    ← PREVIOUS
                </button>


                <span className="day-nav-current">

                    DAY {requestedDay}
                    {" "}
                    / {TOTAL_DAYS}

                </span>


                <button
                    className="day-nav-button"

                    disabled={

                        requestedDay >=

                        (

                            studentData
                                ?.challenge
                                ?.currentDay ||

                            1

                        )

                    }

                    onClick={
                        goToNextDay
                    }
                >
                    NEXT →
                </button>

            </div>


            {/* =================================================
                SUBMISSION
            ================================================= */}

            {!submitted ? (

                <section className="submission">

                    <p className="section-label">
                        PROOF OF WORK
                    </p>


                    <h2>
                        Show that you did it.
                    </h2>


                    <p>
                        Submit your GitHub repository
                        or LinkedIn post.
                    </p>


                    {submitError && (

                        <div className="submit-error">

                            {submitError}

                        </div>

                    )}


                    <form
                        className="proof-form"

                        onSubmit={
                            handleSubmit
                        }
                    >

                        {/* GITHUB */}

                        <label>

                            GitHub Repository / Commit


                            <input
                                type="url"

                                placeholder={
                                    "https://github.com/..."
                                }

                                value={
                                    github
                                }

                                onChange={
                                    (e) =>
                                        setGithub(
                                            e.target.value
                                        )
                                }

                                disabled={

                                    submitting ||

                                    deadlineExpired

                                }
                            />

                        </label>


                        {/* LINKEDIN */}

                        <label>

                            LinkedIn Post


                            <input
                                type="url"

                                placeholder={
                                    "https://linkedin.com/posts/..."
                                }

                                value={
                                    linkedin
                                }

                                onChange={
                                    (e) =>
                                        setLinkedin(
                                            e.target.value
                                        )
                                }

                                disabled={

                                    submitting ||

                                    deadlineExpired

                                }
                            />

                        </label>


                        {/* SUBMIT */}

                        <button
                            type="submit"

                            className="submit-button"

                            disabled={

                                submitting ||

                                deadlineExpired ||

                                remainingMs <= 0

                            }
                        >

                            {submitting

                                ? "SUBMITTING..."

                                : deadlineExpired ||
                                  remainingMs <= 0

                                ? "TIME EXPIRED"

                                : `SUBMIT DAY ${challenge.day} →`

                            }

                        </button>

                    </form>

                </section>

            ) : (

                <section className="success">

                    <span>
                        ✓
                    </span>


                    <h2>
                        DAY {challenge.day} COMPLETE!
                    </h2>


                    <p>
                        Your proof has been submitted successfully.
                    </p>


                    <p>

                        Day {challenge.day}
                        {" "}
                        will remain active
                        until its time window ends.

                    </p>


                    <button
                        className="submit-button"

                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                    >
                        BACK TO DASHBOARD →
                    </button>

                </section>

            )}


            {/* =================================================
                MOTIVATION
            ================================================= */}

            <section className="day-motivation">

                <strong>

                    {challenge.day}
                    /
                    {TOTAL_DAYS}

                </strong>


                <p>
                    You're already ahead of
                    everyone who never started.
                </p>


                <b>
                    Keep going.
                </b>

            </section>

        </main>
    );
}

export default ChallengeDay;