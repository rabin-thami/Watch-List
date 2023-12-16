const formEl = document.querySelector("#searchForm")
let contentWrapperEl = document.querySelector(".content-wrapper")
let paginationEl = document.querySelector("#pagination")
let search = "Avengers"
let currentPage = 1
let totalPage

// fetching data from API
async function fetchData(userInput, page) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=a6f5f021&s=${userInput}&page=${page}`)
    //checking api status 

    if(response.ok){
        const data = await response.json()
        return data;
    }else {
        let apiError = "API Service is Down"
        errorMsg(apiError)
    }
}


// main handler
async function getMovie() {
    const movieData = await fetchData(search, currentPage)

    if(movieData.Response === "True" || movieData.Response === true){
        renderMovie(movieData)
    } else {
        let responseError = `Your "${search}", ${movieData.Error}`
        errorMsg(responseError)
    }
}


// event listeners 
formEl.addEventListener('submit', async(e) => {
    e.preventDefault()
    currentSearch = formEl.querySelector("#searchMovie").value

    search = currentSearch
    await getMovie()

    currentSearch = formEl.querySelector("#searchMovie").value = ''

})


// rendering data
function renderMovie(movie) {
    let totalSearchResult = movie.totalResults
    let movieArry = movie.Search
    let renderHTML = ""

    movieArry.forEach(movie => {
       renderHTML += `
        <div class="movie-container">
            <div class="poster-container">
                <img src="${movie.Poster}" alt="">
            </div>
        <div class="info-container">
            <span>
                <i class="fas fa-bookmark"></i>
            </span>
            <div class="information">
                <h2 class="title" id="${movie.imdbID}">${movie.Title}</h2>
                <p class="type">Type : ${movie.Type}</p>
                <p class="releases-year">Year: ${movie.Year}</p>
            </div>
        </div>
        </div>
       
       `
    });
    contentWrapperEl.innerHTML = renderHTML
    pagination(totalSearchResult)
}


// rendering error
function errorMsg(msg){
    contentWrapperEl.innerHTML +=  `
    <div class="error-msg-container">
        <h1>${msg}</h1>
    </div>`;
    
}



function pagination(totalSearch) {
    totalPage = Math.ceil(totalSearch / 10)

    paginationEl.innerHTML= `
        <button id="prev">
        <i class="fas fa-angle-left"></i>
        <span>Previous</span>
        </button>
        <span id="currentPage"> ${currentPage} of ${totalPage} </span>
        <button id="next">
        <span>Next</span>
        <i class="fas fa-angle-right"></i>
        </button>
    `
}

// currentPage changer
paginationEl.addEventListener("click", async (event) => {
    const btnElement = event.target.closest('button');
    
    if (btnElement) {
        const btnElementId = btnElement.id;
        if(btnElementId ==="prev"){
            if(currentPage <= 1){
                btnElement.disabled = true
            }else if( currentPage > 1){
                currentPage--
                await getMovie()
            }
        }else if(btnElementId === "next"){
            if(currentPage < totalPage){
                currentPage++
                await getMovie()
            }else if (currentPage === totalPage) {
                btnElement.disabled = true
            }
        }
    }
});






// initial call
getMovie()