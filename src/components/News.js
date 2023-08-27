/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import '../App.scss';
import React, { useState, useEffect, useContext } from 'react';

export default function News(){

    // User authentication
    // const {currentUser, login, logout} = useContext(UserContext);
    // const [formData, setFormData] = useState({});
    
    const [articles, setArticles] = useState([]);
    const [numArticles, setNumArticles]= useState(2);
    const [maxArticles, setMaxArticles]= useState(0);
    const [sharedArticles, setSharedArticles]= useState([]);

    useEffect( () => {
        searchNews();
        savedArticles();
    }, []);

    // Create user additional profile data in users db
    const searchNews = async (e) => {
        //e.preventDefault();

        let url;
        //url = "https://api.nytimes.com/svc/news/v3/content/nyt/all.json?api-key=l0pE8ZYsNeEx6MAKnAyKmNnxJrOhAfCB";
        url = "https://api.nytimes.com/svc/topstories/v2/us.json?api-key=l0pE8ZYsNeEx6MAKnAyKmNnxJrOhAfCB"

        try{
            await fetch(url)
                .then( response => response.json() )
                .then( data => {
                    console.log("NY Times data => ", data) 

                    setArticles(data.results);
                    setMaxArticles(data.num_results);
                });
        }catch(error){
            console.log(error);
        }
    }

    const savedArticles = async () => {
        fetch(`https://react-api.up.railway.app/read`)
        // fetch(`http://localhost:4000/read`)
            .then(res => res.json())
            .then(data => {
                console.log("savedArticles data =>", data);
                data = data.reverse();
                setSharedArticles(data);
            })    
           .catch(err => {
               console.error(err);
           })
    }

    const saveArticle = async (id, title, desc, img, url) => {
        console.log("saveArticle");
        let price = Math.floor(Math.random() *10)+','+ Math.ceil(Math.random() *1000) +',000';
        id = Math.floor(Math.random() * 10000000000000000);

        fetch(`https://react-api.up.railway.app/create`,
        // fetch(`http://localhost:4000/create`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' , 
            },
            body: JSON.stringify({ 
                id: id,
                city: 'NY Times',
                name: title,
                type: 'Article',
                description: desc,
                rooms: 0,
                price: price,
                img: img,
                url: url
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("POST data =>", data);
            savedArticles();
        })    
        .catch(err => {
            console.error(err);
        })
    }

    const deleteArticle = async (id) => { 
        console.log(`deleteArticle ${id}`);

        fetch(`https://react-api.up.railway.app/delete/`,
        // fetch(`http://localhost:4000/delete/${id}`, 
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json' , 
            },
            body: JSON.stringify({ 
                id: id
            })
        })
        .then(res => {
            savedArticles();
        })
        .catch(err => {
            console.error(err);
        })
    }

    return(
            <div 
                className="row justify-content-lg-between align-items-start p-lg-4 p-2 text-white"
                style={{
                    margin:'25px 0px', 
                    color:'#ffff', 
                    background: '#0007',
                    borderRadius: '2px',
                }}
            >
                <div id="news" className="col-lg-12 text-left px-3">
                    <h2>NY Times    
                        <p>Headlines
                        <span>
                            <button 
                                className="text-decoration-underline text-white float-end"
                                onClick={ () => { setNumArticles(maxArticles) }}
                            >
                            See all articles
                            </button>
                        </span>    
                        </p>               

                    </h2>
                    <hr></hr>  
                </div>
                <div className="row text-left px-3 my-4">
                    { articles.slice(0, numArticles).map( (article, index ) =>  
                        <div className="col-xl-5 my-1" key={index}>
                            <a 
                                className="text-white" 
                                href={article.url} 
                                target="_blank"
                                style={{fontSize:'15px'}}
                            >
                                <img 
                                    height="125" 
                                    className="my-2" 
                                    src={ article.multimedia !== null ? article.multimedia[2].url : ''} alt=""
                                ></img><br></br>
                                <strong >{article.title}</strong> 
                            </a><br></br>
                            <p style={{fontSize:'12px'}}>{article.abstract}</p>
                            <a 
                                style={{fontSize:"12px", color:"white"}} href="none"
                                onClick={ (e) => { 
                                    saveArticle(index, article.title, article.abstract, article.multimedia[2].url, article.url) 
                                    e.preventDefault();
                                }}
                            >
                                <img width="25px" src="./assets/Icon-download-white.png" alt="new"></img> Share
                            </a>
                        </div>
                    )}
                </div>
                <button 
                    className="submit-btn my-3"
                    style={{padding:'11px 0px', fontSize:'14px'}}
                    onClick={ () =>{ setNumArticles( numArticles + 2) }}
                >
                    Load more...
                </button>
                <br></br>

                <hr></hr>
                <div className="row text-left px-4 my-4">
                <h3>Shared    
                </h3>
                <hr></hr> 
                { sharedArticles.slice(0, numArticles).map( (article, index ) =>  
                    <div className="col-xl-5" key={index}>
                        <a 
                            className="text-white" 
                            href={article.url} 
                            target="_blank"
                            style={{fontSize:'15px'}}
                        >
                            <img 
                                height="125" 
                                className="my-2" 
                                src={article.img} alt=""
                            ></img><br></br>
                            <strong>{article.name}</strong> 
                            <p style={{fontSize:'12px'}}>{article.description}</p>
                        </a><br></br>
                        <button    
                            style={{padding:'0px 0px', color:'white', fontSize:'14px'}}
                            onClick={ e =>  deleteArticle(article.id) }
                        >
                            Delete
                        </button>
                    </div>
                    )}
                </div>
                <button 
                    className="submit-btn"
                    style={{padding:'11px 0px', fontSize:'14px'}}
                    onClick={ () => { setNumArticles( numArticles + 2) }}
                >
                    Load more...
                </button>
                <hr></hr>
                <br></br><br></br>
            </div>
    )
}



