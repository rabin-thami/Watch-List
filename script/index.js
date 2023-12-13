const formEl = document.querySelector("#searchForm")
let contentWrapEl = document.querySelector(".content-wrapper")

formEl.addEventListener('submit', async (e) => {
    e.preventDefault()
    const userSearch = formEl.querySelector("#searchMovie").value
    // console.log(userSearch)
    formEl.querySelector("#searchMovie").value = ""

    await getSearchMovie(userSearch)
})

async function getSearchMovie(movieName) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=a6f5f021&s=${movieName}`)
    const dataFromApi =  await response.json()
    
    if(dataFromApi.Response === "True") {
        renderSearchMovie(dataFromApi.Search)``
    }else {
        renderError(dataFromApi.Error, movieName)
    }
}




function renderSearchMovie(movieData) {
    // console.log(movieData)
    let movieHTML = ""

    movieData.forEach(movie => {
        console.log(movie.Title)
        movieHTML += `
        <div class="movie-container">
                        <div class="poster-container">
                            <img src="${movie.Poster}" alt="">
                        </div>
                        <div class="info-container">
                            <span>
                                <i class="fa-light fa-bookmark"></i>
                            </span>
                            <div class="information">
                                <h2 class="title" id="${movie.imdbID}">${movie.Title}</h2>
                                <p class="type">Type : ${movie.Type}</p>
                                <p class="releases-year">Year: ${movie.Year}</p>
                            </div>
                        </div>
                    </div>
        `
    })
    contentWrapEl.innerHTML = movieHTML

}


function renderError(msg, movieName) {
    contentWrapEl.innerHTML = `
    <div class="error-msg-container">
        <h1>"${movieName}", ${msg}</h1>
    </div>
    `
}



const icons = document.querySelectorAll("ul li i")
function leftMenuHover() {
    icons.forEach((icon) => {
      icon.addEventListener('mouseenter', () => {
        icon.classList.add('fa-solid');
        icon.classList.remove('fa-light');
      });
    
      icon.addEventListener('mouseleave', () => {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-light');
      });
    });
  }


leftMenuHover()
