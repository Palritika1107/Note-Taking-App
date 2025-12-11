import { useContext, useState } from "react"
import HomePageMain from "./HomePageMain";
import HomePageSideBar from "./HomePageSideBar";
import GlobalContext from "../context/GlobalContext";


const Home = () => {
    const [searchTerm,setSearchTerm] = useState("");
  return (
    <>
      <div className="flex">
        <div className="w-1/4">
          <HomePageSideBar />
        </div>
        <div className="w-3/4">
          <HomePageMain  searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>
    </>
  )
}

export default Home