import { useState } from "react"
import HomePageMain from "./HomePageMain";
import HomePageSideBar from "./HomePageSideBar";


const Home = () => {
    const [searchTerm,setSearchTerm] = useState("");
    const [viewArchived, setViewArchived] = useState(false);

  return (
      <>
      <div className="flex">
        <div className="w-1/4">
        <HomePageSideBar setViewArchived={setViewArchived}/>
        </div>
        <div className="w-3/4">
          <HomePageMain viewArchived={viewArchived} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>
     </>
  )
}

export default Home