const Doctor = require("../models/mysql/Doctor");

exports.getLiveSchedules = async (req, res) => {
  try {
    const doctorsList = await Doctor.findAll();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = daysOfWeek[new Date().getDay()];

    const formattedSchedules = doctorsList.map((doc, index) => {
      // 1. Determine base rotation days
      let assignedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      let defaultTime = "09:00 AM - 01:00 PM";

      const spec = (doc.specialization || "").toLowerCase();
      if (spec.includes("cardio")) { assignedDays = ["Tuesday", "Thursday"]; defaultTime = "02:00 PM - 06:00 PM"; }
      else if (spec.includes("ortho") || spec.includes("artho")) { assignedDays = ["Thursday", "Saturday"]; defaultTime = "09:00 AM - 01:00 PM"; }
      else if (spec.includes("dentist")) { assignedDays = ["Monday", "Wednesday"]; defaultTime = "11:00 AM - 03:00 PM"; }
      else if (index % 2 === 0) { assignedDays = ["Monday", "Wednesday", "Friday"]; }

      // 2. READ FROM DATABASE (Prioritize actual saved data over defaults)
      const workingHours = doc.workingHours || defaultTime;
      const dbStatus = doc.status || "Available"; 

      // 3. Determine if they are actively on duty today
      const isAssignedToday = assignedDays.includes(todayName);
      const isOnDutyToday = isAssignedToday && (dbStatus === "Available");

      // 4. Calculate next available shift date
      let displayDate = new Date();
      let safeLoops = 0;
      while (!assignedDays.includes(daysOfWeek[displayDate.getDay()]) && safeLoops < 7) {
        displayDate.setDate(displayDate.getDate() + 1);
        safeLoops++;
      }

      return {
        id: doc.id,
        doctor: doc.name,
        specialization: doc.specialization,
        workingDays: assignedDays,
        day: daysOfWeek[displayDate.getDay()],
        date: displayDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        time: workingHours,      // Now pulls from DB
        status: dbStatus,        // The exact Admin setting
        isOnDutyToday: isOnDutyToday 
      };
    });

    const totalDoctors = doctorsList.length;
    // Count only those who are working today AND not on leave
    const availableToday = formattedSchedules.filter(s => s.isOnDutyToday).length; 
    const unavailable = totalDoctors - availableToday;

    res.status(200).json({ schedules: formattedSchedules, metrics: { totalDoctors, availableToday, unavailable } });
  } catch (error) {
    console.error("Schedule generation failure:", error);
    res.status(500).json({ message: "Failed compiling scheduling matrices" });
  }
};