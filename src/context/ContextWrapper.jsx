import React, { useEffect, useState } from "react";
import GlobalContext from "./GlobalContext";

const ContextWrapper = ({ children }) => {
  const [tags, setTags] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [viewArchived, setViewArchived] = useState(false);

  useEffect(() => {
    if (selectedNote) {
      const updated = notes.find((note) => note.id === selectedNote.id);
      if (updated) {
        setSelectedNote(updated);
      }
    }
  }, [notes]);

  return (
    <>
      <GlobalContext.Provider
        value={{
          tags,
          setTags,
          selectedNote,
          setSelectedNote,
          notes,
          setNotes,
          selectedTag,
          setSelectedTag,
          viewArchived,
          setViewArchived,
        }}
      >
        {children}
      </GlobalContext.Provider>
    </>
  );
};

export default ContextWrapper;
