import axios from "axios";

const API_URL = "https://todo-backend-5t1x.onrender.com/api/task";
const USER_ID = "2313841";
const SHARED_DEFAULT_TASKS_KEY = "shared_default_tasks";

const DEFAULT_TASKS = [
  { text: "LeetCode", done: false },
  { text: "GitHub Contribution", done: false },
  { text: "Workout", done: false },
];

export const apiClient = {
  async fetchTasks(dateKey) {
    try {
      const res = await fetch(`${API_URL}/${USER_ID}/${dateKey}`);
      const data = await res.json();

      // Fetch shared default tasks
      const sharedDefaults = await apiClient_extended.fetchSharedDefaultTasks();
      let tasks = data?.tasks?.length ? data.tasks : [];

      // Merge shared default tasks with date-specific tasks
      const mergedTasks = [
        ...sharedDefaults,
        ...tasks.filter(
          (t) => !sharedDefaults.some((sd) => sd.text === t.text)
        ),
      ];

      if (!mergedTasks.length) {
        await this.initializeTasks(dateKey);
        return [...sharedDefaults];
      }

      return mergedTasks;
    } catch (err) {
      console.error("Error fetching tasks:", err);
      return DEFAULT_TASKS;
    }
  },

  async initializeTasks(dateKey) {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          date: dateKey,
          tasks: [...DEFAULT_TASKS],
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

export const getSharedDefaultTasksKey = () => SHARED_DEFAULT_TASKS_KEY;

export const apiClient_extended = {
  async fetchSharedDefaultTasks() {
    try {
      const res = await fetch(
        `${API_URL}/${USER_ID}/${SHARED_DEFAULT_TASKS_KEY}`
      );
      const data = await res.json();
      if (!data?.tasks?.length) {
        return [...DEFAULT_TASKS];
      }
      return data.tasks;
    } catch (err) {
      console.error("Error fetching shared default tasks:", err);
      return DEFAULT_TASKS;
    }
  },

  async saveSharedDefaultTasks(tasks) {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          date: SHARED_DEFAULT_TASKS_KEY,
          tasks,
        }),
      });
    } catch (err) {
      console.error("Error saving shared default tasks:", err);
    }
  },
};
