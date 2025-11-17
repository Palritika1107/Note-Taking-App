import React from "react";

const Note = ({ selectedNote }) => {
  if (!selectedNote) return null;

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* header */}
        <div>
            <h1 className="font-bold">{selectedNote.title}</h1>
        
        {/* tag list */}
        {/* time/date */}
        <div className="flex">
          <time
            className="text-s text-gray-800 font-normal"
            dateTime={selectedNote.lastEdited}
          >
            Last edited:{" "}
            {new Date(selectedNote.lastEdited).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
        </div>
        </div>
        <div>
          <p>{selectedNote.content}</p>
        </div>
      </div>
    </>
  );

};

export default Note;
