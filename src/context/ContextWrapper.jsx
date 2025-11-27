import React, { useState } from 'react'
import GlobalContext from './GlobalContext';

const ContextWrapper = ({children}) => {
    const [tags,setTags] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);

  return (
    <>
    <GlobalContext.Provider
        value={{tags , setTags, selectedNote, setSelectedNote}}
    >
        {children}
    </GlobalContext.Provider>
    </>
  );
};

export default ContextWrapper