const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "data.json");

/* READ DATA */
const readData = async () => {
  return await fs.readJson(dataFile);
};

/* WRITE DATA */
const writeData = async (data) => {
  await fs.writeJson(dataFile, data, { spaces: 2 });
};

/* LOGIN */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "admin123") {
    return res.json({
      role: "admin",
    });
  }

  const data = await readData();

  const matchedUser = data.patients.find(
    (user) =>
      user.email === email &&
      String(user.contact) === String(password)
  );

  if (matchedUser) {
    return res.json({
      role: "user",
      user: matchedUser,
    });
  }

  res.status(401).json({
    message: "Invalid credentials",
  });
});

/* GET PATIENTS */
app.get("/api/patients", async (req, res) => {
  const data = await readData();
  res.json(data.patients);
});

/* GET SINGLE USER */
app.get("/api/patients/email/:email", async (req, res) => {
  const data = await readData();

  const patient = data.patients.find(
    (p) => p.email === req.params.email
  );

  res.json(patient);
});

/* ADD PATIENT */
app.post("/api/patients", async (req, res) => {
  const data = await readData();

  const existing = data.patients.find(
    (p) => p.contact === req.body.contact
  );

  if (existing) {
    return res.status(400).json({
      message: "Mobile number already exists",
    });
  }

  const newPatient = {
    id: Date.now(),
    ...req.body,
  };

  data.patients.push(newPatient);

  await writeData(data);

  res.json({
    message: "Patient added successfully",
  });
});

/* UPDATE PATIENT */
app.put("/api/patients/:id", async (req, res) => {
  const data = await readData();

  const index = data.patients.findIndex(
    (p) => p.id == req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Patient not found",
    });
  }

  data.patients[index] = {
    ...data.patients[index],
    ...req.body,
  };

  await writeData(data);

  res.json({
    message: "Patient updated",
  });
});

/* DELETE PATIENT */
app.delete("/api/patients/:id", async (req, res) => {
  const data = await readData();

  data.patients = data.patients.filter(
    (p) => p.id != req.params.id
  );

  await writeData(data);

  res.json({
    message: "Patient deleted",
  });
});

/* GET FEEDBACKS */
app.get("/api/feedbacks", async (req, res) => {
  const data = await readData();
  res.json(data.feedbacks);
});

/* ADD FEEDBACK */
app.post("/api/feedbacks", async (req, res) => {
  const data = await readData();

  const newFeedback = {
    id: Date.now(),
    ...req.body,
  };

  data.feedbacks.push(newFeedback);

  await writeData(data);

  res.json({
    message: "Feedback submitted",
  });
});

/* DELETE FEEDBACK */
app.delete("/api/feedbacks/:id", async (req, res) => {
  const data = await readData();

  data.feedbacks = data.feedbacks.filter(
    (f) => f.id != req.params.id
  );

  await writeData(data);

  res.json({
    message: "Feedback deleted",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});