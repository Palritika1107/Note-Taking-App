import React, { useContext,useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import HomeIcon from "../assets/icons/home-icon.svg";
import ArchiveIcon from "../assets/icons/archive-icon.svg";
import { useKeyboard } from "../context/KeyboardContext";
import useRovingList from "../hooks/useRovingList";


const HomePageSideBar = () => {
  const { tags, selectedTag, setSelectedTag, viewArchived, setViewArchived } =
    useContext(GlobalContext);
  
  const { registerArea, unregisterArea, setActiveArea } = useKeyboard();

  // we create a "sidebar" items array (All Notes, Archived, then tags)
  const items = ["all", "archived", ...tags];

  const { refs, next, prev, activate, focusFirst } = useRovingList({
    items,
    onActivate: (idx) => {
      if (idx === 0) setViewArchived(false);
      else if (idx === 1) setViewArchived(true);
      else setSelectedTag(items[idx]);
    },
  });

    useEffect(() => {
    registerArea("sidebar", {
      next,
      prev,
      activate,
      focus: focusFirst,
    });
    return () => unregisterArea("sidebar");
  }, [next, prev, activate, focusFirst, registerArea, unregisterArea]);


  return (
    <div className="h-full border-r border-gray-300 bg-white flex flex-col gap-8 p-6">
      <h1 className="text-2xl font-semibold">Notes</h1>
      <nav aria-label="Main sidebar" onClick={() => setActiveArea("sidebar")} className="flex flex-col gap-2">
        <div
          ref={(el) => (refs.current[0] = el)} onFocus={() => setActiveArea("sidebar")}

          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
            ${!viewArchived ? "bg-gray-100 font-medium" : "text-gray-600"}
            hover:bg-gray-100`}

          onClick={() => setViewArchived(false)}
        >
          <img src={HomeIcon} className="w-5 h-5" />
          <div>All Notes</div>
        </div>
        <div
          ref={(el) => (refs.current[1] = el)} onFocus={() => setActiveArea("sidebar")}

          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
            ${viewArchived ? "bg-gray-100 font-medium" : "text-gray-600"}
            hover:bg-gray-100 border-b border-gray-300`}

          onClick={() => setViewArchived(true)}
        >
          <img src={ArchiveIcon} className="w-5 h-5" />
          <div>Archived Notes</div>
        </div>
        {/* list of tags */}
        <div className="flex flex-col gap-3 mt-4">
          <h2 className="uppercase text-xs font-semibold text-gray-500 tracking-wide">
            Tags
          </h2>
          <div className="flex flex-col gap-1">
            {/* tag icon */}
            {tags.map((tag, idx) => {
              const index = idx + 2;
              return (
                <div
              onClick={() =>
                    setSelectedTag((prev) => (prev === tag ? null : tag))
                  }
              key={tag}
              ref={(el) => (refs.current[index] = el)}
              onFocus={() => setActiveArea("sidebar")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                ${
                  selectedTag === tag
                    ? "bg-gray-100 font-medium"
                    : "text-gray-700"
                }
                hover:bg-gray-100`}
                >
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

                  <span>{tag}</span>
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default HomePageSideBar;
