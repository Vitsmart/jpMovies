
import React, { useState, useEffect, useCallback } from 'react';
import './Home.css'

import MoviesList from '../MoviesList';
import AddMovie from '../AddMovie';
import Topbar from '../TopBar';


export default function Home() {


  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://swapi.dev/api/films/');
      //const response = await fetch('https://mydatabase-dec66-default-rtdb.firebaseio.com/movies.json');
      
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

       const data = await response.json();
      // const loadedMovies = [];
      // for (const key in data) {
      //   loadedMovies.push({
      //     id: key,
      //     title: data[key].title,
      //     openingText: data[key].openingText,
      //     releaseDate: data[key].releaseDate,
      //   });
      // }

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

   async function addMovieHandler(movie) {
    //console.log(movie);
    const response = await fetch('https://mydatabase-dec66-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }






  return (
    <React.Fragment>
    <Topbar />
      <div className='home'>

        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <AddMovie onAddMovie={addMovieHandler} />
      <section>{content}</section>
      </div>
      
      
      
    </React.Fragment>
  );
}





