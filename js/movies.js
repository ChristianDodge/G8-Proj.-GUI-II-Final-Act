// fetch movie data from the backend
fetch('http://localhost:3000/movies')
  .then(response => response.json()) // parse the response as JSON
  .then(movies => {
    const moviesGrid = document.querySelector('.prev-movies-grid'); // find the grid where movies will be displayed

    // get saved movies from localStorage, or initialize an empty array if none are saved
    let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

    // loop through each movie
    movies.forEach(movie => {

        /*
      // debugging: verify that there is a movie id
      console.log(`Movie ID: ${movie.id}`);
        
      // check if the movie ID exists, skip if not
      if (!movie.id) {
        console.error(`Movie ID is missing for: ${movie.title}`);
        return;  // skip this movie if there's no valid ID
      }
        */

      // check if the movie is already saved by comparing IDs
      const isSaved = savedMovies.some(saved => saved.id === movie.id);

      // create a new div element for the movie card
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card'); // add the class for styling

      movieCard.innerHTML = `
        <img src="${movie.image}" alt="Movie Poster" class="poster"> 
        <div class="movie-info">
          <h3 class="title">${movie.title}</h3>
          <p class="description scroll-box">${movie.description}</p> <!-- Added scroll-box class -->

          <p class="details">
            <strong>RATING:</strong> ${movie.rating} <br>
            <strong>2009 – 25H 43M</strong> <!-- this is just a placeholder, you might want to change it -->
          </p>
          <button class="action-button save-btn"
            onclick="saveForLater(${movie.id}, '${movie.title.replace(/'/g, "\\'")}', '${movie.image}', '${movie.description.replace(/'/g, "\\'")}', '${movie.rating}', this)">
            ${isSaved ? "Saved" : "Save for Later"} <!-- show 'Saved' if already saved, otherwise show 'Save for Later' -->
          </button>

          <button class="action-button">Add to Watched</button> <!-- this button currently doesn't do anything -->
        </div>
      `;
      // append the new movie card to the grid
      moviesGrid.appendChild(movieCard);
    });
  })
  .catch(error => console.error('Error fetching movies:', error)); // catch any errors from fetching

// function to save a movie for later
function saveForLater(id, title, image, description, rating, button) {
    // get the saved movies from localStorage, or use an empty array if none are saved
    let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
  
    // debugging: log the saved movies before adding a new one
    console.log("Saved Movies before saving:", savedMovies);
  
    // check if the movie is already in the saved list
    if (!savedMovies.some(movie => movie.id === id)) {
      savedMovies.push({ id, title, image, description, rating }); // add the movie to the saved list
  
      // debugging: log the saved movies after adding the new one
      console.log("Saved Movies after saving:", savedMovies);
  
      // save the updated list of saved movies to localStorage
      localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
  
      // update the button text to saved and disable it
      button.textContent = "Saved";
      button.disabled = true;
      button.classList.add("saved");  
    } 
}
