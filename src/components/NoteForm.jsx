import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const NoteForm = () => {
  const [title,setTitle] = useState("");
  // const [tags,setTags] = useState([]);
  const [content,setContent] = useState("");
  const [message,setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();

    const noteData = { 
      title, 
      content,
      lastEdited: new Date().toISOString()
     };

    try{
      const response = await fetch("http://localhost:3000/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      const result = await response.json();
      setMessage(result.message); // should be "Saved!"
      console.log(message);
      
      // clear inputs
      setTitle("");
      setContent("");
      navigate('/');
    } catch (error) {
      console.error("Error saving note:", error);
      setMessage("Failed to save note.");
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input id="title" type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
      <label htmlFor="content">Content</label>
      <input id="content" type="text"  name="content" value={content} onChange={(e) => setContent(e.target.value)}/>
      <button type="submit">Submit</button>
      {message && <p>{message}</p>}
    </form>
  )
}

export default NoteForm