import React from 'react';

function Search({ handleInput, search }) {
    return (
        <div className="searchbar">
            <input type="text" placeholder="Enter media..." className="search" onChange={handleInput} onKeyPress={search}/>
        </div>
    );
}

export default Search;