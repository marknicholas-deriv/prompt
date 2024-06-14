import { useRef, useState } from "react";
import { ImprovedPromptModal } from "./improved-prompt-modal";
import { useOnClickOutside } from "usehooks-ts";

export type APIResponse = {
  original_prompt: string;
  refined_prompt: string;
  extracted_prompt: string;
  placeholders: string[];
  refinement_status: string;
};

function App() {
  const modalRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<APIResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userInput, setUserInput] = useState("");

  const fetchData = async () => {
    const response = await fetch("http://127.0.0.1:8000/claude", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        prompt: userInput,
        variables: [] }) // Use userInput here
    });
    const data = await response.json();
    setData(data);
    setShowModal(true);
  };

  useOnClickOutside(modalRef, () => setShowModal(false));

  return (
    <div className="relative">
      <div className="grid grid-cols-2 h-screen">
        <div className="flex flex-col p-4">
          <label className="text-2xl font-semibold text-gray-600 border-b pb-2 mb-6">
            Prompt
          </label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="h-[640px] border rounded shadow-lg overflow-y-scroll p-3 mb-4 resize-none"
          />
          <button
            className="bg-slate-700 text-gray-50 px-3 py-2 rounded shadow"
            onClick={() => fetchData()}
          >
            Prompt
          </button>
        </div>
        <div className="flex flex-col p-4">
          <label className="text-2xl font-semibold text-gray-600 border-b pb-2 mb-6">
            Response
          </label>
          <textarea
            value={``}
            className="h-[696px] border rounded shadow-lg overflow-y-scroll p-3 mb-4 resize-none"
          />
        </div>
      </div>
      {showModal && data ? (
        <ImprovedPromptModal
          ref={modalRef}
          data={data}
          closeHandler={() => setShowModal(false)}
        />
      ) : null}
    </div>
  );
}

export default App;
