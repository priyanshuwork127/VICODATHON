const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const challenges = require("./challenges.json");

const app = express();

const PORT = 5000;

const TIMEZONE = "Asia/Kolkata";
const TOTAL_DAYS = 60;

// =====================================================
// TESTING
// =====================================================
// 24 hours = 24 * 60 * 60 * 1000
//
// For 5-minute testing use:
// const DAY_MS = 5 * 60 * 1000;
//
// IMPORTANT:
// Restart server + reset challenge after changing this.
// =====================================================

const DAY_MS =
    24 * 60 * 60 * 1000;

const STUDENT_ID =
    "student-001";

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(
    express.json()
);

// =====================================================
// FILE PATHS
// =====================================================

const submissionsFile =
    path.join(
        __dirname,
        "submissions.json"
    );

const studentFile =
    path.join(
        __dirname,
        "student.json"
    );

// =====================================================
// CREATE FILES IF THEY DON'T EXIST
// =====================================================

if (
    !fs.existsSync(
        submissionsFile
    )
) {

    fs.writeFileSync(
        submissionsFile,
        "[]",
        "utf8"
    );
}

if (
    !fs.existsSync(
        studentFile
    )
) {

    fs.writeFileSync(
        studentFile,

        JSON.stringify(
            {
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

function readJsonFile(
    filePath
) {

    try {

        const data =
            fs.readFileSync(
                filePath,
                "utf8"
            );

        return JSON.parse(
            data
        );

    } catch (error) {

        console.error(
            "READ JSON ERROR:",
            error
        );

        throw error;
    }
}

function saveJsonFile(
    filePath,
    data
) {

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
// IST TIME HELPERS
// =====================================================

function getNow() {

    return new Date();
}

// =====================================================
// GET INDIA DATE
// =====================================================

function getIndiaDateString(
    date = new Date()
) {

    return new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone:
                TIMEZONE,

            year:
                "numeric",

            month:
                "2-digit",

            day:
                "2-digit"
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
                timeZone:
                    TIMEZONE,

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hour12:
                    false
            }
        ).formatToParts(date);

    const result = {};

    parts.forEach(
        (part) => {

            if (
                part.type !==
                "literal"
            ) {

                result[
                    part.type
                ] =
                    Number(
                        part.value
                    );
            }
        }
    );

    return result;
}

// =====================================================
// IST MIDNIGHT
// =====================================================

function getIndiaMidnight(
    date = new Date()
) {

    const parts =
        getIndiaDateParts(
            date
        );

    return new Date(
        Date.UTC(
            parts.year,
            parts.month - 1,
            parts.day,
            0,
            0,
            0
        ) -
        (
            5.5 *
            60 *
            60 *
            1000
        )
    );
}

// =====================================================
// IST TIME INFO
// =====================================================

function getISTTimeInfo() {

    const now =
        getNow();

    const parts =
        getIndiaDateParts(
            now
        );

    const date =
        getIndiaDateString(
            now
        );

    return {

        timezone:
            TIMEZONE,

        date,

        hour:
            parts.hour,

        minute:
            parts.minute,

        second:
            parts.second,

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
// CHALLENGE TIME
// =====================================================
//
// Challenge progresses according to elapsed time.
//
// Day 1:
// start -> +24 hours
//
// Day 2:
// +24 -> +48 hours
//
// Day 3:
// +48 -> +72 hours
//
// etc.
//
// NOT based on midnight.
// =====================================================

function getChallengeTimeInfo(
    challengeStartedAt
) {

    // =================================================
    // NOT STARTED
    // =================================================

    if (
        !challengeStartedAt
    ) {

        return {

            currentDay:
                1,

            elapsedMs:
                0,

            remainingMs:
                DAY_MS,

            expired:
                false,

            challengeExpired:
                false,

            dayStart:
                null,

            dayEnd:
                null
        };
    }

    // =================================================
    // START DATE
    // =================================================

    const start =
        new Date(
            challengeStartedAt
        );

    const now =
        getNow();

    // =================================================
    // INVALID DATE
    // =================================================

    if (
        Number.isNaN(
            start.getTime()
        )
    ) {

        console.error(
            "Invalid challengeStartedAt:",
            challengeStartedAt
        );

        return {

            currentDay:
                1,

            elapsedMs:
                0,

            remainingMs:
                DAY_MS,

            expired:
                false,

            challengeExpired:
                false,

            dayStart:
                null,

            dayEnd:
                null
        };
    }

    // =================================================
    // ELAPSED
    // =================================================

    const elapsedMs =
        Math.max(
            0,

            now.getTime() -
            start.getTime()
        );

    // =================================================
    // RAW DAY
    // =================================================

    const rawDay =
        Math.floor(
            elapsedMs /
            DAY_MS
        ) + 1;

    // =================================================
    // CHALLENGE EXPIRED
    // =================================================

    const challengeExpired =
        rawDay >
        TOTAL_DAYS;

    // =================================================
    // CURRENT DAY
    // =================================================

    const currentDay =
        Math.min(
            rawDay,
            TOTAL_DAYS
        );

    // =================================================
    // DAY START
    // =================================================

    const dayStart =
        start.getTime() +
        (
            (currentDay - 1) *
            DAY_MS
        );

    // =================================================
    // DAY END
    // =================================================

    const dayEnd =
        dayStart +
        DAY_MS;

    // =================================================
    // REMAINING
    // =================================================

    const remainingMs =
        challengeExpired

            ? 0

            : Math.max(
                0,

                dayEnd -
                now.getTime()
            );

    // =================================================
    // RETURN
    // =================================================

    return {

        currentDay,

        elapsedMs,

        remainingMs,

        expired:
            remainingMs <= 0,

        challengeExpired,

        dayStart:
            new Date(
                dayStart
            ).toISOString(),

        dayEnd:
            new Date(
                dayEnd
            ).toISOString()
    };
}

// =====================================================
// CALCULATE CHALLENGE PROGRESS
// =====================================================

function calculateChallengeProgress(
    student,
    submissions
) {

    // =================================================
    // STUDENT SUBMISSIONS
    // =================================================

    const studentSubmissions =
        submissions.filter(
            (submission) =>
                submission.studentId ===
                student.id
        );

    // =================================================
    // UNIQUE COMPLETED DAYS
    // =================================================

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
                            day <= TOTAL_DAYS
                    )
            )
        ].sort(
            (a, b) =>
                a - b
        );

    // =================================================
    // NOT STARTED
    // =================================================

    if (
        !student.challengeStarted
    ) {

        const notStartedTime = {

            remainingMs:
                DAY_MS,

            expired:
                false,

            dayStart:
                null,

            dayEnd:
                null,

            timezone:
                TIMEZONE
        };

        return {

            started:
                false,

            currentDay:
                1,

            totalDays:
                TOTAL_DAYS,

            completedDays,

            missedDays:
                [],

            streak:
                0,

            todayCompleted:
                false,

            challengeCompleted:
                false,

            challengeExpired:
                false,

            time:
                notStartedTime,

            deadline:
                notStartedTime
        };
    }

    // =================================================
    // TIME INFORMATION
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
    // =================================================

    const missedDays =
        [];

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

            missedDays.push(
                day
            );
        }
    }

    // =================================================
    // STREAK
    // =================================================

    let streak =
        0;

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
    // TIME OBJECT
    // =================================================

    const time = {

        remainingMs:
            timeInfo.remainingMs,

        expired:
            timeInfo.expired,

        challengeExpired:
            timeInfo.challengeExpired,

        dayStart:
            timeInfo.dayStart,

        dayEnd:
            timeInfo.dayEnd,

        timezone:
            TIMEZONE
    };

    // =================================================
    // RETURN
    // =================================================

    return {

        started:
            true,

        currentDay,

        totalDays:
            TOTAL_DAYS,

        completedDays,

        missedDays,

        streak,

        todayCompleted,

        challengeCompleted,

        challengeExpired:
            timeInfo.challengeExpired,

        time,

        // Keep deadline for compatibility
        deadline:
            time
    };
}

// =====================================================
// HOME
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.json({

            success:
                true,

            message:
                "ABTalks Backend API is running 🚀",

            timezone:
                TIMEZONE,

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

            success:
                true,

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

            success:
                true,

            total:
                challenges.length,

            challenges:
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
                !Number.isInteger(
                    day
                ) ||
                day < 1 ||
                day > TOTAL_DAYS
            ) {

                return res.status(
                    400
                ).json({

                    success:
                        false,

                    message:
                        `Day must be between 1 and ${TOTAL_DAYS}`
                });
            }

            const challenge =
                challenges.find(
                    (item) =>
                        Number(
                            item.day
                        ) ===
                        day
                );

            if (
                !challenge
            ) {

                return res.status(
                    404
                ).json({

                    success:
                        false,

                    message:
                        "Challenge not found"
                });
            }

            res.json({

                success:
                    true,

                ...challenge
            });

        } catch (error) {

            console.error(
                "CHALLENGE ERROR:",
                error
            );

            res.status(
                500
            ).json({

                success:
                    false,

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

            // =================================================
            // VALIDATION
            // =================================================

            if (
                studentId !==
                STUDENT_ID
            ) {

                return res.status(
                    400
                ).json({

                    success:
                        false,

                    message:
                        "Invalid student ID"
                });
            }

            // =================================================
            // STUDENT
            // =================================================

            const studentData =
                readJsonFile(
                    studentFile
                );

            const student =
                studentData.student;

            if (
                !student
            ) {

                return res.status(
                    500
                ).json({

                    success:
                        false,

                    message:
                        "Student not found"
                });
            }

            // =================================================
            // PROFILE
            // =================================================

            if (
                typeof name ===
                "string"
            ) {

                student.name =
                    name.trim();
            }

            if (
                avatar !==
                undefined
            ) {

                student.avatar =
                    avatar;
            }

            // =================================================
            // START ONLY ONCE
            // =================================================

            if (
                !student.challengeStarted
            ) {

                student.challengeStarted =
                    true;

                student.challengeStartedAt =
                    new Date()
                        .toISOString();
            }

            studentData.student =
                student;

            saveJsonFile(
                studentFile,
                studentData
            );

            // =================================================
            // PROGRESS
            // =================================================

            const submissions =
                readJsonFile(
                    submissionsFile
                );

            const progress =
                calculateChallengeProgress(
                    student,
                    submissions
                );

            res.json({

                success:
                    true,

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

            res.status(
                500
            ).json({

                success:
                    false,

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

                success:
                    true,

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

            res.status(
                500
            ).json({

                success:
                    false,

                message:
                    "Could not load student data",

                error:
                    error.message
            });
        }
    }
);

// =====================================================
// UPDATE PROFILE
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

                return res.status(
                    400
                ).json({

                    success:
                        false,

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
                avatar !==
                undefined
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

                success:
                    true,

                message:
                    "Profile updated successfully",

                student
            });

        } catch (error) {

            console.error(
                "PROFILE ERROR:",
                error
            );

            res.status(
                500
            ).json({

                success:
                    false,

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

            // =================================================
            // VALIDATION
            // =================================================

            if (
                studentId !==
                STUDENT_ID
            ) {

                return res.status(
                    400
                ).json({

                    success:
                        false,

                    message:
                        "Invalid student ID"
                });
            }

            const dayNumber =
                Number(day);

            if (
                !Number.isInteger(
                    dayNumber
                ) ||
                dayNumber < 1 ||
                dayNumber > TOTAL_DAYS
            ) {

                return res.status(
                    400
                ).json({

                    success:
                        false,

                    message:
                        "Invalid challenge day"
                });
            }

            if (
                !github &&
                !linkedin
            ) {

                return res.status(
                    400
                ).json({

                    success:
                        false,

                    message:
                        "Please submit GitHub or LinkedIn proof"
                });
            }

            // =================================================
            // STUDENT
            // =================================================

            const studentData =
                readJsonFile(
                    studentFile
                );

            const student =
                studentData.student;

            if (
                !student.challengeStarted
            ) {

                return res.status(
                    400
                ).json({

                    success:
                        false,

                    message:
                        "Challenge has not been started"
                });
            }

            // =================================================
            // CURRENT SERVER DAY
            // =================================================

            const submissions =
                readJsonFile(
                    submissionsFile
                );

            const progress =
                calculateChallengeProgress(
                    student,
                    submissions
                );

            const currentDay =
                progress.currentDay;

            // =================================================
            // CHALLENGE FINISHED
            // =================================================

            if (
                progress.challengeExpired
            ) {

                return res.status(
                    400
                ).json({

                    success:
                        false,

                    message:
                        "The 60 Day Challenge has ended."
                });
            }

            // =================================================
            // ONLY CURRENT DAY
            // =================================================

            if (
                dayNumber !==
                currentDay
            ) {

                return res.status(
                    400
                ).json({

                    success:
                        false,

                    message:
                        `You can only submit Day ${currentDay} right now.`
                });
            }

            // =================================================
            // PREVENT DUPLICATE
            // =================================================

            if (
                progress.completedDays.includes(
                    dayNumber
                )
            ) {

                return res.status(
                    400
                ).json({

                    success:
                        false,

                    message:
                        `Day ${dayNumber} is already completed.`
                });
            }

            // =================================================
            // CHECK TIMER
            // =================================================

            if (
                progress.time.expired
            ) {

                return res.status(
                    400
                ).json({

                    success:
                        false,

                    message:
                        "Today's time window has expired."
                });
            }

            // =================================================
            // SAVE SUBMISSION
            // =================================================

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
                    new Date()
                        .toISOString(),

                istDate:
                    getIndiaDateString(),

                timezone:
                    TIMEZONE
            };

            submissions.push(
                submission
            );

            saveJsonFile(
                submissionsFile,
                submissions
            );

            // =================================================
            // UPDATED PROGRESS
            // =================================================

            const updatedProgress =
                calculateChallengeProgress(
                    student,
                    submissions
                );

            res.status(
                201
            ).json({

                success:
                    true,

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

            res.status(
                500
            ).json({

                success:
                    false,

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

                success:
                    true,

                count:
                    submissions.length,

                submissions
            });

        } catch (error) {

            res.status(
                500
            ).json({

                success:
                    false,

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
                        ) ===
                        day
                );

            res.json({

                success:
                    true,

                submitted:
                    Boolean(
                        submission
                    ),

                submission:
                    submission ||
                    null
            });

        } catch (error) {

            res.status(
                500
            ).json({

                success:
                    false,

                message:
                    "Unable to check submission"
            });
        }
    }
);

// =====================================================
// RESET SUBMISSIONS
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

                success:
                    true,

                message:
                    "All submissions have been reset.",

                submissions:
                    []
            });

        } catch (error) {

            console.error(
                "RESET ERROR:",
                error
            );

            res.status(
                500
            ).json({

                success:
                    false,

                message:
                    "Unable to reset submissions"
            });
        }
    }
);

// =====================================================
// FULL RESET
// =====================================================

app.post(
    "/api/admin/full-reset",
    (req, res) => {

        try {

            // =================================================
            // RESET SUBMISSIONS
            // =================================================

            saveJsonFile(
                submissionsFile,
                []
            );

            // =================================================
            // RESET STUDENT
            // =================================================

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

                success:
                    true,

                message:
                    "Complete challenge reset successfully.",

                student:
                    resetStudent.student,

                submissions:
                    []
            });

        } catch (error) {

            console.error(
                "FULL RESET ERROR:",
                error
            );

            res.status(
                500
            ).json({

                success:
                    false,

                message:
                    "Unable to reset challenge"
            });
        }
    }
);

// =====================================================
// 404
// =====================================================

app.use(
    (req, res) => {

        res.status(
            404
        ).json({

            success:
                false,

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

        res.status(
            500
        ).json({

            success:
                false,

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
            `Challenge duration: ${DAY_MS / 1000 / 60 / 60} hours per day`
        );

        console.log(
            `Total days: ${TOTAL_DAYS}`
        );

        console.log(
            "======================================"
        );
    }
);