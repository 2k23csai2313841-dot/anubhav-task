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

    // --- Calculate time remaining today ---
    // Time in IST
const nowUTC = new Date();
const nowIST = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));

// End of day in IST (23:59:59)
const endOfDayIST = new Date(
  nowIST.getFullYear(),
  nowIST.getMonth(),
  nowIST.getDate(),
  23,
  59,
  59
);

// Time difference
const diffMs = endOfDayIST - nowIST;
const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));


    // Send email
    await axios.post("https://mail-api-iuw1zw.fly.dev/sendMail", {
      to: "anubhavsingh2106@gmail.com",
      subject: "⚠ Aaj ka task nahi hua ",
      websiteName: "Task Manager",
      message: `
        <h3> Bsdk aaj ka task nahi hua </h3>

        <p><strong> Yeh le dekh aaj ke yeh sab task nahi hue</strong></p>
        <ul>${taskListHTML}</ul>

        <br/>
        <p>⏳ <strong>saale din khatam hone me sirf :</strong> ${hoursLeft} hours ${minutesLeft}   minutes <b> bacha hai kab karega din bar sota hai uth aur kar mote saale </b> </p>

        <br/>
        <a href="https://anubhav-task.vercel.app/"> jaa kar pura aur phir update kar ish par jaldi </a>

      `
    });

    return res.status(200).json({ message: "📩 Email sent successfully!" });

  } catch (err) {
    console.error("❌ Serverless error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}





