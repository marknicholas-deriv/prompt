import { IoMdClose } from "react-icons/io";
import { APIResponse } from "./App";
import { forwardRef, useState } from "react";

type ImprovedPromptModalProps = {
  data: APIResponse;
  closeHandler: VoidFunction;
};

export const ImprovedPromptModal = forwardRef<
  HTMLDivElement,
  ImprovedPromptModalProps
>(({ data, closeHandler }, ref) => {
  const [allowSubmission, setAllowSubmission] = useState(false);
  const [prompt, setPrompt] = useState(data?.extracted_prompt);
  const [fields, setField] = useState<Record<string, string>>({});

  const handleReplaceFields = () => {
    Object.keys(fields).forEach((f) => {
      const regexp = new RegExp(
        `<${f}>\\s*\\{\\$${f.toUpperCase()}\\}\\s*</${f}>`,
        "g"
      );
      setPrompt((prev) => prev.replace(regexp, fields[f]));
    });

    setAllowSubmission(true);
  };

  return (
    <div className="absolute top-0 flex w-full h-screen justify-center items-center bg-gray-800 bg-opacity-70 z-50">
      <div
        ref={ref}
        className="w-[800px] h-fit flex flex-col bg-white rounded-lg px-8 py-6"
      >
        <div className="inline-flex items-center border-b pb-2 mb-6">
          <label className="text-2xl font-semibold text-gray-600">
            Improved Prompt
          </label>
          <IoMdClose
            size="1.6rem"
            className="fill-gray-500 hover:fill-slate-600 hover:scale-125 transition-all ease-in-out cursor-pointer ml-auto"
            onClick={() => closeHandler()}
          />
        </div>
        <div className="flex flex-col gap-y-3 mb-8">
          {data?.placeholders.map((p) => (
            <div key={p} className="text-sm">
              <div className="font-semibold text-gray-600 mb-1">{p}</div>
              <input
                className="w-full border px-3 py-2 rounded"
                onChange={(e) =>
                  setField((prev) => ({
                    ...prev,
                    [p.toLowerCase()]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
          <button
            className="disabled:bg-slate-400 bg-slate-700 text-gray-50 px-3 py-2 rounded mt-3"
            disabled={Object.keys(fields).length !== data?.placeholders.length}
            onClick={() => handleReplaceFields()}
          >
            Replace
          </button>
        </div>
        <textarea
          className="h-[400px] border rounded shadow-lg overflow-y-scroll p-3 mb-8"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="disabled:bg-slate-400 bg-slate-700 text-gray-50 px-3 py-2 rounded mt-3"
          disabled={!allowSubmission}
        >
          Send Improved Prompt
        </button>
      </div>
    </div>
  );
});
