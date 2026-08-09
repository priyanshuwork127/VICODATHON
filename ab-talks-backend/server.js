const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const challenges = require("./challenges.json");

const app = express();

const PORT = process.env.PORT || 5000;

const TIMEZONE = "Asia/Kolkata";
const TOTAL_DAYS = 60;
const STUDENT_ID = "student-001";

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());

// =====================================================
// FILE PATHS
// =====================================================

const submissionsFile = path.join(
    __dirname,
    "submissions.json"
);

const studentFile = path.join(
    __dirname,
    "student.json"
);

// =====================================================
// CREATE FILES IF THEY DON'T EXIST
// =====================================================

if (!fs.existsSync(submissionsFile)) {
    fs.writeFileSync(
        submissionsFile,
        "[]",
        "utf8"
    );
}

if (!fs.existsSync(studentFile)) {
    fs.writeFileSync(
        studentFile,
        JSON.stringify(
            {
                student: {
                    id: STUDENT_ID,
                    name: "",
                    avatar: null,
                    challengeStarted: false,
                    challengeStartedAt: null
                }
            },
            null,
            2
        ),
        "utf8"
    );
}

// =====================================================
// JSON HELPERS
// =====================================================

function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(
            filePath,
            "utf8"
        );

        return JSON.parse(data);
    } catch (error) {
        console.error(
            "READ JSON ERROR:",
            error
        );

        throw error;
    }
}

function saveJsonFile(filePath, data) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(
            data,
            null,
            2
        ),
        "utf8"
    );
}

// =====================================================
// TIME HELPERS
// =====================================================

function getNow() {
    return new Date();
}

// =====================================================
// GET INDIA DATE STRING
//
// Example:
// 2026-08-09
// =====================================================

function getIndiaDateString(
    date = new Date()
) {
    return new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: TIMEZONE,
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    ).format(date);
}

// =====================================================
// GET INDIA DATE PARTS
// =====================================================

function getIndiaDateParts(
    date = new Date()
) {
    const parts =
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone: TIMEZONE,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }
        ).formatToParts(date);

    const result = {};

    parts.forEach((part) => {
        if (part.type !== "literal") {
            result[part.type] =
                Number(part.value);
        }
    });

    return result;
}

// =====================================================
// GET INDIA MIDNIGHT
//
// Returns UTC Date representing
// today's 12:00 AM IST.
// =====================================================

function getIndiaMidnight(
    date = new Date()
) {
    const parts =
        getIndiaDateParts(date);

    return new Date(
        Date.UTC(
            parts.year,
            parts.month - 1,
            parts.day,
            0,
            0,
            0
        ) -
        (5.5 * 60 * 60 * 1000)
    );
}

// =====================================================
// GET IST TIME INFO
// =====================================================

function getISTTimeInfo() {
    const now = getNow();

    const parts =
        getIndiaDateParts(now);

    const date =
        getIndiaDateString(now);

    return {
        timezone: TIMEZONE,

        date,

        year: parts.year,

        month: parts.month,

        day: parts.day,

        hour: parts.hour,

        minute: parts.minute,

        second: parts.second,

        iso:
            now.toISOString(),

        display:
            new Intl.DateTimeFormat(
                "en-IN",
                {
                    timeZone:
                        TIMEZONE,
                    dateStyle:
                        "medium",
                    timeStyle:
                        "medium"
                }
            ).format(now)
    };
}

// =====================================================
// GET DAYS BETWEEN TWO IST CALENDAR DATES
//
// This compares calendar dates, not hours.
//
// Example:
//
// Start date = 2026-08-09
// Today      = 2026-08-09
// Difference = 0
//
// Therefore Day = 1
//
// Start date = 2026-08-09
// Today      = 2026-08-10
// Difference = 1
//
// Therefore Day = 2
// =====================================================

function getCalendarDayDifference(
    startDateString,
    currentDateString
) {
    const startDate =
        new Date(
            `${startDateString}T00:00:00+05:30`
        );

    const currentDate =
        new Date(
            `${currentDateString}T00:00:00+05:30`
        );

    const differenceMs =
        currentDate.getTime() -
        startDate.getTime();

    return Math.floor(
        differenceMs /
            (24 * 60 * 60 * 1000)
    );
}

// =====================================================
// CHALLENGE TIME INFO
//
// IMPORTANT:
//
// The timer is ALWAYS:
//
// Today 12:00 AM
//        ↓
// Tomorrow 12:00 AM
//
// It does NOT depend on the time
// when the student started the challenge.
//
// The challenge start date determines
// which DAY we are currently on.
// =====================================================

function getChallengeTimeInfo(
    challengeStartedAt
) {
    const now =
        getNow();

    // -------------------------------------------------
    // TODAY'S IST DATE
    // -------------------------------------------------

    const today =
        getIndiaDateString(now);

    // -------------------------------------------------
    // TODAY MIDNIGHT
    // -------------------------------------------------

    const dayStart =
        getIndiaMidnight(now);

    // -------------------------------------------------
    // TOMORROW MIDNIGHT
    // -------------------------------------------------

    const dayEnd =
        new Date(
            dayStart.getTime() +
                24 * 60 * 60 * 1000
        );

    // -------------------------------------------------
    // REMAINING TIME
    // -------------------------------------------------

    const remainingMs =
        Math.max(
            0,
            dayEnd.getTime() -
                now.getTime()
        );

    // -------------------------------------------------
    // NOT STARTED
    // -------------------------------------------------

    if (!challengeStartedAt) {
        return {
            currentDay: 1,

            today,

            remainingMs,

            expired:
                remainingMs <= 0,

            dayStart:
                dayStart.toISOString(),

            dayEnd:
                dayEnd.toISOString(),

            timezone:
                TIMEZONE
        };
    }

    // -------------------------------------------------
    // START DATE IN INDIA
    // -------------------------------------------------

    const startDate =
        getIndiaDateString(
            new Date(
                challengeStartedAt
            )
        );

    // -------------------------------------------------
    // CALCULATE DAY
    // -------------------------------------------------

    let currentDay =
        getCalendarDayDifference(
            startDate,
            today
        ) + 1;

    // -------------------------------------------------
    // MINIMUM DAY = 1
    // -------------------------------------------------

    if (currentDay < 1) {
        currentDay = 1;
    }

    // -------------------------------------------------
    // MAXIMUM DAY = 60
    // -------------------------------------------------

    if (currentDay > TOTAL_DAYS) {
        currentDay = TOTAL_DAYS;
    }

    // -------------------------------------------------
    // RETURN
    // -------------------------------------------------

    return {
        currentDay,

        startDate,

        today,

        remainingMs,

        expired:
            remainingMs <= 0,

        dayStart:
            dayStart.toISOString(),

        dayEnd:
            dayEnd.toISOString(),

        timezone:
            TIMEZONE
    };
}

// =====================================================
// CALCULATE CHALLENGE PROGRESS
// =====================================================

function calculateChallengeProgress(
    student,
    submissions
) {
    // -------------------------------------------------
    // STUDENT SUBMISSIONS
    // -------------------------------------------------

    const studentSubmissions =
        submissions.filter(
            (submission) =>
                submission.studentId ===
                student.id
        );

    // -------------------------------------------------
    // UNIQUE COMPLETED DAYS
    // -------------------------------------------------

    const completedDays =
        [
            ...new Set(
                studentSubmissions
                    .map(
                        (submission) =>
                            Number(
                                submission.day
                            )
                    )
                    .filter(
                        (day) =>
                            Number.isInteger(
                                day
                            ) &&
                            day >= 1 &&
                            day <=
                                TOTAL_DAYS
                    )
            )
        ].sort(
            (a, b) => a - b
        );

    // =================================================
    // CHALLENGE NOT STARTED
    // =================================================

    if (
        !student.challengeStarted
    ) {
        const timeInfo =
            getChallengeTimeInfo(
                null
            );

        return {
            started: false,

            currentDay: 1,

            totalDays:
                TOTAL_DAYS,

            completedDays,

            missedDays: [],

            streak: 0,

            todayCompleted:
                false,

            challengeCompleted:
                false,

            deadline: {
                remainingMs:
                    timeInfo.remainingMs,

                expired:
                    timeInfo.expired,

                dayStart:
                    timeInfo.dayStart,

                dayEnd:
                    timeInfo.dayEnd,

                timezone:
                    TIMEZONE
            },

            time: {
                remainingMs:
                    timeInfo.remainingMs,

                expired:
                    timeInfo.expired,

                dayStart:
                    timeInfo.dayStart,

                dayEnd:
                    timeInfo.dayEnd,

                timezone:
                    TIMEZONE
            }
        };
    }

    // =================================================
    // TIME INFO
    // =================================================

    const timeInfo =
        getChallengeTimeInfo(
            student.challengeStartedAt
        );

    const currentDay =
        timeInfo.currentDay;

    // =================================================
    // TODAY COMPLETED
    // =================================================

    const todayCompleted =
        completedDays.includes(
            currentDay
        );

    // =================================================
    // MISSED DAYS
    //
    // Every previous day which was not
    // submitted is considered missed.
    // =================================================

    const missedDays = [];

    for (
        let day = 1;
        day < currentDay;
        day++
    ) {
        if (
            !completedDays.includes(
                day
            )
        ) {
            missedDays.push(day);
        }
    }

    // =================================================
    // STREAK
    // =================================================

    let streak = 0;

    if (
        completedDays.length > 0
    ) {
        let expectedDay =
            Math.max(
                ...completedDays
            );

        for (
            let i =
                completedDays.length - 1;
            i >= 0;
            i--
        ) {
            if (
                completedDays[i] ===
                expectedDay
            ) {
                streak++;

                expectedDay--;
            } else {
                break;
            }
        }
    }

    // =================================================
    // CHALLENGE COMPLETED
    // =================================================

    const challengeCompleted =
        completedDays.length >=
        TOTAL_DAYS;

    // =================================================
    // RETURN
    // =================================================

    return {
        started: true,

        currentDay,

        totalDays:
            TOTAL_DAYS,

        completedDays,

        missedDays,

        streak,

        todayCompleted,

        challengeCompleted,

        // -------------------------------------------------
        // DEADLINE
        //
        // This is what ChallengeDay.jsx reads.
        // -------------------------------------------------

        deadline: {
            remainingMs:
                timeInfo.remainingMs,

            expired:
                timeInfo.expired,

            dayStart:
                timeInfo.dayStart,

            dayEnd:
                timeInfo.dayEnd,

            timezone:
                TIMEZONE
        },

        // -------------------------------------------------
        // TIME
        // -------------------------------------------------

        time: {
            remainingMs:
                timeInfo.remainingMs,

            expired:
                timeInfo.expired,

            dayStart:
                timeInfo.dayStart,

            dayEnd:
                timeInfo.dayEnd,

            timezone:
                TIMEZONE
        }
    };
}

// =====================================================
// HOME
// =====================================================

app.get(
    "/",
    (req, res) => {
        res.json({
            success: true,

            message:
                "ABTalks Backend API is running 🚀",

            timezone:
                TIMEZONE,

            totalDays:
                TOTAL_DAYS,

            time:
                getISTTimeInfo()
        });
    }
);

// =====================================================
// SERVER TIME
// =====================================================

app.get(
    "/api/time",
    (req, res) => {
        res.json({
            success: true,

            timezone:
                TIMEZONE,

            time:
                getISTTimeInfo()
        });
    }
);

// =====================================================
// GET ALL CHALLENGES
// =====================================================

app.get(
    "/api/challenges",
    (req, res) => {
        res.json({
            success: true,

            total:
                challenges.length,

            challenges
        });
    }
);

// =====================================================
// GET CHALLENGE BY DAY
// =====================================================

app.get(
    "/api/challenges/day/:day",
    (req, res) => {
        try {
            const day =
                Number(
                    req.params.day
                );

            if (
                !Number.isInteger(day) ||
                day < 1 ||
                day > TOTAL_DAYS
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        `Day must be between 1 and ${TOTAL_DAYS}`
                });
            }

            const challenge =
                challenges.find(
                    (item) =>
                        Number(
                            item.day
                        ) === day
                );

            if (!challenge) {
                return res.status(404).json({
                    success: false,

                    message:
                        "Challenge not found"
                });
            }

            res.json({
                success: true,

                ...challenge
            });
        } catch (error) {
            console.error(
                "CHALLENGE ERROR:",
                error
            );

            res.status(500).json({
                success: false,

                message:
                    "Unable to load challenge"
            });
        }
    }
);

// =====================================================
// START CHALLENGE
// =====================================================

app.post(
    "/api/challenge/start",
    (req, res) => {
        try {
            const {
                studentId,
                name,
                avatar
            } = req.body;

            // -------------------------------------------------
            // VALIDATE STUDENT
            // -------------------------------------------------

            if (
                studentId !==
                STUDENT_ID
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Invalid student ID"
                });
            }

            // -------------------------------------------------
            // READ STUDENT
            // -------------------------------------------------

            const studentData =
                readJsonFile(
                    studentFile
                );

            const student =
                studentData.student;

            if (!student) {
                return res.status(500).json({
                    success: false,

                    message:
                        "Student not found"
                });
            }

            // -------------------------------------------------
            // PROFILE
            // -------------------------------------------------

            if (
                typeof name ===
                "string"
            ) {
                student.name =
                    name.trim();
            }

            if (
                avatar !== undefined
            ) {
                student.avatar =
                    avatar;
            }

            // -------------------------------------------------
            // START ONLY ONCE
            //
            // IMPORTANT:
            //
            // We save the starting timestamp.
            //
            // But the timer itself is based on
            // midnight-to-midnight IST.
            // -------------------------------------------------

            if (
                !student.challengeStarted
            ) {
                student.challengeStarted =
                    true;

                student.challengeStartedAt =
                    new Date().toISOString();
            }

            // -------------------------------------------------
            // SAVE
            // -------------------------------------------------

            studentData.student =
                student;

            saveJsonFile(
                studentFile,
                studentData
            );

            // -------------------------------------------------
            // PROGRESS
            // -------------------------------------------------

            const submissions =
                readJsonFile(
                    submissionsFile
                );

            const progress =
                calculateChallengeProgress(
                    student,
                    submissions
                );

            // -------------------------------------------------
            // RESPONSE
            // -------------------------------------------------

            res.json({
                success: true,

                message:
                    "Challenge started successfully 🚀",

                student,

                challenge:
                    progress,

                istTime:
                    getISTTimeInfo()
            });
        } catch (error) {
            console.error(
                "START ERROR:",
                error
            );

            res.status(500).json({
                success: false,

                message:
                    "Could not start challenge",

                error:
                    error.message
            });
        }
    }
);

// =====================================================
// GET STUDENT
// =====================================================

app.get(
    "/api/student",
    (req, res) => {
        try {
            const studentData =
                readJsonFile(
                    studentFile
                );

            const student =
                studentData.student;

            const submissions =
                readJsonFile(
                    submissionsFile
                );

            const challenge =
                calculateChallengeProgress(
                    student,
                    submissions
                );

            res.json({
                success: true,

                student: {
                    id:
                        student.id,

                    name:
                        student.name,

                    avatar:
                        student.avatar,

                    challengeStarted:
                        student.challengeStarted,

                    challengeStartedAt:
                        student.challengeStartedAt
                },

                challenge,

                istTime:
                    getISTTimeInfo()
            });
        } catch (error) {
            console.error(
                "STUDENT ERROR:",
                error
            );

            res.status(500).json({
                success: false,

                message:
                    "Could not load student data",

                error:
                    error.message
            });
        }
    }
);

// =====================================================
// CREATE / UPDATE PROFILE
// =====================================================

app.post(
    "/api/student/profile",
    (req, res) => {
        try {
            const {
                name,
                avatar
            } = req.body;

            if (
                typeof name !==
                    "string" ||
                !name.trim()
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Name is required"
                });
            }

            const studentData =
                readJsonFile(
                    studentFile
                );

            const student =
                studentData.student;

            student.name =
                name.trim();

            if (
                avatar !== undefined
            ) {
                student.avatar =
                    avatar;
            }

            studentData.student =
                student;

            saveJsonFile(
                studentFile,
                studentData
            );

            res.json({
                success: true,

                message:
                    "Profile updated successfully",

                student
            });
        } catch (error) {
            console.error(
                "PROFILE ERROR:",
                error
            );

            res.status(500).json({
                success: false,

                message:
                    "Unable to update profile"
            });
        }
    }
);

// =====================================================
// SUBMIT PROOF
// =====================================================

app.post(
    "/api/submissions",
    (req, res) => {
        try {
            const {
                studentId,
                day,
                github,
                linkedin
            } = req.body;

            // -------------------------------------------------
            // VALIDATE STUDENT
            // -------------------------------------------------

            if (
                studentId !==
                STUDENT_ID
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Invalid student ID"
                });
            }

            // -------------------------------------------------
            // VALIDATE DAY
            // -------------------------------------------------

            const dayNumber =
                Number(day);

            if (
                !Number.isInteger(
                    dayNumber
                ) ||
                dayNumber < 1 ||
                dayNumber > TOTAL_DAYS
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Invalid challenge day"
                });
            }

            // -------------------------------------------------
            // VALIDATE PROOF
            // -------------------------------------------------

            if (
                !github &&
                !linkedin
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Please submit GitHub or LinkedIn proof"
                });
            }

            // -------------------------------------------------
            // STUDENT
            // -------------------------------------------------

            const studentData =
                readJsonFile(
                    studentFile
                );

            const student =
                studentData.student;

            if (
                !student.challengeStarted
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Challenge has not been started"
                });
            }

            // -------------------------------------------------
            // READ SUBMISSIONS
            // -------------------------------------------------

            const submissions =
                readJsonFile(
                    submissionsFile
                );

            // -------------------------------------------------
            // CURRENT PROGRESS
            // -------------------------------------------------

            const progress =
                calculateChallengeProgress(
                    student,
                    submissions
                );

            const currentDay =
                progress.currentDay;

            // -------------------------------------------------
            // ONLY CURRENT DAY
            // -------------------------------------------------

            if (
                dayNumber !==
                currentDay
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        `You can only submit Day ${currentDay} right now.`
                });
            }

            // -------------------------------------------------
            // PREVENT DUPLICATE
            // -------------------------------------------------

            if (
                progress.completedDays.includes(
                    dayNumber
                )
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        `Day ${dayNumber} is already completed.`
                });
            }

            // -------------------------------------------------
            // PREVENT SUBMISSION AFTER MIDNIGHT
            // -------------------------------------------------

            if (
                progress.deadline.expired
            ) {
                return res.status(400).json({
                    success: false,

                    message:
                        "Today's challenge time has expired."
                });
            }

            // -------------------------------------------------
            // CREATE SUBMISSION
            // -------------------------------------------------

            const submission = {
                id:
                    Date.now(),

                studentId:
                    STUDENT_ID,

                day:
                    dayNumber,

                github:
                    github
                        ? github.trim()
                        : null,

                linkedin:
                    linkedin
                        ? linkedin.trim()
                        : null,

                submittedAt:
                    new Date().toISOString(),

                istDate:
                    getIndiaDateString(),

                timezone:
                    TIMEZONE
            };

            // -------------------------------------------------
            // SAVE
            // -------------------------------------------------

            submissions.push(
                submission
            );

            saveJsonFile(
                submissionsFile,
                submissions
            );

            // -------------------------------------------------
            // UPDATED PROGRESS
            // -------------------------------------------------

            const updatedProgress =
                calculateChallengeProgress(
                    student,
                    submissions
                );

            // -------------------------------------------------
            // RESPONSE
            // -------------------------------------------------

            res.status(201).json({
                success: true,

                message:
                    `Day ${dayNumber} completed successfully 🚀`,

                submission,

                challenge:
                    updatedProgress,

                istTime:
                    getISTTimeInfo()
            });
        } catch (error) {
            console.error(
                "SUBMISSION ERROR:",
                error
            );

            res.status(500).json({
                success: false,

                message:
                    "Failed to save submission",

                error:
                    error.message
            });
        }
    }
);

// =====================================================
// GET ALL SUBMISSIONS
// =====================================================

app.get(
    "/api/submissions",
    (req, res) => {
        try {
            const submissions =
                readJsonFile(
                    submissionsFile
                );

            res.json({
                success: true,

                count:
                    submissions.length,

                submissions
            });
        } catch (error) {
            console.error(
                "SUBMISSIONS ERROR:",
                error
            );

            res.status(500).json({
                success: false,

                message:
                    "Unable to read submissions"
            });
        }
    }
);

// =====================================================
// GET SUBMISSION FOR DAY
// =====================================================

app.get(
    "/api/submissions/:day",
    (req, res) => {
        try {
            const day =
                Number(
                    req.params.day
                );

            const submissions =
                readJsonFile(
                    submissionsFile
                );

            const submission =
                submissions.find(
                    (item) =>
                        item.studentId ===
                            STUDENT_ID &&
                        Number(
                            item.day
                        ) === day
                );

            res.json({
                success: true,

                submitted:
                    Boolean(
                        submission
                    ),

                submission:
                    submission ||
                    null
            });
        } catch (error) {
            console.error(
                "SUBMISSION CHECK ERROR:",
                error
            );

            res.status(500).json({
                success: false,

                message:
                    "Unable to check submission"
            });
        }
    }
);

// =====================================================
// RESET SUBMISSIONS
//
// POST /api/admin/reset-submissions
//
// This deletes all proof submissions.
//
// Student profile and challenge start
// remain unchanged.
// =====================================================

app.post(
    "/api/admin/reset-submissions",
    (req, res) => {
        try {
            saveJsonFile(
                submissionsFile,
                []
            );

            res.json({
                success: true,

                message:
                    "All submissions have been reset.",

                submissions: []
            });
        } catch (error) {
            console.error(
                "RESET ERROR:",
                error
            );

            res.status(500).json({
                success: false,

                message:
                    "Unable to reset submissions"
            });
        }
    }
);

// =====================================================
// FULL RESET
//
// POST /api/admin/full-reset
//
// Resets:
//
// - submissions
// - profile
// - challenge start
// =====================================================

app.post(
    "/api/admin/full-reset",
    (req, res) => {
        try {
            // -------------------------------------------------
            // RESET SUBMISSIONS
            // -------------------------------------------------

            saveJsonFile(
                submissionsFile,
                []
            );

            // -------------------------------------------------
            // RESET STUDENT
            // -------------------------------------------------

            const resetStudent = {
                student: {
                    id:
                        STUDENT_ID,

                    name:
                        "",

                    avatar:
                        null,

                    challengeStarted:
                        false,

                    challengeStartedAt:
                        null
                }
            };

            saveJsonFile(
                studentFile,
                resetStudent
            );

            res.json({
                success: true,

                message:
                    "Complete challenge reset successfully.",

                student:
                    resetStudent.student,

                submissions: []
            });
        } catch (error) {
            console.error(
                "FULL RESET ERROR:",
                error
            );

            res.status(500).json({
                success: false,

                message:
                    "Unable to reset challenge"
            });
        }
    }
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
    "/api/health",
    (req, res) => {
        res.json({
            success: true,

            status:
                "healthy",

            server:
                "ABTalks Backend",

            timezone:
                TIMEZONE,

            time:
                getISTTimeInfo()
        });
    }
);

// =====================================================
// 404
// =====================================================

app.use(
    (req, res) => {
        res.status(404).json({
            success: false,

            message:
                `Route not found: ${req.method} ${req.originalUrl}`
        });
    }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
    (err, req, res, next) => {
        console.error(
            "GLOBAL ERROR:",
            err
        );

        res.status(500).json({
            success: false,

            message:
                "Internal server error",

            error:
                err.message
        });
    }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(
    PORT,
    () => {
        console.log(
            "======================================"
        );

        console.log(
            "       ABTALKS BACKEND SERVER"
        );

        console.log(
            "======================================"
        );

        console.log(
            `API: http://localhost:${PORT}`
        );

        console.log(
            `Timezone: ${TIMEZONE}`
        );

        console.log(
            "Day schedule: 12:00 AM → 12:00 AM"
        );

        console.log(
            `Total days: ${TOTAL_DAYS}`
        );

        console.log(
            "======================================"
        );
    }
);