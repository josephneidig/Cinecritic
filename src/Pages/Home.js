import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import '../App.css';

import axios from 'axios';
import Search from './components/Search.js';
import Results from './components/Results.js';
import Popup from './components/Popup.js';

function Home() {
    const navigate = useNavigate()
    const [quote, setQuote] = useState('')
    const [tempQuote, setTempQuote] = useState('')
    const [review, setReview] = useState('')

    async function populateQuote() {
        const req = await fetch('http://localhost:4000/api/quote', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })

        const data = await req.json()
        if (data.status === 'ok') {
            setQuote(data.quote)
        } else {
            alert(data.error)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = jwt_decode(token)
            if (!user) {
                localStorage.removeItem('token')
                navigate('/', {replace: true})
            } else {
                populateQuote()
            }
        } else {
            navigate('/', {replace: true})
        }
    }, [])

    async function updateQuote(event) {
        event.preventDefault()
        const req = await fetch('http://localhost:4000/api/quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                quote: tempQuote,
            }),
        })

        const data = await req.json()
        if (data.status === 'ok') {
            setQuote(tempQuote)
            setTempQuote('')
        } else {
            alert(data.error)
        }
    }

    const [state, setState] = useState({
        s: "",
        results: [],
        selected: {}
      })
    
      const apiKey = "http://www.omdbapi.com/?apikey=608cc817";
    
      const search = (e) => {
        if (e.key === "Enter")
        {
          axios(apiKey + "&s=" + state.s).then(({data}) => {
            let results = data.Search;
    
            setState(prevState => {
              return{...prevState, results: results}
            })
          })
        }
      }
    
      const handleInput = (e) => {
        let s = e.target.value;
    
        setState(prevState => {
          return{...prevState, s: s}
        });
      }
    
      const openPopup = id => {
        axios(apiKey + "&i=" + id).then(({ data }) => {
          let result = data;
    
          console.log(result);
    
          setState(prevState => {
            return { ...prevState, selected: result }
          });
        });
      }
    
      const closePopup = () => {
        setState(prevState => {
          return { ...prevState, selected: {} }
        });
      }
    
    return (
        <div className="App">
        <header>
          <span className="top">
            <h1>Cinequoter</h1>
            <span className="userElements">
                <h2>Welcome, {jwt_decode(localStorage.getItem('token')).name}</h2>
            </span>
          </span>
        </header>
        <main>
          <Search handleInput={handleInput} search={search}/>
          <Results results={state.results} openPopup={openPopup} />
  
          {(typeof state.selected.Title != "undefined") ? <Popup selected={state.selected} closePopup={closePopup} /> : false}
        </main>
      </div>
    );
}

export default Home;