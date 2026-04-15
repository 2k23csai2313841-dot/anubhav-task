import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const USER_ID = "2313841";
const DEFAULT_TASKS = [
  { text: "LeetCode", done: false },
  { text: "Workout", done: false },
];

export default async function handler(req, res) {
  try {
    const today = new Date();
    const dateKey = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;

    // Fetch tasks from Supabase
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", USER_ID)
      .eq("date", dateKey)
      .maybeSingle();

    if (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }

    let tasks = data?.tasks || DEFAULT_TASKS;
    let pendingTasks = tasks.filter((t) => !t.done);

    // Check if today is Saturday and add LeetCode Contest
    if (today.getDay() === 6) {
      const leetCodeTask = { text: "LeetCode Contest", done: false };
      if (!pendingTasks.find((t) => t.text === "LeetCode Contest")) {
        pendingTasks.push(leetCodeTask);

        // Add LeetCode Contest task via Supabase
        const updatedTasks = [...tasks, leetCodeTask];
        await supabase
          .from("tasks")
          .upsert(
            {
              user_id: USER_ID,
              date: dateKey,
              tasks: updatedTasks,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,date" },
          )
          .catch((err) => console.error("Error adding LeetCode Contest:", err));
      }
    }

    if (pendingTasks.length === 0) {
      return res
        .status(200)
        .json({ message: "🎉 No email needed. All tasks complete." });
    }

    // Format HTML list
    const taskListHTML = pendingTasks
      .map((t) =>
        t.text === "Workout"
          ? `<li>➡️ tere se aaj workout suru nahi hua mote jaa kar  </li>`
          : `<li>➡️ ${t.text}</li>`,
      )
      .join("");

    // --- Calculate time remaining today ---
    // Time in IST
    const nowUTC = new Date();
    const nowIST = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000);

    // End of day in IST (23:59:59)
    const endOfDayIST = new Date(
      nowIST.getFullYear(),
      nowIST.getMonth(),
      nowIST.getDate(),
      23,
      59,
      59,
    );

    // Time difference
    const diffMs = endOfDayIST - nowIST;
    const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    // Send email with pending tasks
    await axios.post("https://mail-api-iuw1zw.fly.dev/sendMail", {
      to: "anubhavsingh2106@gmail.com",
      subject: "⚠ Reminder: Tasks Pending",
      websiteName: "Task Manager",
      message: `
        <h3>🚨Saale aaj ka task nahi hua motee</h3>
        <p><strong> yeh dekh kya kya nahi hua hai </strong></p>
        <ul>${taskListHTML}</ul>
        <p>⏳ <strong>samay khatam hone me :</strong> ${hoursLeft} hours ${minutesLeft} minutes</p>
        <a href="https://anubhav-task.vercel.app/">Jaldi kar aur yaha update kar gandu</a>
      `,
    });

    return res.status(200).json({ message: "📩 Email sent successfully!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
