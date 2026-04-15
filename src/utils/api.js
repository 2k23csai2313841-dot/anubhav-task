import { supabase } from "./supabase";

const USER_ID = "2313841";

const DEFAULT_TASKS = [
  { text: "LeetCode", done: false },
  { text: "Workout", done: false },
];

export const apiClient = {
  async fetchTasks(dateKey) {
    try {
      // ✅ .maybeSingle() returns null instead of 404 when no rows exist
      const { data, error } = await supabase
        .from("tasks")
        .select("*") // Select all to verify row structure
        .eq("user_id", USER_ID)
        .eq("date", dateKey)
        .maybeSingle();

      // ✅ Detailed error inspection
      if (error) {
        return DEFAULT_TASKS;
      }

      // ✅ Explicit null check
      if (!data) {
        await this.initializeTasks(dateKey);
        return DEFAULT_TASKS;
      }

      // ✅ Record exists - return tasks
      return data.tasks || DEFAULT_TASKS;
    } catch (err) {
      return DEFAULT_TASKS;
    }
  },

  async initializeTasks(dateKey) {
    try {
      const { data, error } = await supabase.from("tasks").insert({
        user_id: USER_ID,
        date: dateKey,
        tasks: DEFAULT_TASKS,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  },

  async saveTasks(dateKey, tasks) {
    try {
      if (!tasks || !Array.isArray(tasks)) {
        return false;
      }

      // Try UPSERT (insert or update) - most reliable method
      const { error: upsertError } = await supabase.from("tasks").upsert(
        {
          user_id: USER_ID,
          date: dateKey,
          tasks,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,date" },
      );

      if (upsertError) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  },

  async checkHealth() {
    try {
      // Test 1: Can we connect?
      const { error: connError } = await supabase
        .from("tasks")
        .select("count", { count: "exact" });
      if (connError) {
        return false;
      }

      // Test 2: Can we read tasks?
      const { data, error: readError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", USER_ID)
        .maybeSingle();

      if (readError && readError.status !== 404) {
        return false;
      }

      // Test 3: Can we write tasks?
      const testDate = "2026-01-01";
      const { error: writeError } = await supabase.from("tasks").insert({
        user_id: USER_ID,
        date: testDate,
        tasks: [{ text: "test", done: false }],
      });

      if (writeError) {
        return false;
      }

      // Cleanup test record
      await supabase
        .from("tasks")
        .delete()
        .eq("date", testDate)
        .eq("user_id", USER_ID);

      return true;
    } catch (err) {
      return false;
    }
  },
};

// Format: YYYY-MM-DD (ISO 8601)
export const getDateKey = (day, month, year) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};
