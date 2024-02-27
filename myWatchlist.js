const moviesListContainer = document.getElementById('movies-list-container')
const emptyListContainer = document.getElementById('empty-list-container')
myWatchlist = []
moviesHtml = ``

document.addEventListener('click', function (e){
    if (e.target.dataset.minus) {
        myWatchlist = myWatchlist.filter(item => item!==e.target.dataset.minus)
        localStorage.setItem('myWatchlist',JSON.stringify(myWatchlist))
        alert('A movie has been removed from your watchlist.')
        renderListMovies()
    }})

function renderMovies (moviesId) {
    return Promise.all(moviesId.map(renderMovie)).then(() => {
        moviesListContainer.innerHTML = moviesHtml;
    });
}

function renderMovie (movieId) {
    return fetch(`https://www.omdbapi.com/?apikey=858c0a0a&i=${movieId}`)
        .then(response => response.json())
        .then(data => {
        moviesHtml+= `
        <div class="movie-container">
            <div class="img-movie-container">
                <img class="img-movie" src="${data.Poster}">
            </div>
            <div class="inner-movie-container">
                <div class="top-inner-movie">
                    <h1 class="title">${data.Title}</h1>
                    <p class="stars">⭐ ${data.Ratings[0].Value}</p>
                </div>
                <div class="center-inner-movie">
                    <p class="duration">${data.Runtime}</p>
                    <p class="topics">${data.Genre}</p>
                    <div class="remove-watchlist">
                        <i class="fa-solid fa-circle-minus" data-minus=${movieId}></i>
                        <p class="remove-text">Watchlist</p>
                    </div>
                </div>
                <div class="bottom-inner-movie">
                    <p class="description">${data.Plot}</p>
                </div>
            </div>
        </div>
        `
    })
}

function renderListMovies() {
    moviesID = JSON.parse(localStorage.getItem('myWatchlist'))
    myWatchlist = moviesID
    moviesHtml = `` 
    if (myWatchlist.length) {
        emptyListContainer.style.display = 'none'
        moviesListContainer.style.display = 'flex'
    }else {
        emptyListContainer.style.display = 'flex'
        moviesListContainer.style.display = 'none'
    }
    renderMovies(moviesID)
}


renderListMovies()