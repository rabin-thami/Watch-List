// Select DOM elements
const formEl = document.querySelector("#searchForm");
const contentWrapperEl = document.querySelector(".content-wrapper");
const paginationEl = document.querySelector(".pagination");

// Track data
let currentPage = 1;
let currentSearch = "Batman";

// Fetch movies 
async function fetchMovies(search, page) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=a6f5f021&s=${search}&page=${page}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    console.log('Error in API');
    return null;
  }
}

// Display movies
function displayMovies(movies, totalResults) {
  let containerHTML = "";
  movies.forEach(movie => {
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
      </div>`;
  });

  contentWrapperEl.innerHTML = containerHTML;
  pagination(totalResults);
}

// Render not found error
function renderError(msg, title) {
  contentWrapperEl.innerHTML = `
    <div class="error-msg-container">
      <h1>Your "${title}", ${msg}</h1>
    </div>`;
}

// Render pagination
function pagination(totalResults) {
  let totalPage = Math.ceil(totalResults / 10);

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
    btn.addEventListener('click', async (e) => {
      const buttonId = e.currentTarget.id || e.target.parentElement.id;

      if (buttonId === "next" || buttonId === "Next") {
        currentPage++;
      } else if (buttonId === "previous" || buttonId === "Previous") {
        currentPage--;
      }

      await showMovies();
    });
  });
}

// Main handler
async function showMovies() {
  const moviesData = await fetchMovies(currentSearch, currentPage);

  if (moviesData && moviesData.Response === "True") {
    displayMovies(moviesData.Search, moviesData.totalResults);
  } else {
    renderError(moviesData.Error, currentSearch);
  }
}

// Event listeners
formEl.addEventListener("submit", async event => {
  event.preventDefault();
  currentSearch = formEl.querySelector('#searchMovie').value;
  currentPage = 1;
  await showMovies();
});

// Initial call
showMovies();
