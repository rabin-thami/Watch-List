// Select DOM elements
const formEl = document.querySelector("#searchForm");
const contentWrapperEl = document.querySelector(".content-wrapper");
const paginationEl = document.querySelector(".pagination");

// Track data
let currentPage = 1;
let currentSearch = "Batman";

// Fetch movies 
async function fetchMovies(search, page) {
  // API call
  // ... 
  return data;
}

// Display movies
function displayMovies(movies) {
  // Render HTML
  contentWrapperEl.innerHTML = movies.map(movie => {
    return `
      <div class="movie">
        <img src="${movie.Poster}">
        <h2>${movie.Title}</h2>
      </div>
    `;
  }).join('');
  
  // Render pagination
  paginationEl.innerHTML = `
    <button id="prev">Prev</button>
    <span>${currentPage}</span>
    <button id="next">Next</button>
  `;
}

// Main handler
async function showMovies() {

  const movies = await fetchMovies(currentSearch, currentPage);  
  displayMovies(movies);

}

// Event listeners
formEl.addEventListener("submit", async event => {

  event.preventDefault();
  
  currentSearch = formEl.search.value;
  currentPage = 1;

  await showMovies();

});

paginationEl.addEventListener("click", async event => {

  if (event.target.id === "prev") {
    currentPage--;
  } else if(event.target.id === "next") {
    currentPage++;
  }

  await showMovies();

});

// Initial call
showMovies();
