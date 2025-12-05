import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

const HomePageSideBar = ({ viewArchived , setViewArchived }) => {
  const { tags, selectedTag, setSelectedTag} = useContext(GlobalContext);

  return (
      <div className="flex flex-col gap-10">
        <h1>Notes</h1>
        <div className={!viewArchived? "bg-gray-200" : ""} onClick={() => setViewArchived(false)}>All Notes</div>
        <div className={viewArchived? "bg-gray-200" : ""} onClick={() => setViewArchived(true)}>Archived Notes</div>
        {/* list of tags */}
        <div>
          {/* tag icon */}
          {tags.map((tag,idx) => {
           return (
          <div onClick={() => setSelectedTag(prev => prev===tag ? null : tag)} key={idx} className={`flex gap-3 ${tag===selectedTag ? "bg-gray-300" : ""}` }>
            <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h.008v.008H6V6Z"
              />
            </svg>
            </div>
            <div>{tag}</div>
          </div>
          )}
         )
         }
       </div>

      </div>
  );
};

export default HomePageSideBar;
