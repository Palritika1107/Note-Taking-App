import React from 'react'

const GlobalContext = React.createContext({
    tags : [],
    setTags : () => {},
    selectedNote : null, 
    setSelectedNote : () => {},
    notes : [],
    setNotes : () => {},
    selectedTag : "",
    setSelectedTag : () => {}
});

export default GlobalContext