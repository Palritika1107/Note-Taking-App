import React, { useState } from 'react'

const DisplayNotes = ({notes,setSelectedNote,selectedNote}) => {
    // setting time as a STATE as later on when i update the note i would want it to change
    const[time, setTime] = useState("");

    console.log("NOTES RECEIVED IN DISPLAY:", notes, Array.isArray(notes));

  return (
  <>
    <div style={{ marginTop: "20px" }}>
        {notes.length === 0 ? (
          <p>No notes yet!</p>
        ) : (
          notes.map((note, index) => {
            const noteTime = new Date(note.lastEdited).toLocaleString();
          return (<div
              key={note.id}
              className={`cursor-pointer transition-colors duration-200 p-4 rounded-lg
           ${selectedNote?.id === note.id 
      ? "bg-gray-300"       // selected
      : "bg-white hover:bg-gray-200"}`}
              onClick={() => setSelectedNote(note)}
            >
              <h2>{note.title}</h2>
              <p>{noteTime}</p>
            </div>)
          })
        )
        }
    </div>
  </>
  )
}

export default DisplayNotes