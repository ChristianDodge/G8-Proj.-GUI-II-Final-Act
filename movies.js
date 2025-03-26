// Fetch movie data from backend
fetch('http://localhost:3000/movies')
.then(response => response.json())
.then(movies => {
    const moviesGrid = document.querySelector('.prev-movies-grid');
    movies.forEach(movie => {
        // movie cards
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.image}" alt="Movie Poster" class="poster">
            <div class="movie-info">
                <p class="description">${movie.description}</p>
                <h3 class="title">${movie.title}</h3>
                <p class="details">
                    <strong>RATING:</strong> ${movie.rating} <br>
                    <strong>2009 – 25H 43M</strong>
                </p>
                <button class="action-button" onclick="saveForLater(${movie.id})">Save for Later</button>
                <button class="action-button">Add to Watched</button>
            </div>
        `;
        // append to grid
        moviesGrid.appendChild(movieCard);
    });
})
.catch(error => console.error('Error fetching movies:', error));