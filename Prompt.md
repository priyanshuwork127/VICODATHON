# AI Usage Log - ViCodathon 2026

## Project: ABTalks

## Date: 7 August 2026

## TOOLS USING: ChatGPT, Figma AI, Claude

---

## 1. Project Planning

**Prompt Used:**
Help me plan my hackathon project ABTalks and decide the MVP features and required pages.

**AI Assistance:**
AI helped in defining the project scope, MVP features, and development roadmap.

**Usage:**
Planning the project structure and features.

---

## 2. UI/UX Design Planning

**Prompt Used:**
Suggest a landing page layout for a modern coding challenge platform that motivates students to join a 60 Days Coding Challenge.

**AI Assistance:**
AI suggested a motivational landing page with:
- Navbar
- Hero section
- Challenge information
- Progress indicators
- Coding platform integration
- Motivational content
- Call-to-action

**Usage:**
Planning the landing page design.

---

## 3. Mobile-First Design

**Prompt Used:**
The layout should be designed like a 390px mobile view with a dark theme.

**AI Assistance:**
AI suggested a mobile-first dark coding-themed layout optimized for a 390px screen.

**Usage:**
Defining the primary responsive design.

---

## 4. Figma/UI Design

**Prompt Used:**
Analyze my Figma design and help me convert the design into a React website.

**AI Assistance:**
AI provided suggestions for converting the visual design into reusable React components and CSS.

**Usage:**
Translating the Figma design into the frontend implementation.

---

## 5. React Folder Structure

**Prompt Used:**
Suggest a React folder structure for building the ABTalks frontend.

**AI Assistance:**
AI suggested separating reusable components and pages, including:
- `components`
- `pages`
- `assets`
- `data`

**Usage:**
Organizing the React project.

---

## 6. Navbar Development

**Prompt Used:**
Create the navbar for the ABTalks 60 Days Coding Challenge website.

**AI Assistance:**
AI provided React and CSS code for the navbar with navigation items and mobile navigation.

**Usage:**
Implementing the website navbar.

---

## 7. Navbar Modification

**Prompt Used:**
Make the navigation work when the user clicks the navbar items.

**AI Assistance:**
AI helped connect the navigation items to the appropriate sections/pages and fix navigation issues.

**Usage:**
Making the navbar functional.

---

## 8. Mobile Dropdown Navigation

**Prompt Used:**
The navigation menu is not dropping down on mobile. Fix the dropdown.

**AI Assistance:**
AI suggested using React state to control the mobile menu and CSS to show and hide the navigation links.

**Usage:**
Implementing the responsive mobile navbar.

---

## 9. Global CSS

**Prompt Used:**
Don't create a separate navbar CSS file. I will use App.css for the styling.

**AI Assistance:**
AI adapted the CSS implementation to use the existing `App.css` file.

**Usage:**
Keeping the styling centralized.

---

## 10. Landing Page Concept

**Prompt Used:**
The landing page should motivate students to join the 60 Days Coding Challenge. It is not for selling anything.

**AI Assistance:**
AI changed the design direction from a commercial landing page to a motivational student-focused challenge platform.

**Usage:**
Defining the purpose and tone of the landing page.

---

## 11. Hero Section Development

**Prompt Used:**
Create a Hero section for the ABTalks 60 Days Coding Challenge that motivates students to start coding every day.

**AI Assistance:**
AI provided the structure and React implementation for the Hero section with motivational messaging and call-to-action buttons.

**Usage:**
Developing the main landing page Hero section.

---

## 12. Landing Page Integration

**Prompt Used:**
I have completed the Hero and Navbar components. How can I call them using the Landing page?

**AI Assistance:**
AI explained how to import and render the `Navbar` and `Hero` components inside `Landing.jsx`.

**Usage:**
Connecting the reusable components to the Landing page.

---

## 13. React Import Error Fix

**Prompt Used:**
Vite shows `Failed to resolve import "./pages/LandingPage"`.

**AI Assistance:**
AI analyzed the file structure and identified that the actual file was named `Landing.jsx`, so the correct import was:

`./pages/Landing`

**Usage:**
Fixing the Vite import error and successfully running the Landing page.

---

## 14. Final Landing Page

**Prompt Used:**
Make the ABTalks landing page look modern, dark, mobile-first, and motivating for students joining the 60 Days Coding Challenge.

**AI Assistance:**
AI helped refine the landing page structure, responsive layout, navigation, Hero section, typography, dark theme, and motivational messaging.

**Usage:**
Completing the initial ABTalks Landing page.

---

 # AI Usage Log - ViCodathon 2026

## **Project: ABTalks**

**Date:** 8 August 2026

**TOOLS USING:** ChatGPT, Figma AI, Claude

---

## **15. Challenge Page Planning**

### **Prompt Used**

> **Start working on the Challenge page for the ABTalks 60 Days Coding Challenge.**

### **AI Assistance**

AI helped define the Challenge Day screen and suggested sections for:

- Daily coding task
- Day number
- Difficulty
- Today's goal
- Proof of work
- Progress

### **Usage**

**Planning the Challenge Day experience.**

---

## **16. Three-Screen MVP Planning**

### **Prompt Used**

> **Design and build the following three screens for ABTalks: Landing Page, Student Dashboard, and Challenge Day.**

### **AI Assistance**

AI helped structure the MVP around:

- **Landing Page**
- **Student Dashboard**
- **Challenge Day**
- **Current streak**
- **Today's task**
- **Challenge progress**
- **Overall completion**
- **Student achievements**
- **Proof of work submission**

### **Usage**

**Defining the minimum viable product for the hackathon.**

---

## **17. Student Dashboard Development**

### **Prompt Used**

> **Create a Student Dashboard for the ABTalks 60 Days Coding Challenge.**

### **AI Assistance**

AI provided a dashboard structure containing:

- **Current streak**
- **Today's challenge**
- **Progress through the challenge**
- **Overall completion**
- **Achievements**
- **Motivational content**
- **Navigation to the daily challenge**

### **Usage**

**Developing the Student Dashboard.**

---

## **18. Challenge Day Development**

### **Prompt Used**

> **Create a Challenge Day page where a student can read the day's coding task and submit proof of work.**

### **AI Assistance**

AI provided the structure for:

- **Day number**
- **Coding task**
- **Difficulty level**
- **Today's goal**
- **GitHub repository/commit**
- **LinkedIn post**
- **Submission status**
- **Completion message**

### **Usage**

**Developing the daily challenge screen.**

---

## **19. Proof of Work Submission**

### **Prompt Used**

> **Allow students to submit their GitHub repository or commit and LinkedIn post as proof of completing the challenge.**

### **AI Assistance**

AI added input fields and submission handling for GitHub and LinkedIn URLs and created a completion state after submission.

### **Usage**

**Implementing proof-of-work functionality.**

---

## **20. React Router Issue**

### **Prompt Used**

> **I am not using React Router. Help me navigate between the Landing Page, Dashboard, and Challenge Day pages.**

### **AI Assistance**

AI suggested using simple browser history and path-based navigation instead of React Router.

### **Usage**

**Connecting the MVP screens without React Router.**

---

## **21. React Export Error Fix**

### **Prompt Used**

> **The requested module does not provide an export named `default`. Help me fix the React page/component.**

### **AI Assistance**

AI explained the difference between default and named exports and standardized the page and component files to use default exports.

### **Usage**

**Fixing React import and export errors.**

---

## **22. Dashboard Integration**

### **Prompt Used**

> **Connect the Dashboard page with the existing ABTalks application.**

### **AI Assistance**

AI helped import the Dashboard component into `App.jsx` and connect it with the navigation flow.

### **Usage**

**Integrating the Student Dashboard into the application.**

---

## **23. Challenge Day Navigation**

### **Prompt Used**

> **Make the Dashboard button open the Challenge Day page for Day 12.**

### **AI Assistance**

AI connected the Dashboard challenge button to the Challenge Day screen using the existing navigation approach.

### **Usage**

**Creating the Dashboard → Challenge Day user flow.**

---

## **24. Single App.css Styling**

### **Prompt Used**

> **I don't want separate CSS files. Use one `App.css` file for the complete project.**

### **AI Assistance**

AI created global styles for:

- **Navbar**
- **Landing Page**
- **Dashboard**
- **Challenge Day**
- **Cards**
- **Buttons**
- **Progress bars**
- **Forms**
- **Responsive layouts**

### **Usage**

**Keeping the project's styling centralized in one CSS file.**

---

## **25. CSS Debugging**

### **Prompt Used**

> **All pages are working but only the HTML is showing and the CSS is not showing.**

### **AI Assistance**

AI checked the CSS import and provided a complete global `App.css` for the application.

### **Usage**

**Fixing the styling issue and applying the ABTalks visual design.**

---

## **26. Dark Theme Refinement**

### **Prompt Used**

> **Make the complete project dark and modern while keeping the design focused on motivating students.**

### **AI Assistance**

AI refined the interface using:

- **Dark backgrounds**
- **Purple highlights**
- **Yellow accents**
- **White typography**
- **Muted text**
- **Dark cards**

### **Usage**

**Improving the visual identity of ABTalks.**

---

## **27. 390px Mobile Layout**

### **Prompt Used**

> **Make the complete ABTalks project look like a 390px mobile view.**

### **AI Assistance**

AI adapted the Landing Page, Dashboard, and Challenge Day screens to a mobile-first **390px layout**.

### **Usage**

**Creating the primary mobile experience for the project.**

---

## **28. Frontend MVP Integration**

### **Prompt Used**

> **Connect the Landing Page, Student Dashboard, and Challenge Day into one working application.**

### **AI Assistance**

AI helped create the basic flow:

**Landing Page → Dashboard → Challenge Day → Submit Proof → Dashboard**

### **Usage**

**Integrating the three required MVP screens.**

---

## **29. Dynamic Challenge Planning**

### **Prompt Used**

> **I need different coding questions for different challenge days. How should I generate and manage the questions?**

### **AI Assistance**

AI suggested moving from static challenge content toward dynamic challenge data and an API-based question generation system.

### **Usage**

**Planning dynamic daily challenges for the 60-day program.**

---

## **30. Next Development Phase**

### **Prompt Used**

> **What should I implement after completing the three screens?**

### **AI Assistance**

AI suggested focusing on:

- **Dynamic daily questions**
- **Question generation API**
- **Different questions for different days**
- **Student progress tracking**
- **Proof-of-work storage**
- **Streak calculation**
- **Challenge completion tracking**

### **Usage**

**Planning the next development phase of ABTalks after completing the initial frontend MVP.**
