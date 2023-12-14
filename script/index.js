const formEl = document.querySelector("#searchForm")
const contentWrapperEl = document.querySelector(".content-wrapper")
let currentMovie = "Avengers"
checkApiStatus(currentMovie)

formEl.addEventListener('submit', async(e) =>{
    e.preventDefault()
    const userSearchedMovie = formEl.querySelector('#searchMovie').value
    formEl.querySelector('#searchMovie').value = ""
    //exchang the default value
    currentMovie = userSearchedMovie;
    await checkApiStatus(userSearchedMovie)
})

// checking api status
async function checkApiStatus(movieName) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=a6f5f021&s=${movieName}`);

    if (response.ok) {
        const dataFromApi = await response.json();
        checkApiResponse(dataFromApi, movieName);
    } else {
        console.log('Error in API');
    }
}


// checking api's response
function checkApiResponse(data, movieTitle){
    if(data.Response === "True"){
        renderMovie(data.Search, data.totalResults)
    }else {
        renderError(data.Error, movieTitle)
    }
}

// rendeing not found error
function renderError(msg, title) {
    contentWrapperEl.innerHTML = `
    <div class="error-msg-container">
        <h1>Your "${title}", ${msg}</h1>
    </div>
    `
}

// render the data 
function renderMovie(moveList, totalSearch){
    // console.log(moveList, totalSearch);

    let containerHTML = ""
    moveList.forEach(movie => {
        containerHTML += `
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
        </div>`
    });
    contentWrapperEl.innerHTML = containerHTML;
    pagination(totalSearch)
}

//

function pagination(page) {
    let paginationEl = document.querySelector(".pagination");
    let currentPage = 1;
    let totalPage = Math.ceil(page / 10);

    paginationEl.innerHTML = `
        <button class="" id="previous">
            <i class="fas fa-angle-left"></i>
            <span>Previous</span>
        </button>
        <span id="currentPage"> ${currentPage} of ${totalPage} </span>
        <button class="" id="next">
            <span>Next</span>
            <i class="fas fa-angle-right"></i>
        </button>`;

    let paginationBtn = document.querySelectorAll(".pagination button");
    paginationBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const buttonId = e.currentTarget.id || e.target.parentElement.id;

            if (buttonId === "next" || buttonId === "Next") {
                currentPage++;
            } else if (buttonId === "previous" || buttonId === "Previous") {
                currentPage--;
            }

            // Update the content of the #currentPage span
            document.getElementById("currentPage").innerText = `${currentPage} of ${totalPage}`;
        });
    });
}