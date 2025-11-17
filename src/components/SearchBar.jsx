import React from 'react'

const SearchBar = ({ searchTerm, setSearchTerm }) => {
 return (
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        padding: "8px",
        borderRadius: "6px",
        
        marginBottom: "15px",
      }}
    />
  );
};

export default SearchBar