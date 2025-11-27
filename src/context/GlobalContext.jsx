import React from 'react'

const GlobalContext = React.createContext({
    tags : [],
    setTags : () => {},
    selectedNote : null, 
    setSelectedNote : () => {}
});

export default GlobalContext