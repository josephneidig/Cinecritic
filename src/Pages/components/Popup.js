import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

import axios from 'axios';

function Popup({ selected, closePopup }) {
    const navigate = useNavigate()
    const [tempReview, setTempReview] = useState('')
    const [review, setReview] = useState('')
    const [reviewer, setReviewer] = useState('')

    async function populateReview() {
        const req = await fetch('http://localhost:4000/api/review', {
            headers: {
                'movie': selected.imdbID,
            },
        })

        const data = await req.json()
        console.log(data)
        if (data.status === 'ok') {
            setReview(data.review)
            setReviewer(data.reviewer)
        } else {
            alert(data.error)
        }
    }

    useEffect(() => {
        populateReview()
    }, [])

    async function addReview(event) {
        event.preventDefault()
        const req = await fetch('http://localhost:4000/api/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                movieID: selected.imdbID,
                review: tempReview,
                reviewer: jwt_decode(localStorage.getItem('token')).name,
            }),
        })

        const data = await req.json()
        if (data.status === 'ok') {
            setReview(tempReview)
            setReviewer(jwt_decode(localStorage.getItem('token')).name)
            setTempReview('')
        } else {
            alert(data.error)
        }
    }

    return (
        <section className="popup">
            <div className="content">
                <h2>{selected.Title} <span>({ selected.Year })</span></h2>
                <p className="rating">Rating: { selected.imdbRating }</p>
                <div className="plot">
                    <img src={ selected.Poster } />
                    <p>
                        { selected.Plot }<br/><br/>
                        {reviewer || 'Someone unknown'} wrote: {review || 'No review found.'}
                    </p>
                </div>
                <button className="close" onClick={ closePopup }>Close</button>
                <button className="reviewBtn" onClick={ addReview }>Review</button>
                <input className="review"
                    value={tempReview}
                    onChange={(e) => setTempReview(e.target.value)}
                    type="text"
                    placeholder="Enter a brief review!"
                />
            </div>
        </section>
    );
}

export default Popup;