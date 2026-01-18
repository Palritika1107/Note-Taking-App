import React, { useState,useEffect } from 'react'
import { useKeyboard } from "../context/KeyboardContext";
import useRovingList from "../hooks/useRovingList";


const DisplayNotes = ({notes,setSelectedNote,selectedNote}) => {
    // setting time as a STATE as later on when i update the note i would want it to change
    const[time, setTime] = useState("");
    const { registerArea, unregisterArea, setActiveArea } = useKeyboard();

  const {
    refs,
    next,
    prev,
    activate,
    focusFirst,
    focusItem,
  } = useRovingList({
    items: notes,
    onActivate: (idx) => onOpenNote(notes[idx]),
  });



  // register this list with keyboard provider
  useEffect(() => {
    registerArea("notes", {
      next,
      prev,
      activate,
      focus : focusFirst,
    });

    setActiveArea("notes");

    return () => unregisterArea("notes");
  }, [next, prev, activate, focusFirst, registerArea, unregisterArea]);

  const onOpenNote = (note) => { 
  setSelectedNote(note);
  // setActiveArea("notes");
 };


  console.log("NOTES RECEIVED IN DISPLAY:", notes, Array.isArray(notes));

  return (
  <>
    <div 
    style={{ marginTop: "20px" }}
    onClick={() => setActiveArea("notes")}
    >
      {notes.length === 0 ? (
          <p>No notes yet!</p>
        ) : (
          notes.map((note, index) => {
            const noteTime = new Date(note.lastEdited).toLocaleString();
          return (<div
                role="list"
               aria-label="Notes list"
              key={note.id}
              ref={(el) => (refs.current[index] = el)}
              className={`cursor-pointer transition-colors duration-200 p-4 rounded-lg px-3 py-2
           ${selectedNote?.id === note.id 
      ? "bg-gray-300"       // selected
      : "bg-white hover:bg-gray-200"}`}
              onClick={() => onOpenNote(note)}
              onFocus={() => {
            // when keyboard focus lands here, set provider active area
            console.log("selecetd note",index);
            setActiveArea("notes");
            //onOpenNote(note);//when i switch to notes section using TAB do we need this here ? check
          }}
          >
              <h2>{note.title}</h2>
              <p>{noteTime}</p>
          </div>
            )
          })
        )
        }
    </div>
  </>
 )
}

export default DisplayNotes