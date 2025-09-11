// src/StudentGuideBot.jsx
import React, { useState } from "react";

/*
  StudentGuideBot.jsx
  - Mirrors career-path.rtf exactly before r: items
  - When r: list reached, converts to candidates, asks user to pick one to refine
  - Runs follow-up "quality question" mini-tree for chosen candidate
  - Saves responses + finalDecision to backend at POST /api/questionnaire/save
  - Expects token prop: <StudentGuideBot token={token} />
*/

function StudentGuideBot({ token }) {
  const [nodeKey, setNodeKey] = useState("level"); // current node key in tree
  const [responses, setResponses] = useState({});  // store answers
  const [candidates, setCandidates] = useState([]); // r: labels when reached
  const [finalDecision, setFinalDecision] = useState("");
  const [finished, setFinished] = useState(false);

  // === Principal tree strictly matching career-path.rtf before r: lists ===
  const tree = {
    // root
    level: {
      question: "What have you completed?",
      options: { "10th": "after10th", "12th": "stream12", "Diploma": "diplomaAfter" }
    },

    // 10th branch
    after10th: {
      question: "After 10th, what do you want to do?",
      options: { "11th": "stream11", "Diploma": "diploma10th", "ITI": "iti10th" }
    },
    stream11: {
      question: "Choosing the stream (11th) — Choose your interest",
      options: {
        "Physics,Chemistry\nMaths  (r:PCMCS)": "end_pcmcs",
        "Biology\nWith Maths (r:PCMB)": "end_pcmb",
        "Biology\nWithout Maths (r:PCB)": "end_pcb",
        "Others (r:Commerce)": "end_commerce",
        "Business Maths (r:Business Maths)": "end_businessMaths"
      }
    },
    diploma10th: {
      question: "Diploma (choose stream)",
      options: {
        "Interest in machines, tools, and vehicle systems. (r:Mechanical Engineering)": "leaf_mechanical",
        "Interest in building structures like roads, bridges, and buildings. (r:Civil Engineering)": "leaf_civil",
        "Interest in electricity, power systems, and electronic components. (r:EEE)": "leaf_eee",
        "Interest in computer hardware, software, and programming. (r:Computer Engineering)": "leaf_cse",
        "Interested in medical support roles in labs and hospitals. (r:DMLT)": "leaf_dmlt",
        "Interested in creative fields like clothing, digital art, and visual media. (r:Fashion Designing)": "leaf_fashion"
      }
    },
    iti10th: {
      question: "ITI Trades (choose)",
      options: {
        "r:Electrican": "leaf_electrician",
        "r:Mechanic": "leaf_mechanic",
        "r:Mechanist": "leaf_mechanist",
        "r:Draughtsman": "leaf_draughtsman",
        "r:Food Production": "leaf_food"
      }
    },

    // 12th branch
    stream12: {
      question: "Which stream did you take in 12th? (Stream)",
      options: {
        "PCMCS": "end_pcmcs",
        "PCMB": "end_pcmb",
        "PCB": "end_pcb",
        "Commerce": "end_commerce",
        "Business Maths": "end_businessMaths",
        "B.A": "end_arts",
        "Law": "end_law",
        "Diploma": "end_diploma12"
      }
    },

    // Diploma root
    diplomaAfter: {
      question: "Which Diploma stream?",
      options: {
        "Engineering": "end_diplomaEngg",
        "Medical": "end_diplomaMed",
        "Para-Medical": "end_diplomaPara"
      }
    },

    // === end lists: arrays of r: items ===
    end_pcmcs: ["r:Computer Science", "r:Engineering"],
    end_pcmb: ["r:CSE","r:Mech","r:Civil","r:ECE","r:EEE","r:IT","r:AIDS","r:Chemical","r:PetroChemical"],
    end_pcb: ["r:MBBS","r:BDS","r:Yoga","r:Ayurveda","r:Siddha","r:Unani","r:Homeopathy","r:Zoology","r:Botany","r:MicroBiology","r:Home Science","r:Nutrition and Dietretics","r:B.Pharm","r:Physiotherapy","r:Lab Technician"],
    end_commerce: ["r:B.Com","r:BBA","r:CA (Chartered Accountant)","r:BCA (Bachelor Of Computer Applications)"],
    end_businessMaths: ["r:B.Sc (Statistics)","r:B.Sc (Data Science)","r:B.A Economics","r:BFM (Bachelor of Financial Market)"],
    end_arts: ["r:Language","r:History","r:Fine Arts","r:Performing Arts","r:Journalism","r:Political Science","r:Philosophy"],
    end_law: ["r:B.A LLB","r:B.L"],
    end_diploma12: ["r:DME","r:DCE","r:DEEE","r:DECE","r:DCSE","r:DAE","r:DEE","r:DMT","r:DCT","r:DMLT","r:DRT","r:DPT","r:DPharm","r:DGNM","r:DOPT","r:DCVT","r:DOTT","r:DDT","r:DMIT"],
    end_diplomaEngg: ["r:DME","r:DCE","r:DEEE","r:DECE","r:DCSE","r:DAE","r:DEE","r:DMT","r:DCT"],
    end_diplomaMed: ["r:DMLT","r:DRT","r:DPT","r:DPharm","r:DGNM","r:DOPT","r:DCVT","r:DOTT"],
    end_diplomaPara: ["r:DDT","r:DMIT"],

    // leaf single-r nodes for diploma10th/ITI
    leaf_mechanical: ["r:Mechanical Engineering"],
    leaf_civil: ["r:Civil Engineering"],
    leaf_eee: ["r:EEE"],
    leaf_cse: ["r:Computer Engineering"],
    leaf_dmlt: ["r:DMLT"],
    leaf_fashion: ["r:Fashion Designing"],
    leaf_electrician: ["r:Electrician"],
    leaf_mechanic: ["r:Mechanic"],
    leaf_mechanist: ["r:Mechanist"],
    leaf_draughtsman: ["r:Draughtsman"],
    leaf_food: ["r:Food Production"]
  };

  // === Follow-up mini decision trees for chosen r: candidates ===
  // Each entry is an array of follow-up Q objects. For now we include a solid set for common r: choices.
  const refine = {
    Engineering: [
      {
        q: "Which appeals more: building machines/systems, structures/infrastructure, or electrical/electronic systems?",
        opts: {
          "Machines/systems (mechanical, vehicles, manufacturing)": "mechanicalTrack",
          "Structures / infrastructure (buildings, bridges, transport)": "civilTrack",
          "Electrical / electronics (power, circuits, devices)": "electricalTrack"
        }
      },
      {
        q: "Do you prefer practical hands-on workshops or theoretical/math-heavy study?",
        opts: {
          "Hands-on workshops": "handsOn",
          "Theoretical / math-heavy": "theory"
        }
      }
    ],
    "Computer Science": [
      {
        q: "Which area excites you most: building software, algorithms/research, or systems/hardware?",
        opts: {
          "Building software (apps, web, systems)": "softwareDev",
          "Algorithms / research (AI theory, algorithms)": "algorithms",
          "Systems / hardware (embedded, OS, devices)": "systems"
        }
      },
      {
        q: "Do you prefer project work/team product or solitary research/deep theory?",
        opts: {
          "Project / product / teamwork": "product",
          "Research / theory": "research"
        }
      }
    ],
    MBBS: [
      {
        q: "Which area attracts you: Surgery (procedural), Clinical Medicine (patient care), or Research/Public Health?",
        opts: {
          "Surgery (procedural work, operations)": "surgeryTrack",
          "Clinical Medicine (patient care, hospitals)": "medicineTrack",
          "Research / Public Health (labs, epidemiology, policy)": "researchTrack"
        }
      },
      {
        q: "Do you see yourself in a high-pressure hospital environment or community/rural settings?",
        opts: {
          "High-pressure hospitals (specialized care)": "hospital",
          "Community/rural health (primary care, outreach)": "community"
        }
      }
    ],
    "B.Com": [
      {
        q: "Which do you prefer: Finance (markets, banking), Accounting/Auditing, or Management/Business?",
        opts: {
          "Finance (banking, markets)": "financeTrack",
          "Accounting/Auditing (CA pathway)": "accountingTrack",
          "Management (operations, marketing, HR)": "managementTrack"
        }
      },
      {
        q: "Do you prefer numerical/analytical tasks or communication/strategy tasks?",
        opts: {
          "Numerical / analytical": "numbers",
          "Communication / strategy": "people"
        }
      }
    ],
    "B.Sc (Data Science)": [
      {
        q: "Do you prefer theory/statistics or applied AI/data engineering?",
        opts: {
          "Theory / statistics": "theoryTrack",
          "Applied AI / engineering": "applicationTrack"
        }
      }
    ],
    // fallback: if no refine tree exists we accept the candidate directly
  };

  // helper: strip "r:" prefix -> label
  const stripR = (s) => (typeof s === "string" ? s.replace(/^r:\s*/, "").trim() : s);

  // Move to next node given a user option (label text exactly as shown)
  const goNext = (optionLabel) => {
    // save response to current node
    setResponses(prev => ({ ...prev, [nodeKey]: optionLabel }));

    // find mapping: if tree[nodeKey] exists and it has options mapping for optionLabel
    const node = tree[nodeKey];
    if (!node) return;

    // options is object mapping labels->nextKey OR optionLabel may itself equal an r: label that maps to a leaf key
    const nextKey = node.options[optionLabel];

    if (!nextKey) {
      // Defensive: maybe optionLabel includes an r: inside parentheses; find a matching key by checking startsWith
      // try to find a key that contains optionLabel as substring
      const matching = Object.entries(node.options).find(([k, v]) => k === optionLabel || k.includes(optionLabel) || optionLabel.includes(k));
      if (matching) {
        // use the mapped value
        const derived = matching[1];
        proceedTo(derived);
        return;
      }
      // nothing found
      console.warn("No mapping for option:", optionLabel, "nodeKey:", nodeKey);
      return;
    }

    proceedTo(nextKey);
  };

  // proceed when we know the nextKey
  const proceedTo = (nextKey) => {
    const next = tree[nextKey];
    if (Array.isArray(next)) {
      // reached r: array — convert to candidates and ask user to pick one to refine
      const cand = next.map(stripR);
      setCandidates(cand);
      setNodeKey("choose_candidate");
      return;
    }

    // normal next node
    setNodeKey(nextKey);
  };

  // When user chooses which candidate to refine (or accept directly)
  const chooseCandidate = (candidateLabel) => {
    setResponses(prev => ({ ...prev, chosenCandidate: candidateLabel }));
    // if refine tree exists for that candidate, go to its refine node; else finish directly
    if (refineHas(candidateLabel)) {
      setNodeKey(`refine__${candidateLabel}`); // custom key to signal refine flow
    } else {
      finish(candidateLabel);
    }
  };

  // check if refine tree exists
  const refineHas = (candidateLabel) => {
    return Object.prototype.hasOwnProperty.call(refine, candidateLabel);
  };

  // Handle answers inside a refine flow:
  // For simplicity we map the refine tree to one question (or first question) then map chosen track to finalDecision.
  const handleRefineAnswer = (candidateLabel, questionObj, chosenOption) => {
    // record
    setResponses(prev => ({ ...prev, [`refine_${candidateLabel}`]: { question: questionObj.q, answer: chosenOption } }));

    // Map optionKey -> a "track" code (the value in questionObj.opts)
    const trackKey = questionObj.opts[chosenOption];

    // Map trackKey to user-facing final decision
    const mapping = {
      // Engineering map
      mechanicalTrack: "B.E / B.Tech — Mechanical Engineering",
      civilTrack: "B.E / B.Tech — Civil Engineering",
      electricalTrack: "B.E / B.Tech — Electrical / Electronics Engineering",
      handsOn: "Practical-focused engineering (shop/field-heavy)",
      theory: "Theory-focused engineering (design/analysis)",

      // Computer Science
      softwareDev: "B.E/B.Tech — Computer Science (Software Development)",
      algorithms: "B.E/B.Tech — Computer Science (Algorithms / Research)",
      systems: "B.E/B.Tech — Computer Science (Systems / Embedded)",
      product: "Software/Product development path",
      research: "Research / algorithms path",

      // MBBS
      surgeryTrack: "MBBS — Surgery-focused path (consider MS later)",
      medicineTrack: "MBBS — Clinical Medicine (General Physician specialties)",
      researchTrack: "MBBS + Research / Public Health path",
      hospital: "Hospital / tertiary-care path",
      community: "Community / rural-health primary-care path",

      // B.Com tracks
      financeTrack: "B.Com — Finance / Banking specialization",
      accountingTrack: "B.Com — Accounting / CA pathway",
      managementTrack: "B.Com — Management / Business path",
      numbers: "Numerical / analytical career focus",
      people: "People / communication career focus",

      // Data science
      theoryTrack: "B.Sc Data Science — Statistics / Research focus",
      applicationTrack: "B.Sc Data Science — Applied AI / Data Engineering"
    };

    const decision = mapping[trackKey] || candidateLabel;
    finish(decision);
  };

  // Finish flow: set finalDecision, finished state and save to backend
  const finish = async (decision) => {
    setFinalDecision(decision);
    setFinished(true);

    // Save responses + finalDecision to backend
    try {
      await fetch("http://localhost:5000/api/questionnaire/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "" // backend middleware handles Bearer or raw
        },
        body: JSON.stringify({ responses, finalDecision: decision })
      });
    } catch (err) {
      console.error("Failed saving finalDecision:", err);
    }
  };

  // UI rendering ---------------------------------------------------------
  if (finished) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md max-w-xl">
        <h2 className="text-xl font-bold text-green-700 mb-2">🎯 Final Recommendation</h2>
        <div className="bg-gray-100 p-4 rounded mb-3">
          <strong>{finalDecision}</strong>
        </div>
        <div className="text-sm text-gray-600">Saved to your account.</div>
      </div>
    );
  }

  // If we are at choose_candidate node show candidates
  if (nodeKey === "choose_candidate") {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md max-w-xl">
        <h2 className="text-lg font-semibold mb-3">Choose one option to refine</h2>
        <p className="text-sm mb-3">These are the career options found. Pick one to answer a few questions and finalize.</p>
        <div className="flex flex-col gap-2">
          {candidates.map(c => (
            <button key={c} onClick={() => chooseCandidate(c)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              {c}
            </button>
          ))}
          <button onClick={() => chooseCandidate(candidates[0])}
            className="mt-3 px-4 py-2 rounded-lg bg-gray-200 text-black">
            Skip refinement — accept {candidates[0]}
          </button>
        </div>
      </div>
    );
  }

  // If nodeKey denotes a refine flow like refine__Engineering
  if (nodeKey.startsWith("refine__")) {
    const candidate = nodeKey.replace("refine__", "");
    const refineFlow = refine[candidate];
    if (!refineFlow || refineFlow.length === 0) {
      // fallback accept candidate
      finish(candidate);
      return null;
    }

    // Show first refine question (for now we use first question for finalization)
    const qObj = refineFlow[0];
    return (
      <div className="p-6 bg-white rounded-xl shadow-md max-w-xl">
        <h2 className="text-lg font-semibold mb-3">{qObj.q}</h2>
        <div className="flex flex-col gap-2">
          {Object.keys(qObj.opts).map(opt => (
            <button key={opt} onClick={() => handleRefineAnswer(candidate, qObj, opt)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Otherwise show a normal tree node
  const node = tree[nodeKey];
  if (!node) {
    return <div className="p-6">Invalid node: {nodeKey}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-xl">
      <h2 className="text-lg font-semibold mb-4">{node.question}</h2>
      <div className="flex flex-col gap-2">
        {Object.keys(node.options).map(opt => (
          <button key={opt} onClick={() => goNext(opt)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-left whitespace-normal">
            <span dangerouslySetInnerHTML={{ __html: opt.replace(/\n/g, "<br/>") }} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default StudentGuideBot;
