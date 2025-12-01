import React, { useContext, useEffect } from "react";
import { useState, useRef } from "react";
import AddTag from "./AddTag";
import GlobalContext from "../context/GlobalContext";

const Note = ({ OnSave }) => {
  const {notes ,setNotes , selectedNote } = useContext(GlobalContext);

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
  };

 const removeTag = async(tagToRemove) => {
      try{
      //update frontend
      const updatedNotes = notes.map((note) => {
          if(note.id == selectedNote.id){
              const updatedTags = note.tags.filter((tag) => tag !== tagToRemove);
              return {...note,tags : updatedTags};
          }else{
            return note;
          }
      });

      setNotes(updatedNotes);
      //selectedNote will automatically be updated ->useEffect in contextwrapper

      //update backend
        const res = await fetch(`http://localhost:3000/notes/${selectedNote.id}/removetag`,{
          method : "PATCH",
          headers : {
              "Content-Type" : "application/json",
          },
          body : JSON.stringify({tagToRemove : tagToRemove}),
        });

        console.log(await res.json());
        // console.log(`on removing tag ${res.note}`);

      }catch(error){
        console.log(error);
      }
      
  };

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
                  return (<div key={idx} className="flex gap-2 bg-gray-200">
                    <div>{tag}</div>
                    <button onClick={() => removeTag(tag)} className="cursor-pointer">{'\u00D7'}</button>
                    </div>)
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
