import { useRef, useState } from "react";
import { API_URL } from "../api";

import PageHeader from "../components/ui/PageHeader";
import AddPatientForm from "../components/patients/AddPatientForm";

function Home() {
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const toastTimer = useRef(null);

  const [patient, setPatient] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    age: "",
    gender: "",
    problem: "",
  });

  const showToast = (msg) => {
    setToast(msg);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
  };

  const addPatient = async (e) => {
    e.preventDefault();

    if (
      !patient.name.trim() ||
      !patient.email.trim() ||
      !patient.contact.trim() ||
      !patient.age ||
      !patient.gender ||
      !patient.address.trim() ||
      !patient.problem.trim()
    ) {
      showToast("Please fill all fields ❌");
      return;
    }

    if (patient.contact.length !== 10) {
      showToast("Mobile number must be 10 digits ❌");
      return;
    }

    if (Number(patient.age) <= 0) {
      showToast("Please enter valid age ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(patient),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Patient already exists ❌");
        setLoading(false);
        return;
      }

      showToast("Patient added successfully ✔️");

      setPatient({
        name: "",
        email: "",
        contact: "",
        address: "",
        age: "",
        gender: "",
        problem: "",
      });
    } catch (error) {
      console.log(error);
      showToast("Something went wrong ❌");
    }

    setLoading(false);
  };

  const inputClass =
    "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#020817] px-6 py-8">
      {toast && (
        <div className="fixed top-24 right-6 z-[99999] bg-[#111827] text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      <div className="max-w-[1100px]">
        <PageHeader
          badge="Admin Panel"
          title="Add Patient"
          description="Register new patient details securely into MediTrack."
        />

        <div className="mt-8">
          <AddPatientForm
            patient={patient}
            setPatient={setPatient}
            handleChange={handleChange}
            addPatient={addPatient}
            loading={loading}
            inputClass={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;