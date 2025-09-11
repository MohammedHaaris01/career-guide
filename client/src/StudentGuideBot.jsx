// src/StudentGuideBot.jsx
import React, { useState } from "react";

function StudentGuideBot({ token }) {
  const [current, setCurrent] = useState("level");
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  // Strict tree from career-path.rtf
  const flow = {
    level: {
      question: "What have you completed?",
      options: {
        "10th": "after10th",
        "12th": "stream12",
        "Diploma": "diplomaAfter",
      },
    },

    // --- If 10th ---
    after10th: {
      question: "After 10th, what do you want to do?",
      options: {
        "11th": "stream11",
        "Diploma": "diploma10th",
        "ITI": "iti10th",
      },
    },
    stream11: {
      question: "Choosing the stream (11th)",
      options: {
        PCMCS: "end_pcmcs",
        PCMB: "end_pcmb",
        PCB: "end_pcb",
        Commerce: "end_commerce",
        "Business Maths": "end_businessMaths",
      },
    },
    diploma10th: {
      question: "Choose your Diploma stream",
      options: {
        "Mechanical Engineering": "end_mech",
        "Civil Engineering": "end_civil",
        EEE: "end_eee",
        "Computer Engineering": "end_cse",
        DMLT: "end_dmlt",
        "Fashion Designing": "end_fashion",
      },
    },
    iti10th: {
      question: "Choose your ITI trade",
      options: {
        Electrician: "end_electrician",
        Mechanic: "end_mechanic",
        Mechanist: "end_mechanist",
        Draughtsman: "end_draughtsman",
        "Food Production": "end_food",
      },
    },

    // --- If 12th ---
    stream12: {
      question: "Which stream did you take in 12th?",
      options: {
        PCMCS: "end_pcmcs",
        PCMB: "end_pcmb",
        PCB: "end_pcb",
        Commerce: "end_commerce",
        "Business Maths": "end_businessMaths",
        "B.A": "end_arts",
        Law: "end_law",
        Diploma: "end_diploma12",
      },
    },

    // --- If Diploma ---
    diplomaAfter: {
      question: "Which Diploma stream?",
      options: {
        Engineering: "end_diplomaEngg",
        Medical: "end_diplomaMed",
        "Para-Medical": "end_diplomaPara",
      },
    },

    // ---- END STATES (career paths) ----
    end_pcmcs: ["r:Computer Science", "r:Engineering"],
    end_pcmb: [
      "r:CSE","r:Mech","r:Civil","r:ECE","r:EEE",
      "r:IT","r:AIDS","r:Chemical","r:PetroChemical",
    ],
    end_pcb: [
      "r:MBBS","r:BDS","r:Yoga","r:Ayurveda","r:Siddha",
      "r:Unani","r:Homeopathy","r:Zoology","r:Botany",
      "r:MicroBiology","r:Home Science","r:Nutrition and Dietretics",
      "r:B.Pharm","r:Physiotherapy","r:Lab Technician",
    ],
    end_commerce: ["r:B.Com","r:BBA","r:CA (Chartered Accountant)","r:BCA"],
    end_businessMaths: [
      "r:B.Sc (Statistics)","r:B.Sc (Data Science)",
      "r:B.A Economics","r:BFM (Bachelor of Financial Market)",
    ],
    end_arts: [
      "r:Language","r:History","r:Fine Arts",
      "r:Performing Arts","r:Journalism",
      "r:Political Science","r:Philosophy",
    ],
    end_law: ["r:B.A LLB","r:B.L"],
    end_diploma12: [
      "r:DME","r:DCE","r:DEEE","r:DECE","r:DCSE","r:DAE",
      "r:DEE","r:DMT","r:DCT","r:DMLT","r:DRT","r:DPT",
      "r:DPharm","r:DGNM","r:DOPT","r:DCVT","r:DOTT",
      "r:DDT","r:DMIT",
    ],
    end_mech: ["r:Mechanical Engineering"],
    end_civil: ["r:Civil Engineering"],
    end_eee: ["r:EEE"],
    end_cse: ["r:Computer Engineering"],
    end_dmlt: ["r:DMLT"],
    end_fashion: ["r:Fashion Designing"],
    end_electrician: ["r:Electrician"],
    end_mechanic: ["r:Mechanic"],
    end_mechanist: ["r:Mechanist"],
    end_draughtsman: ["r:Draughtsman"],
    end_food: ["r:Food Production"],
    end_diplomaEngg: ["r:DME","r:DCE","r:DEEE","r:DECE","r:DCSE","r:DAE","r:DEE","r:DMT","r:DCT"],
    end_diplomaMed: ["r:DMLT","r:DRT","r:DPT","r:DPharm","r:DGNM","r:DOPT","r:DCVT","r:DOTT"],
    end_diplomaPara: ["r:DDT","r:DMIT"],
  };

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [current]: answer });

    const next = flow[current].options[answer];
    if (!next) return;

    if (Array.isArray(flow[next])) {
      // We reached end (career paths)
      setResults(flow[next].map((x) => x.replace("r:", "").trim()));
      setFinished(true);

      // Save to backend
      fetch("http://localhost:5000/api/questionnaire/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ ...answers, final: flow[next] }),
      }).catch((err) => console.error("Save failed:", err));
    } else {
      setCurrent(next);
    }
  };

  if (finished) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md max-w-xl">
        <h2 className="text-xl font-bold text-green-700 mb-4">
          🎉 Questionnaire Completed
        </h2>
        <h3 className="font-semibold mb-2">Your career path options:</h3>
        <ul className="list-disc list-inside">
          {results.map((res, idx) => (
            <li key={idx} className="text-gray-700">
              {res}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const node = flow[current];
  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-xl">
      <h2 className="text-lg font-semibold mb-4">{node.question}</h2>
      <div className="flex flex-col gap-2">
        {Object.keys(node.options).map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StudentGuideBot;
