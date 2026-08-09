# PROMPTS.md

# ABTalks — 60 Day Coding Challenge

This file documents the AI-assisted prompts and development iterations used while building the ABTalks 60 Day Coding Challenge project.

The project was developed through an iterative process of building, testing, identifying bugs, and improving the frontend and backend.

---

## 1. Backend Development

### Initial Backend

> provide the complete file for challenge day

The backend was developed around a Node.js and Express API with challenge data stored in `challenges.json`.

---

## 2. Challenge Day Frontend

### ChallengeDay Component

> provide the complete file for challenge day

A React `ChallengeDay` component was created to:

* Load the current challenge
* Display the challenge information
* Display the current day
* Show the countdown
* Submit proof of work
* Submit GitHub and LinkedIn links
* Navigate between challenge days
* Display completion status

---

## 3. Debugging Challenge Navigation

### Problem

> it working but when i submit proof for the day 1 it switches to day 2 when i submit the proof of day 2 it switch to day 3 in same day

The day progression logic was identified as a problem.

The requirement was changed so that completing a challenge should **not immediately move the user into the next 24-hour challenge period**.

The challenge should advance according to time.

---

## 4. Backend Time-Based Progression

### 24-Hour Challenge

> i want to make it chnage after 24 hours

The challenge progression was changed from submission-based progression to **time-based progression**.

The intended behavior became:

```text
Day 1
↓
24 hours
↓
Day 2
↓
24 hours
↓
Day 3
↓
...
↓
Day 60
```

The backend stores the challenge start timestamp and calculates the current day from elapsed time.

---

## 5. Testing Time Progression

### Faster Testing

> i think that i should make it for 5 minutes first by which i can view is it change after 24 hours or not

For testing, the 24-hour period was temporarily considered as a shorter interval so the day-transition logic could be verified without waiting an entire day.

The goal was to verify that:

* The timer counts down.
* The current day changes after the interval.
* Refreshing the application does not reset the timer.
* The backend remains the source of truth.

---

## 6. ChallengeDay Debugging

### Complete Challenge Page

> to provide the full server.js and as well as challenge.jsx

The frontend and backend were integrated so that the ChallengeDay page receives the current challenge and timing information from the server.

The frontend was designed to use server-provided timing rather than relying entirely on browser state.

---

## 7. Streak Debugging

### Streak Problem

> streaks are not updating

The streak calculation was debugged and updated so that completed challenge days are used to calculate consecutive progress.

The backend calculates information including:

* Completed days
* Current streak
* Missed days
* Current challenge day
* Challenge completion

---

## 8. Server Features

### Backend Requirements

> now provide the server.js based on time,submissions.json reset to empty when click a button,a profile create,streak updation,a clock running

The backend was expanded to support:

* Time-based challenge progression
* Submission storage
* Submission reset
* Student profile creation
* Streak calculation
* Running challenge countdown
* Challenge progress
* Student data
* Challenge start time

---

## 9. IST Timezone

### Indian Standard Time

> time should based on ist

The challenge timing was configured around:

```text
Asia/Kolkata
```

The backend exposes IST-related information and uses the challenge start timestamp to calculate the 24-hour challenge window.

---

## 10. Complete Server

### Backend Integration

> provide server.js

A complete Express backend was developed containing routes for:

```text
GET  /
GET  /api/time
GET  /api/challenges
GET  /api/challenges/day/:day
POST /api/challenge/start
GET  /api/student
POST /api/student/profile
POST /api/submissions
GET  /api/submissions
GET  /api/submissions/:day
POST /api/admin/reset-submissions
POST /api/admin/full-reset
```

---

## 11. Testing After Closing the Application

### Persistence Test

> ok now we are testing the project by closing everything

The application was tested by closing the frontend/backend and reopening the project.

The purpose was to verify that the challenge timer and progress were persisted rather than being reset when the application was closed.

---

## 12. Countdown Problem

### Timer Debugging

> i saw time remaining 00:00:00

The countdown implementation was investigated because the frontend was receiving or displaying a zero remaining time.

The backend timing logic was reviewed so that the remaining time is calculated from:

```text
challengeStartedAt
+
24 hours
-
current server time
```

rather than depending on a timer stored only in the frontend.

---

## 13. Dashboard Development

### Dashboard

> give proper dashboard.jsx

A React dashboard was developed to display:

* Student profile
* Current streak
* Current challenge day
* Challenge progress
* Completed days
* Missed days
* Achievements
* Current challenge
* Progress percentage
* Navigation to the current challenge

---

## 14. Challenge Start Problem

### Start Day 1 Error

> when i click start 1 it show challenge not available you have not started the 60 day challenge yet

The frontend/backend challenge-start flow was debugged.

The intended flow became:

```text
Start Challenge
      ↓
POST /api/challenge/start
      ↓
challengeStarted = true
      ↓
challengeStartedAt is saved
      ↓
Dashboard loads updated state
      ↓
Day 1 becomes available
```

---

## 15. Dashboard and Backend Integration

The dashboard was connected to:

```text
/api/student
```

The dashboard uses the server response to determine:

* Whether the challenge has started
* Current day
* Completed days
* Streak
* Progress
* Missed days
* Total challenge days

---

## 16. Proof of Work

The challenge system supports proof submission using:

```text
GitHub repository / commit
LinkedIn post
```

A submission contains information such as:

```text
studentId
day
github
linkedin
submittedAt
IST date
timezone
```

The backend prevents duplicate submissions for the same challenge day.

---

## 17. Submission Rules

The backend was designed so that users cannot submit:

* A future challenge day
* A challenge day that has already been completed
* A submission without GitHub or LinkedIn proof
* A submission before the challenge has started

---

## 18. Reset Testing

### Submission Reset

The backend includes a reset mechanism for testing:

```text
POST /api/admin/reset-submissions
```

This clears:

```text
submissions.json
```

while keeping the student profile and challenge start time.

---

## 19. Full Reset Testing

A complete reset mechanism was also added:

```text
POST /api/admin/full-reset
```

This resets:

* Submissions
* Student name
* Avatar
* Challenge started state
* Challenge start timestamp

This makes it possible to test the complete challenge flow again from Day 1.

---

## 20. Final Challenge Logic

The final intended challenge behavior is:

```text
User starts challenge
        ↓
Server stores challengeStartedAt
        ↓
Day 1 starts
        ↓
24-hour countdown
        ↓
Day 2 automatically becomes current
        ↓
24-hour countdown
        ↓
Day 3
        ↓
...
        ↓
Day 60
```

Submitting proof does **not** immediately advance the challenge.

The challenge day is determined by elapsed time.

---

## 21. Data Persistence

The project uses JSON files for simple persistent storage during development:

```text
student.json
submissions.json
challenges.json
```

The server reads and writes these files to maintain the challenge state.

---

## 22. Final Testing Goals

The project was tested around the following scenarios:

### Start

```text
Start Challenge
→ Day 1
→ Countdown begins
```

### Submit

```text
Submit Day 1 proof
→ Day 1 becomes completed
→ Streak updates
→ Day remains Day 1 until its time expires
```

### Time Expiration

```text
24 hours complete
→ Day 2 becomes available
```

### Refresh

```text
Refresh browser
→ Same challenge day
→ Correct remaining time
```

### Close and Reopen

```text
Close application
→ Reopen application
→ Server recalculates remaining time
```

### Reset

```text
Reset submissions
→ submissions.json becomes []
```

---

# Development Approach

The project was built iteratively using AI assistance.

The workflow was:

```text
Idea
 ↓
Frontend
 ↓
Backend
 ↓
API Integration
 ↓
Testing
 ↓
Bug Detection
 ↓
Debugging
 ↓
Time-Based Logic
 ↓
Streak System
 ↓
Persistence
 ↓
Reset System
 ↓
Final Testing
 ↓
Deployment
```

AI was used as a development assistant for code generation, debugging, architecture changes, testing strategies, and implementation guidance.

---

# Main Technologies

* React
* JavaScript
* Node.js
* Express.js
* REST APIs
* JSON file persistence
* HTML
* CSS
* Git/GitHub

---

# Main Features

* 60-day coding challenge
* Time-based challenge progression
* 24-hour challenge windows
* IST-based timing
* Live countdown
* Student profile
* GitHub proof submission
* LinkedIn proof submission
* Streak tracking
* Missed-day tracking
* Progress tracking
* Achievements
* Day navigation
* Duplicate submission prevention
* Future-day protection
* Submission reset
* Full challenge reset
* Persistent challenge start time
* Frontend/backend API integration
* Deployment

---


