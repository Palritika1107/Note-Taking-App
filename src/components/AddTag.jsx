import React, { useContext } from "react";
import { useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { forwardRef } from "react";

const AddTag = forwardRef((props,ref) => {

    const {tags, setTags, selectedNote, setSelectedNote} = useContext(GlobalContext);
    const [tag,setTag] = useState("");

    const createTag = async(newTagName) => {
        try{
        //update local
        setTags([...tags,newTagName]);
        setSelectedNote({
            ...selectedNote,
            tags : [...selectedNote.tags,newTagName]
        });
        //  update backend
        const res = await fetch(`http://localhost:3000/notes/${selectedNote.id}/addtag`,{
            method : "PATCH",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({newTag : newTagName}),
        });

        console.log(res);
        }catch(error){
            console.error(error);
        }

    }   

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
                return <div key={idx}>{t}</div>
            })}
        </div>
        {/* //create tag option */}
        <div onClick={() => createTag(tag)}>+ Create {tag}</div>
      
    </div>
  );
});

export default AddTag;
