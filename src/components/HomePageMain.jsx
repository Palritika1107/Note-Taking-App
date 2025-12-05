import React, { useMemo, useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import DisplayNotes from "./DisplayNotes";
import SearchBar from "./SearchBar";
import Note from "./Note";
import GlobalContext from "../context/GlobalContext";

const HomePageMain = ({ searchTerm, setSearchTerm, viewArchived }) => {
  const {
    selectedNote,
    setSelectedNote,
    tags,
    setTags,
    notes,
    setNotes,
    selectedTag,
  } = useContext(GlobalContext);

  const displayNotes = useMemo(() => {
    let filtered = notes.filter((note) =>
      viewArchived ? note.isArchived : !note.isArchived
    );

    if (selectedTag) {
      filtered = filtered.filter((note) => note.tags?.includes(selectedTag));
    }

    return filtered;
  }, [notes, viewArchived, selectedTag]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:3000/notes");
        const data = await response.json();

        console.log("Fetched data:", data.notes);
        console.log(
          "Type of data:",
          Array.isArray(data.notes) ? "Array ✅" : typeof data
        );
        console.log(data.notes[0]);

        setNotes(data.notes);
        setTags(data.tagList);
        const firstVisibleNote = data.notes.find((note) =>
          viewArchived ? note.isArchived : !note.isArchived
        );

        if (firstVisibleNote) {
          setSelectedNote(firstVisibleNote);
        } else {
          setSelectedNote(null);
        }
      } catch (error) {
        console.error("error fetching notes", notes);
      }
    };

    fetchNotes();
  }, []);

//when view changes archived/unarchived or filter by any tag

//  useEffect(() => {
// //this is only valid if we change tags it doesnt include delete and archive logic to set default note

//   // selected note still in list → keep it
//   if (displayNotes.some(n => n.id === selectedNote?.id)) return;

//   // otherwise pick first or none
//   setSelectedNote(displayNotes[0] || null);

// }, [displayNotes,viewArchived]);


  useEffect(() => {
    // When displayNotes changes and there's no selected note (or selected note is not in view)
    const isSelectedNoteInView = displayNotes.some(
      (note) => note.id === selectedNote?.id
    );

    if (!isSelectedNoteInView && displayNotes.length > 0) {
      setSelectedNote(displayNotes[0]);
    } else if (displayNotes.length === 0) {
      setSelectedNote(null);
    }
  }, [displayNotes, viewArchived]);

  

function updateDefaultSelectedNote(displayedNotes, deletedarchivedNoteId) {
    //get note in display list thats closest to the deleted/archived note (closest and above it)
    let id = deletedarchivedNoteId - 1;
    let previousNote = null;

    if(displayNotes.length > 0){
    while(id > 0 || !previousNote){
      previousNote = displayedNotes.find((note) => note.id == (id));
      id = id - 1;
    }
  
    setSelectedNote(previousNote);
  }else{
    setSelectedNote(null);
  }

}


const deleteNote = async (id) => {
  try {
    await fetch(`http://localhost:3000/notes/${id}`, { method: "DELETE" });
    
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    
    // Filter based on current view BEFORE selecting
    const displayedNotes = updatedNotes.filter(note => {
      if (viewArchived) {
        return note.isArchived;
      }else {
        return !note.isArchived;
      }
      
    });
    
    updateDefaultSelectedNote(displayedNotes, id);
  } catch (error) {
    console.error("error deleting notes", error);
  }
};

 const archiveNote = async (id, newStatus) => {
  try {
    const res = await fetch(`http://localhost:3000/notes/${id}/archive`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: newStatus }),
    });
    const data = await res.json();

    const updatedNotes = notes.map((note) => 
      note.id === id 
        ? { ...note, isArchived: data.note.isArchived, lastEdited: data.note.lastEdited }
        : note
    );
    
    setNotes(updatedNotes);
    
    // Filter based on current view BEFORE selecting
    const displayedNotes = updatedNotes.filter(note => {
      if (viewArchived) {
        return note.isArchived;
      }else {
        return !note.isArchived;
      }
    });
    
    updateDefaultSelectedNote(displayedNotes, id);
  } catch (error) {
    console.error("error archiving note", error);
  }
};


  return (
    <>
      <div>
        {/* header */}
        <div className="flex justify-between">
          <h3>All Notes/Archived Notes</h3>
          <div className="w-60">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>
        {/* Rest of the body  */}
        <div className="flex justify-between gap-4">
          {/* 1. note display and button */}

          <div className="w-1/4">
            <Link to="/create">
              <button className="bg-blue-500 rounded-lg py-2 px-8 text-white">
                {" "}
                + Create New Notes
              </button>
            </Link>
            <DisplayNotes
              notes={displayNotes}
              setSelectedNote={setSelectedNote}
              selectedNote={selectedNote}
            />
          </div>
          {/* 2. selected notes content */}
          <div className="w-2/4">{selectedNote && <Note />}</div>
          {/*3.  options to delete or archive that note */}
          <div className="w-1/4">
            <div
              className="cursor-pointer"
              onClick={() =>
                archiveNote(selectedNote.id, !selectedNote.isArchived)
              }
            >
              Archive Note
            </div>
            <div
              className="cursor-pointer"
              onClick={() => deleteNote(selectedNote.id)}
            >
              Delete Note
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePageMain;
