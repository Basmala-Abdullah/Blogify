import React from 'react'

export default function SearchBar(props) {
  return (
    <div>
        <input type="text" placeholder="Search...." onChange={props.handleSearchChange} value={props.searchInput} className='input m-2 float-end'/>
    </div>
  )
}
