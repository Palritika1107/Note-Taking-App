import React from 'react'

const HomePageSideBar = ({viewArchived , setViewArchived}) => {
  
  return (
    <>
    {/* header */}
    <div className='flex flex-col gap-10'>

    <h1>Notes</h1>
    <div onClick={() => setViewArchived(false)}>All Notes</div>
    <div onClick={() => setViewArchived(true)}>Archived Notes</div>
    </div>

    {/* tags */}

    </>
  )
}

export default HomePageSideBar