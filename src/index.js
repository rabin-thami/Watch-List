const formEl = document.querySelector("#searchForm")
let contentWrapperEl = document.querySelector(".content-wrapper")
let paginationEl = document.querySelector("#pagination")
let loadingContainer = document.querySelector(".loading-container")

// some variable define 
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
            <i class="fas fa-bookmark bookmark-icon" data-imdbId="${movie.imdbID}"></i>
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
    bookmark(movie.Search)
    pagination(totalSearchResult)
}

// main handler
async function getMovie() {
    mouseHoverEffect()
    showLoadingMsg()
    const movieData = await fetchData(search, currentPage)
    
    if(movieData.Response === "True" || movieData.Response === true){
        hideLoadingMsg()
        renderMovie(movieData)
    } else {
        hideLoadingMsg()
        let responseError = `Your "${search}", ${movieData.Error}`
        errorMsg(responseError)
    }
}

function showLoadingMsg() {
    loadingContainer.innerHTML = `
        <div class="loading-element"></div>
    `

    loadingContainer.classList.remove('hidden');
}

function hideLoadingMsg() {
    loadingContainer.innerHTML = `
        <div class="loading-element"></div>
    `
    loadingContainer.classList.add('hidden');
}

// rendering error
function errorMsg(msg){
    contentWrapperEl.innerHTML =  `
    <div class="error-msg-container">
        <h1>${msg}</h1>
    </div>`;
    paginationEl.innerHTML = ""
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


function mouseHoverEffect() {
    const leftMenuIcon = document.querySelectorAll('ul li i')
    leftMenuIcon.forEach(icon => {
        icon.addEventListener('mouseenter', () =>{
            icon.classList.add('fa-solid');
            icon.classList.remove('fa-light');
        })

        icon.addEventListener('mouseleave', () =>{
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-light');
        })

        icon.addEventListener('click', (e) => {
            if(e.target.id === 'bookmarkIcon'){
                getDataFromLocalStorage()
            }
        })
    })

}


//bookmark button 
function bookmark(data) {
    const bookMarkedimdbID = document.querySelectorAll(".bookmark-icon");
    bookMarkedimdbID.forEach(bookId => {
        bookId.addEventListener("click", (e) => {
            const clickedImdbID = e.target.dataset.imdbid;

            const filteredData = data.filter(item => item.imdbID === clickedImdbID);
            
            checkBookmark(filteredData);
        });
    });
}



//check movie adready exit or not 
document.addEventListener("DOMContentLoaded", () => {
    updateBookmarkNotification();
});

function updateBookmarkNotification() {
    const bookMarkNotifcation = document.querySelector(".bookmark-notification");
    const spanElement = bookMarkNotifcation.querySelector("span");
    spanElement.textContent = localStorage.length;

    if (localStorage.length > 0) {
        bookMarkNotifcation.classList.remove('hidden');
    } else {
        bookMarkNotifcation.classList.add('hidden');
    }
}

function checkBookmark(filteredData) {
    loadingContainer.classList.remove('hidden');

    const tempElement = document.createElement('div');
    tempElement.classList.add("already-msg");

    filteredData.forEach(filtered => {
        if (localStorage.getItem(filtered.imdbID) !== null) {
            tempElement.textContent = 'Movie already exists in Your WatchList';
        } else {
            localStorage.setItem(filtered.imdbID, JSON.stringify(filtered));
            tempElement.textContent = 'Movie added Your WatchList Successfully';
        }
    });

    loadingContainer.innerHTML = tempElement.outerHTML;

    setTimeout(() => {
        loadingContainer.innerHTML = ''; // Clear the content
        loadingContainer.classList.add('hidden');
    }, 1000);

    updateBookmarkNotification();
}


// getting data from book mark
function getDataFromLocalStorage () {
    let keys = Object.keys(localStorage);
    let apiFormatData = {
      Search: [],
      totalResults: keys.length.toString(),
      Response: "True"
    };
  
    keys.forEach(function (key) {
      let storedData = localStorage.getItem(key);
      let parsedData = JSON.parse(storedData);
      let bookMarked = true
      apiFormatData.Search.push(parsedData);
    });
    console.log(apiFormatData)
    renderMovie(apiFormatData)
  }
  
  
  
  





//redering the book mark

// initial call
getMovie()
