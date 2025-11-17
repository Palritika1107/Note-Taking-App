import React, { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DisplayNotes from "./DisplayNotes";
import SearchBar from "./SearchBar";
import Note from "./Note";

const HomePageMain = ({ searchTerm, setSearchTerm, viewArchived }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  const displayNotes = notes.filter((note) => {
    return viewArchived?note.isArchived : !note.isArchived;
  })

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

        setNotes(data.notes);
        if(data.notes.length > 0)
        {
            setSelectedNote(data.notes[0]);
        }
      } catch (error) {
        console.error("error fetching notes", notes);
      }
    };

    fetchNotes();
  }, []);

  const deleteNote = async(id) => {
        try{
        
            await fetch(`http://localhost:3000/notes/${id}`,
            {
                method : "DELETE",
            });

            const index = notes.findIndex((note) => note.id === id);

            const updatedNotes = notes.filter((note) => note.id!==id);
            setNotes(updatedNotes);

            if(selectedNote?.id === id){
                if(updatedNotes.length > 0){
                    const nextIdx = index===0?0:index - 1;
                    setSelectedNote(updatedNotes[nextIdx]);
                }else{
                    setSelectedNote(null);
                }
            }

        }catch(error){
            console.error("error deleting notes",error);
        }
  };

  const archiveNote = async (id, newStatus) => {
        try{

        const res = await fetch(`http://localhost:3000/notes/${id}/archive`,{
            method : "PATCH",
            headers : { "Content-Type" : "application/json", },
            body : JSON.stringify({ isArchived : newStatus})
        });

        const data = await res.json();

        console.log(data);

        setNotes(prev =>
            prev.map((note) => {
                return note.id === id ? {...note,isArchived : data.isArchived ,lastEdited : data.lastEdited }
                :note;
            })
        )

        }catch(error){
            console.error("error archiving note",error);
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
          <div className="w-2/4">{selectedNote && <Note selectedNote={selectedNote} />}</div>
          {/*3.  options to delete or archive that note */}
          <div className="w-1/4">
            <div className="cursor-pointer" onClick={() => archiveNote(selectedNote.id,!selectedNote.isArchived)}>Archive Note</div>
            <div className="cursor-pointer" onClick={() => deleteNote(selectedNote.id)}>Delete Note</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePageMain;
