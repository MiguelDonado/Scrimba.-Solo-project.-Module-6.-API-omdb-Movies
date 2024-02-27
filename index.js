const searchInputEl = document.getElementById('search-input')
const searchBtnEl = document.getElementById('search-btn')
const magnifyingBtnEl = document.getElementById('magnifying-class-btn')
const afterSearchContainer = document.getElementById('after-search-container')
const beforeSearchContainer = document.getElementById('before-search-container')
const unableFindContainer = document.getElementById('unable-find-container')
let moviesHtml = `` 
let myWatchlist = []

searchInputEl.addEventListener('keydown', function (e){
    if (e.key ==='Enter') {
        loadJsonSearch()
    }
})

searchBtnEl.addEventListener('click', function () {
    loadJsonSearch()
})

magnifyingBtnEl.addEventListener('click', function () {
    loadJsonSearch()
})

document.addEventListener('click', function (e){
    if (e.target.dataset.add) {
        myWatchlist.push(e.target.dataset.add)
    }else if (e.target.id === "header-anchor") {
        e.preventDefault()
        localStorage.setItem('myWatchlist',JSON.stringify(myWatchlist))
        window.location.href = e.target.href
    }
})

function getImdbIdsSearch (arraySearch) {
    return arraySearch.Search.map(item => item.imdbID)
}

function renderMovies (moviesId) {
    return Promise.all(moviesId.map(renderMovie)).then(() => {
        afterSearchContainer.innerHTML = moviesHtml;
    });
}

function renderMovie (movieId) {
    return fetch(`http://www.omdbapi.com/?apikey=858c0a0a&i=${movieId}`)
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
                    <div class="add-watchlist">
                        <i class="fa-solid fa-circle-plus" data-add=${movieId}></i>
                        <p class="add-text">Watchlist</p>
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

function loadJsonSearch() {
    beforeSearchContainer.style.display = 'none'
    unableFindContainer.style.display = 'none'
    afterSearchContainer.style.display = 'flex'
    afterSearchContainer.innerHTML = ``
    moviesHtml = `` 
    return fetch(`http://www.omdbapi.com/?apikey=858c0a0a&s=${searchInputEl.value}&type=movie`)
        .then(response => response.json())
        .then(data => getImdbIdsSearch(data))
        .then(ids => renderMovies(ids))
        .catch(error => {
            unableFindContainer.style.display = 'flex'
            afterSearchContainer.style.display = 'none'
    })
}


