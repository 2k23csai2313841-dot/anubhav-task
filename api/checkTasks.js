import axios from "axios";

export default async function handler(req, res) {
  try {
    const USER_ID = "2313841";
    const backendURL = `https://todo-backend-5t1x.onrender.com/api/task`;

    const today = new Date();
    const dateKey = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;

    // Warm Render
    await axios.get(`${backendURL}/${USER_ID}/${dateKey}`).catch(() => {});

    // Fetch tasks
    const response = await axios.get(`${backendURL}/${USER_ID}/${dateKey}`);
    const tasks = response?.data?.tasks || [];

    // Find incomplete tasks
    const pendingTasks = tasks.filter(t => !t.done);

    if (pendingTasks.length === 0) {
      return res.status(200).json({ message: "🎉 No email needed. All tasks complete." });
    }

    // Format HTML list
    const taskListHTML = pendingTasks.map(t => `<li>➡️ ${t.text}</li>`).join("");

    await axios.post("https://mail-api-iuw1zw.fly.dev/sendMail", {
      to: "anubhavsingh2106@gmail.com",
      subject: "⚠ Reminder: Tasks Pending",
      websiteName: "Task Manager",
      message: `
        <h3>🚨 You still have pending tasks today!</h3>
        <p><strong>Here is what you missed:</strong></p>
        <ul>${taskListHTML}</ul>
        <br/>
        <p>💪 Finish them before the day ends!</p>
      `
    });

    return res.status(200).json({ message: "📩 Email sent successfully!" });

  } catch (err) {
    console.error("❌ Serverless error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
