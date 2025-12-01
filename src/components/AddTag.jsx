import React, { useContext } from "react";
import { useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { forwardRef } from "react";

const AddTag = forwardRef((props,ref) => {

    const {tags, setTags, selectedNote, setSelectedNote,notes,setNotes} = useContext(GlobalContext);
    const [tag,setTag] = useState("");

    const handleTagUpdate = async(newTagName) => {
        try{
        //update local
        if(newTagName != ""){
        if(!tags.find((tag) => tag === newTagName)){
            setTags([...tags,newTagName]);
        }

      const updatedNotes = notes.map((note) => {
        if((note.id === selectedNote.id) && (!note.tags.find((tag) => tag===newTagName))){
          return {...note ,tags : [...note.tags , newTagName]};
        }else{
          return note;
        }
      });
      
      setNotes(updatedNotes);
        //update backend
        const res = await fetch(`http://localhost:3000/notes/${selectedNote.id}/addtag`,{
            method : "PATCH",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({newTag : newTagName}),
        });

        console.log(await res.json());
      }
        }catch(error){
            console.error(error);
        }

    };   

  return (
    <div ref={ref} className="border-2 border-solid border-red-400">
      <input
        type="text"
        placeholder="Search/Add..."
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "6px",

          marginBottom: "15px",
        }}
        />
        {/* // list of already existing tags */}
        <div>
            {tags.map((t,idx) => {
                return <div onClick={() => handleTagUpdate(t)} className="hover:bg-gray-200 cursor-pointer" key={idx}>{t}</div>
            })}
        </div>
        {/* //create tag option */}
        <div onClick={() => handleTagUpdate(tag)}>+ Create {tag}</div>
      
    </div>
  );
});

export default AddTag;
