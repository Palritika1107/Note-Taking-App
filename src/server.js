import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/save", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data.json"));

  const newNote = {
    id : data.counter + 1,
    isArchived : false,
    tags : [],
    ...req.body
  };

  data.notes.push(newNote);
  data.counter++;
  
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  res.send({ message: "Saved!" ,newNote});
});

app.get("/notes", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data.json"));
  res.json(data);
});

app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const data = JSON.parse(fs.readFileSync("data.json"));
  const updatedNotes = data.notes.filter(note => note.id !== id);

  const updatedData = {
    ...data,
    notes : updatedNotes
  };

  fs.writeFileSync("data.json", JSON.stringify(updatedData, null, 2));
  res.json({ message: "Note deleted" });
});



app.patch("/notes/:id/archive",(req,res) =>{
    const id = parseInt(req.params.id);
    const { isArchived } = req.body;

    const data = JSON.parse(fs.readFileSync("data.json"));
    const note = data.notes.find((note) => {
        return note.id === id;
    });
    if(!note){
      return res.status(404).json({error : "note not found"});
    }

    note.isArchived = isArchived;
    note.lastEdited = new Date().toISOString();

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  res.json({ message: "Note archived" ,note});

});

app.patch("/notes/:id/update",(req,res) => {

  const id = parseInt(req.params.id);
  const { content, title } = req.body;

    const data = JSON.parse(fs.readFileSync("data.json"));
    const note = data.notes.find((note) => {
        return note.id === id;
    });
    
    if(!note){
      return res.status(404).json({error : "note not found"});
    }

    note.content = content;
    note.title = title;
    note.lastEdited = new Date().toISOString();

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  res.json({ message: "Note archived" ,note});

});

app.patch("/notes/:id/addtag",(req,res) => {

  const id = parseInt(req.params.id);
  const { newTag } = req.body;

    const data = JSON.parse(fs.readFileSync("data.json"));
    const note = data.notes.find((note) => {
        return note.id === id;
    });
    
    if(!note){
      return res.status(404).json({error : "note not found"});
    }
    
    if("tags" in note){
      if(!note.tags.find((tag) => tag === newTag)){
        note.tags.push(newTag);
      }
    }else{
        note.tags = [newTag];
    }

    if(!data.tagList.find((tag) => tag === newTag))
        data.tagList.push(newTag);


    note.lastEdited = new Date().toISOString();

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  res.json({ message: "tag added" ,note});

});

app.patch("/notes/:id/removetag",(req,res) => {

  const id = parseInt(req.params.id);
  const { tagToRemove } = req.body;

    const data = JSON.parse(fs.readFileSync("data.json"));
    const note = data.notes.find((note) => {
        return note.id === id;
    });
    
    if(!note){
      return res.status(404).json({error : "note not found"});
    }
    
    const updatedTags = note.tags.filter((tag) => tag!==tagToRemove);
    note.tags = updatedTags;

    note.lastEdited = new Date().toISOString();

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  res.json({ message: "tag removed" ,note});

});


app.listen(3000, () => console.log("Server running on port 3000"));
