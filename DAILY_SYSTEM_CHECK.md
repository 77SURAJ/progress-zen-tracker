# Daily Progress System Check

## 🔍 Daily Input & Database Verification Prompt

Please verify the following aspects of your daily progress tracking system:

---

### ✅ **Daily Input Collection**
**Question**: Is the website accepting new user input every day?

**What to check**:
- [ ] Can you submit morning routine data (wake up time, salad)?
- [ ] Can you log meals (breakfast, snack, dinner) with calorie calculation?
- [ ] Can you track study sessions (3 slots with start/stop functionality)?
- [ ] Can you mark classes as attended?
- [ ] Can you log exercise completion?
- [ ] Can you set sleep times (bedtime/wake time)?

**Expected behavior**: All dashboard modules should accept new input daily without errors.

---

### ✅ **Database Updates**
**Question**: Is the database updating with each daily entry?

**What to check**:
- [ ] Check `daily_progress` table for today's date entry
- [ ] Verify `meal_logs` table has today's meal entries
- [ ] Confirm `study_logs` table shows today's study sessions
- [ ] Check if points are being calculated and stored
- [ ] Verify user_id is correctly associated with all entries

**Expected behavior**: Each submission should create/update database records immediately.

---

### ✅ **Daily Reset Mechanism**
**Question**: What time does the system reset for fresh daily input?

**Current system behavior**:
- **Reset Time**: **Midnight (00:00)** based on user's local timezone
- **Reset Scope**: New `daily_progress` entry created automatically
- **Data Persistence**: Previous day's data remains stored
- **Fresh State**: All dashboard modules reset to empty/default state

**What to verify**:
- [ ] After midnight, dashboard shows fresh input forms
- [ ] Previous day's data is still accessible in weekly view
- [ ] New entries create new database records (not overwrite)

---

### ✅ **Data Storage Verification**
**Question**: Is the system storing ALL user data properly?

**Storage checklist**:
- [ ] **User Authentication**: User sessions persist across visits
- [ ] **Daily Progress**: All daily metrics stored in `daily_progress` table
- [ ] **Meal Logs**: Individual food items stored in `meal_logs` table
- [ ] **Study Sessions**: Session timing stored in `study_logs` table
- [ ] **Points System**: Daily points calculated and stored
- [ ] **Weekly Aggregation**: Data properly aggregated for weekly graphs
- [ ] **Data Isolation**: Users only see their own data (RLS working)

---

### 🚨 **Troubleshooting Questions**

If something isn't working:

1. **Data not saving?**
   - Check browser console for JavaScript errors
   - Verify internet connection
   - Confirm user is authenticated

2. **Daily reset not working?**
   - Check if browser timezone is set correctly
   - Verify date calculation logic
   - Test around midnight transition

3. **Missing data in weekly view?**
   - Check if `useWeeklyProgress` hook is fetching correctly
   - Verify database queries include all required tables
   - Confirm date range calculations

4. **Points not calculating?**
   - Verify `compute-daily-progress` edge function is working
   - Check if `points_config` table has proper values
   - Confirm all activity data is being passed to calculation

---

### 📊 **Expected Daily Flow**

1. **User visits dashboard** → Fresh daily entry form appears
2. **User submits activities** → Data saved to Supabase immediately  
3. **Points calculated** → `compute-daily-progress` function runs
4. **Daily graph updates** → Real-time reflection of current day
5. **Weekly graph updates** → Includes today's data in weekly view
6. **At midnight** → System creates new daily entry, cycle repeats

---

### ✅ **Success Indicators**

Your system is working correctly if:
- ✅ New data can be entered daily without conflicts
- ✅ Database shows incremental daily records
- ✅ Weekly graphs include all historical data
- ✅ Points system reflects actual user activities
- ✅ Data persists across browser sessions
- ✅ Users only see their own progress data