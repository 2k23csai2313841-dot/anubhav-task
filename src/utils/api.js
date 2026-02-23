import axios from "axios";

const API_URL = "https://todo-backend-5t1x.onrender.com/api/task";
const USER_ID = "2313841";

const DEFAULT_TASKS = [
  { text: "LeetCode", done: false },
  { text: "Workout", done: false },
];

export const apiClient = {
  async fetchTasks(dateKey) {
    try {
      const res = await fetch(`${API_URL}/${USER_ID}/${dateKey}`);
      const data = await res.json();

      if (!data?.tasks?.length) {
        await this.initializeTasks(dateKey);
        return DEFAULT_TASKS.map((text) => ({ text, done: false }));
      }

      return data.tasks;
    } catch (err) {
      console.error("Error fetching tasks:", err);
      return DEFAULT_TASKS.map((text) => ({ text, done: false }));
    }
  },

  async initializeTasks(dateKey) {
    try {
      const tasksWithDone = DEFAULT_TASKS.map((text) => ({
        text,
        done: false,
      }));
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          date: dateKey,
          tasks: tasksWithDone,
        }),
      });
    } catch (err) {
      console.error("Error initializing tasks:", err);
    }
  },

  async saveTasks(dateKey, tasks) {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, date: dateKey, tasks }),
      });
    } catch (err) {
      console.error("Error saving tasks:", err);
    }
  },
};

export const getDateKey = (day, month, year) => `${day}-${month}-${year}`;

export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

