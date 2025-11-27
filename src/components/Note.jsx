import React, { useEffect } from "react";
import { useState, useRef } from "react";
import AddTag from "./AddTag";

const Note = ({ selectedNote, OnSave }) => {
  if (!selectedNote) return null;

  const [content, setContent] = useState(selectedNote?.content || "");
  const contentRef = useRef(null);
  const [isHidden,setIsHidden] = useState(true);
  const [showAddTagDialogue,setShowAddTagDialogue] = useState(false);
  const boxRef = useRef(null);

    useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowAddTagDialogue(false);
      }
    }

    // add event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  function handleInput() {
    setContent(contentRef.current.innerText); // capture text as user edits
  }

  function resetRef() {
    contentRef.current.innerText = content;
  }

  useEffect(() => {
    setContent(selectedNote?.content || "");

    if (contentRef.current) {
      contentRef.current.innerText = selectedNote.content || "";
    }
  }, [selectedNote]);

  function handleAddTag(){
    setIsHidden(true);
    setShowAddTagDialogue(true);
  }

  return (
    <>
      <div className="flex flex-col justify-between h-dvh border-2 border-solid border-gray-400">
        <div className="flex flex-col gap-5">
          {/* header */}
          <div className="flex justify-between">
            <div>
              <h1 className="font-bold">{selectedNote.title}</h1>
              {/* tag list */}
              <div className="flex gap-1">
              {selectedNote.tags?
                selectedNote.tags.map((tag,idx) => {
                  return <div key={idx}>{tag}</div>
                }): ""
              }
              </div>
              {/* time/date */}
              <div className="flex">
                <time
                  className="text-s text-gray-800 font-normal"
                  dateTime={selectedNote.lastEdited}
                >
                  Last edited:{" "}
                  {new Date(selectedNote.lastEdited).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </time>
              </div>
            </div>
            <div>
              <button
                onClick = {() => setIsHidden(!isHidden)}
                className="text-2xl cursor-pointer select-none p-1 rounded hover:bg-gray-200 active:bg-gray-300 transition"
              >
                ⋮
              </button>
              <div  onClick={() => handleAddTag()} className={`${isHidden ? "hidden" : "" }`}> Add Tag</div>
              {showAddTagDialogue && <AddTag  ref={boxRef} />}
            </div>
          </div>
          <div>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="outline-none whitespace-pre-wrap cursor-text"
              onInput={handleInput}
            ></div>
          </div>
        </div>
        <div>
          <button
            className="bg-blue-500 rounded-lg py-2 px-8 text-white"
            onClick={() => {
              OnSave(content);
              resetRef();
            }}
          >
            Save
          </button>
          <button>Cancel</button>
        </div>
      </div>
    </>
  );
};

export default Note;
