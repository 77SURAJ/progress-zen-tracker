# Daily Progress Tracker - Hosting Instructions

## Overview
This is a responsive, interactive Daily Progress Tracker built with React, TypeScript, Tailwind CSS, and Vite. It features 8 main tracking sections with animations and a weekly summary with charts.

## Quick Deploy Options

### Option 1: Netlify (Recommended)
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Your app will be live instantly with a custom URL

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Build the project: `npm run build`
3. Deploy: `vercel --prod`
4. Follow the prompts to deploy

### Option 3: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Add homepage to package.json: `"homepage": "https://yourusername.github.io/daily-progress-tracker"`
4. Run: `npm run deploy`

## Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:8080

## Features Included
- ✅ Morning Routine tracking (3 AM wake-up, salad status)
- ✅ AI-powered calorie calculator for breakfast, snacks, and dinner
- ✅ 3 × 80-minute study session trackers with start/stop timers
- ✅ Class attendance checklist
- ✅ Snack tracking with junk food detection
- ✅ Exercise completion with animated feedback
- ✅ Sleep time tracking with duration calculation
- ✅ Weekly summary with interactive charts
- ✅ Responsive design with smooth animations
- ✅ Local storage for data persistence
- ✅ Dark theme with gradient accents

## Technology Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Icons**: Lucide React

## Customization
- Colors and gradients are defined in `src/index.css`
- Animation timing can be adjusted in `tailwind.config.ts`
- Add more food items to the calorie database in `CalorieCalculator.tsx`
- Modify class list in `Classes.tsx`
- Adjust session durations in `StudySessions.tsx`

## Notes
- Data is saved locally in browser storage
- Charts show mock data - can be connected to real analytics
- AI calorie calculation is simulated (can be replaced with real API)
- Fully responsive and works on mobile devices