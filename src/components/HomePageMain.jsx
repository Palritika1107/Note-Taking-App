import React, { use, useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import DisplayNotes from "./DisplayNotes";
import SearchBar from "./SearchBar";
import Note from "./Note";
import GlobalContext from "../context/GlobalContext";

const HomePageMain = ({ searchTerm, setSearchTerm, viewArchived }) => {
  const [notes, setNotes] = useState([]);
  const {selectedNote, setSelectedNote , tags, setTags} = useContext(GlobalContext);

  const displayNotes = notes.filter((note) => {
    return viewArchived ? note.isArchived : !note.isArchived;
  });

 

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

  useEffect(() => {
  // When displayNotes changes and there's no selected note (or selected note is not in view)
  const isSelectedNoteInView = displayNotes.some(note => note.id === selectedNote?.id);
  
  if (!isSelectedNoteInView && displayNotes.length > 0) {
    setSelectedNote(displayNotes[0]);
  } else if (displayNotes.length === 0) {
    setSelectedNote(null);
  }
}, [displayNotes, viewArchived]);

function updateDefaultSelectedNote(updatedNotes,index){
    if (selectedNote?.id === id) {
        if (updatedNotes.length > 0) {
          const nextIdx = index === 0 ? 0 : index - 1;
          setSelectedNote(updatedNotes[nextIdx]);
        } else {
          setSelectedNote(null);
        }
      }

}

 const OnSave = async (newContent) => {
    
        try{
          //backend update
          const res = await fetch(`http://localhost:3000/notes/${selectedNote.id}/update`,{
            method : "PATCH",
            headers : {
              "Content-Type" : "application/json",
            },
            body : JSON.stringify({content : newContent}),
          });

          const data = res.json;
          console.log(data);

          //local state update
          const updatedNotes = notes.map((note) => {
              if(note.id === selectedNote.id){
                return {...note,"content" : newContent};
              }else{
                return note;
              }
          });

          setNotes(updatedNotes);

        }catch(error){
          console.log(error);
        }
  }

  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:3000/notes/${id}`, {
        method: "DELETE",
      });

      const index = notes.findIndex((note) => note.id === id);

      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      updateDefaultSelectedNote(updatedNotes,index);
      
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

      console.log(data);

      //instead of fetching again we are updating the local state also simultaneously along with 
      //data in backend
      const updatedNotes = notes
        .map((note) => {
          // If this is the note being updated
          if (note.id === id) {
            return {
              ...note,
              isArchived: data.note.isArchived,
              lastEdited: data.note.lastEdited,
            };
          }
        else{
         return note ;
          }
        })

      console.log(updatedNotes);
      setNotes(updatedNotes);

      const index = notes.findIndex((note) => note.id === id);
      updateDefaultSelectedNote(updatedNotes,index);
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
          <div className="w-2/4">
            {selectedNote && <Note selectedNote={selectedNote} OnSave={OnSave} />}
          </div>
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
