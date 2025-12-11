import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";

const NoteForm = ({closePopup}) => {
  const [title, setTitle] = useState("");
  // const [tags,setTags] = useState([]);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const { setViewArchived, setSelectedTag, setNotes, notes } = useContext(GlobalContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalTitle = title.trim() === ""?"Untitled Note" : title;

    const noteData = {
      title : finalTitle,
      content,
      lastEdited: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3000/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      const result = await response.json();
      //UPDATE local notes
      setNotes([...notes,result.newNote]);

      setSelectedTag("");
      setViewArchived(false);

      setMessage(result.message); // should be "Saved!"
      console.log(message);
      // clear inputs
      setTitle("");
      setContent("");
      //go back to HomePage
      navigate("/");
    } catch (error) {
      console.error("Error saving note:", error);
      setMessage("Failed to save note.");
    }

    //close the form popup
    closePopup();
  };

 

  return (
    <div
      className="bg-white-800 p-6 rounded-xl shadow-2xl w-full max-w-md relative ring-2 ring-blue-500"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={closePopup}
        className="absolute top-3 left-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full w-8 h-8 grid place-items-center transition"
      >
        ×
      </button>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full  rounded-lg border border-gray-700 text-sm p-3 outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <label htmlFor="content">Content</label>
        <input
          id="content"
          type="text"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full  rounded-lg border border-gray-700 text-sm p-3 outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button 
        type="submit"
        className="hover:bg-gray-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NoteForm;
