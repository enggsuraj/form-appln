// eslint-disable-next-line @typescript-eslint/no-explicit-any
import React, { useState } from "react";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

type QuestionType =
  | "Short answer"
  | "Long answer"
  | "Single select"
  | "Number"
  | "URL"
  | "Date";

const Home = () => {
  const [questions, setQuestions] = useState<any>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isURLValid, setIsURLValid] = useState(true); // Add this state for URL validation

  const questionTypes: QuestionType[] = [
    "Short answer",
    "Long answer",
    "Single select",
    "URL",
    "Date",
  ];

  const addQuestion = () => {
    const newQuestion: any = {
      id: Date.now(),
      type: selectedType,
      label: "",
      value: selectedType === "Date" ? "" : "",
      options: selectedType === "Single select" ? [] : undefined,
      minLength: selectedType === "Short answer" ? 5 : undefined,
      maxLength: selectedType === "Long answer" ? 300 : undefined,
    };

    setQuestions((prevQuestions: any) => [...prevQuestions, newQuestion]);
    setSelectedType("");
  };

  const updateQuestion = (id: number, key: any, value: any) => {
    setQuestions((prevQuestions: any) =>
      prevQuestions.map((q: any) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };

  const handleURLChange = (q: any, e: React.ChangeEvent<HTMLInputElement>) => {
    const urlRegex = /^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([\/?%&=]*)$/;
    const value = e.target.value;

    // Allow user to type anything, but only validate when they stop typing (on blur or form submission)
    updateQuestion(q.id, "value", value);

    // If you want to validate it live, you can show a warning or highlight the input
    if (value && !urlRegex.test(value)) {
      setIsURLValid(false); // Optionally show some state to track the validation error
    } else {
      setIsURLValid(true); // If valid, update validation state
    }
  };

  const handleSubmit = () => {
    const incomplete = questions.some(
      (q: any) =>
        (q.type !== "Single select" && !q.value.trim()) ||
        (q.type === "Short answer" && q.value.length < (q.minLength || 0)) ||
        (q.type === "Long answer" && q.value.length < (q.minLength || 0))
    );
    if (incomplete) {
      alert("Please fill all fields correctly!");
    } else {
      toast.success("Form submitted successfully!");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isPreview ? "Preview Form" : "Create Form"}
      </h2>

      {!isPreview ? (
        <>
          <div className="mb-6 flex items-center space-x-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Question Type</option>
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              onClick={addQuestion}
              disabled={!selectedType}
              className={`px-4 py-2 font-medium text-white rounded-md transition 
                ${
                  selectedType
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}>
              Add Question
            </button>
          </div>

          {questions.map((q: any) => (
            <div key={q.id} className="mb-6 bg-gray-50 p-4 border rounded-md">
              <input
                type="text"
                placeholder={
                  q.type === "Short answer" || q.type === "Long answer"
                    ? "Write question"
                    : q.type === "URL"
                    ? "Link to your best work"
                    : "Question Label"
                }
                value={q.label}
                onChange={(e) => updateQuestion(q.id, "label", e.target.value)}
                className="block w-full mb-3 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {q.type === "Single select" && (
                <div>
                  <input
                    type="text"
                    placeholder="Add Option (Press Enter)"
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        updateQuestion(q.id, "options", [
                          ...(q.options || []),
                          e.target.value.trim(),
                        ]);
                        e.target.value = "";
                      }
                    }}
                    className="block w-full mb-3 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ul className="list-disc pl-5 text-gray-600">
                    {q.options?.map((opt: any, idx: number) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                </div>
              )}
              {q.type === "Date" && (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Date"
                    value={q.value ? new Date(q.value) : null}
                    onChange={(newValue) =>
                      updateQuestion(
                        q.id,
                        "value",
                        newValue?.toISOString() || ""
                      )
                    }
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        className="mb-3"
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            </div>
          ))}

          {/* Preview Button */}
          <button
            onClick={() => setIsPreview(true)}
            className="mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-md shadow-md hover:bg-green-700 transition">
            Preview Form
          </button>
        </>
      ) : (
        <>
          {questions.map((q: any) => (
            <div key={q.id} className="mb-6">
              <label className="block font-medium text-gray-800 mb-2">
                {q.label}
              </label>
              {q.type === "Short answer" && (
                <input
                  type="text"
                  value={q.value}
                  onChange={(e) =>
                    updateQuestion(q.id, "value", e.target.value)
                  }
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  maxLength={q.maxLength}
                />
              )}
              {q.type === "Long answer" && (
                <textarea
                  value={q.value}
                  onChange={(e) =>
                    updateQuestion(q.id, "value", e.target.value)
                  }
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  maxLength={q.maxLength}
                />
              )}
              {q.type === "Single select" && (
                <select
                  value={q.value}
                  onChange={(e) =>
                    updateQuestion(q.id, "value", e.target.value)
                  }
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select an option</option>
                  {q.options?.map((opt: any, idx: any) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
              {q.type === "Date" && (
                <input
                  type="date"
                  value={q.value}
                  onChange={(e) =>
                    updateQuestion(q.id, "value", e.target.value)
                  }
                  className="block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              )}
              {q.type === "URL" && (
                <div>
                  <input
                    type="text"
                    placeholder="Link to your best work"
                    value={q.value}
                    onChange={(e) => handleURLChange(q, e)} // Custom URL validation
                    className={`block w-full mb-3 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      !isURLValid && q.value ? "border-red-500" : ""
                    }`}
                  />
                  {!isURLValid && q.value && (
                    <p className="text-red-500 text-sm">
                      Please enter a valid HTTPS URL
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 transition">
              Submit Form
            </button>
            <button
              onClick={() => setIsPreview(false)}
              className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md shadow-md hover:bg-gray-600 transition">
              Back to Edit
            </button>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default Home;
