import React, { useState } from "react";

export default function StudentGuideBot() {
  const [stage, setStage] = useState("askName");
  const [student, setStudent] = useState({});
  const [input, setInput] = useState("");

  const sampleColleges = [
    { name: "Govt Polytechnic Mech", district: "Chennai", courses: ["Diploma Mech"] },
    { name: "Govt Polytechnic CSE", district: "Chennai", courses: ["Diploma CSE"] },
    { name: "Govt Engg College", district: "Madurai", courses: ["B.E", "B.Tech"] },
    { name: "Govt Medical College", district: "Madurai", courses: ["MBBS"] },
    { name: "Govt Commerce College", district: "Chennai", courses: ["B.Com", "BBA"] },
  ];

  const next = (reply) => {
    let s = { ...student };
    if (stage === "askName") {
      s.name = reply;
      setStudent(s);
      setStage("askLevel");
    } else if (stage === "askLevel") {
      s.level = reply;
      setStudent(s);
      if (reply === "12th") setStage("askStream12th");
      if (reply === "10th") setStage("askAfter10");
    } else if (stage === "askAfter10") {
      if (reply === "12th") setStage("askStream12th");
      if (reply === "Diploma") setStage("askDiplomaStream");
    } else if (stage === "askStream12th") {
      s.stream = reply;
      setStudent(s);
      setStage("askDistrict");
    } else if (stage === "askDiplomaStream") {
      s.stream = reply;
      setStudent(s);
      setStage("askDistrict");
    } else if (stage === "askDistrict") {
      s.district = reply;
      setStudent(s);
      setStage("showColleges");
    } else if (stage === "askCommunity") {
      s.community = reply;
      setStudent(s);
      setStage("askIncome");
    } else if (stage === "askIncome") {
      s.income = reply;
      setStudent(s);
      setStage("askFirstGrad");
    } else if (stage === "askFirstGrad") {
      s.firstGrad = reply;
      setStudent(s);
      setStage("showScholarship");
    }
  };

  const showColleges = () => {
    const { district, stream } = student;
    return sampleColleges.filter(
      (c) =>
        c.district.toLowerCase() === (district || "").toLowerCase() &&
        c.courses.some((course) =>
          course.toLowerCase().includes((stream || "").toLowerCase())
        )
    );
  };

  const computeScholarship = () => {
    const { community, income, firstGrad } = student;
    if (community === "SC" && income === "Less than 1L" && firstGrad === "Yes")
      return "₹50,000 (SC + First Graduate)";
    if (community === "SC" && income === "Less than 1L")
      return "₹30,000 (SC)";
    if ((community === "BC" || community === "MBC") && income === "Less than 1L")
      return "₹20,000 (BC/MBC)";
    return "No matching scholarship (demo)";
  };

  const QuestionCard = ({ question, children }) => (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg text-center">
        <h2 className="text-xl font-semibold mb-6">{question}</h2>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );

  const InputStep = ({ question, placeholder, onSubmit }) => (
    <QuestionCard question={question}>
      <input
        type="text"
        className="w-full border rounded-lg px-4 py-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) {
            onSubmit(input.trim());
            setInput("");
          }
        }}
      />
      <button
        onClick={() => {
          if (input.trim()) {
            onSubmit(input.trim());
            setInput("");
          }
        }}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        Continue
      </button>
    </QuestionCard>
  );

  // --- UI STAGES ---
  if (stage === "askName") {
    return (
      <InputStep
        question="Please enter your name"
        placeholder="Your name"
        onSubmit={(val) => next(val)}
      />
    );
  }

  if (stage === "askLevel") {
    return (
      <QuestionCard question="Have you completed 10th or 12th?">
        {["10th", "12th"].map((opt) => (
          <button
            key={opt}
            onClick={() => next(opt)}
            className="w-full py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {opt}
          </button>
        ))}
      </QuestionCard>
    );
  }

  if (stage === "askAfter10") {
    return (
      <QuestionCard question="After 10th, do you want to pursue 12th or Diploma?">
        {["12th", "Diploma"].map((opt) => (
          <button
            key={opt}
            onClick={() => next(opt)}
            className="w-full py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {opt}
          </button>
        ))}
      </QuestionCard>
    );
  }

  if (stage === "askStream12th") {
    return (
      <QuestionCard question="Which 12th stream did you choose?">
        {["PCMB", "PCMCS", "Commerce"].map((opt) => (
          <button
            key={opt}
            onClick={() => next(opt)}
            className="w-full py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {opt}
          </button>
        ))}
      </QuestionCard>
    );
  }

  if (stage === "askDiplomaStream") {
    return (
      <QuestionCard question="Which Diploma stream are you interested in?">
        {["Mech", "CSE", "EEE", "ECE"].map((opt) => (
          <button
            key={opt}
            onClick={() => next(opt)}
            className="w-full py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {opt}
          </button>
        ))}
      </QuestionCard>
    );
  }

  if (stage === "askDistrict") {
    return (
      <InputStep
        question="Please enter your district"
        placeholder="Your district"
        onSubmit={(val) => next(val)}
      />
    );
  }

  if (stage === "showColleges") {
    const colleges = showColleges();
    return (
      <QuestionCard question="Here are colleges in your district">
        {colleges.length ? (
          <ul className="text-left list-disc px-6">
            {colleges.map((c) => (
              <li key={c.name}>
                {c.name} — {c.courses.join(", ")}
              </li>
            ))}
          </ul>
        ) : (
          <p>No matching colleges found (demo data)</p>
        )}
        <button
          onClick={() => setStage("askCommunity")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Next
        </button>
      </QuestionCard>
    );
  }

  if (stage === "askCommunity") {
    return (
      <QuestionCard question="What is your community?">
        {["OC", "BC", "MBC", "SC", "ST"].map((opt) => (
          <button
            key={opt}
            onClick={() => next(opt)}
            className="w-full py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {opt}
          </button>
        ))}
      </QuestionCard>
    );
  }

  if (stage === "askIncome") {
    return (
      <QuestionCard question="What is your annual income?">
        {["Less than 1L", "1L - 2.5L", "Above 2.5L"].map((opt) => (
          <button
            key={opt}
            onClick={() => next(opt)}
            className="w-full py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {opt}
          </button>
        ))}
      </QuestionCard>
    );
  }

  if (stage === "askFirstGrad") {
    return (
      <QuestionCard question="Are you the first graduate in your family?">
        {["Yes", "No"].map((opt) => (
          <button
            key={opt}
            onClick={() => next(opt)}
            className="w-full py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {opt}
          </button>
        ))}
      </QuestionCard>
    );
  }

  if (stage === "showScholarship") {
    return (
      <QuestionCard question="Scholarship Result">
        <p className="text-lg font-semibold">{computeScholarship()}</p>
        <p className="text-sm text-gray-600 mt-2">
          🔗 Check TNEA portal for Engineering counseling registration.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          Restart
        </button>
      </QuestionCard>
    );
  }
}
