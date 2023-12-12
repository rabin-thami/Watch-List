const icons = document.querySelectorAll('ul li i');


function leftMenuSetting() {
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

leftMenuSetting()


const userInput = document.querySelector("#search")
const searchIcon = document.querySelector("#magnifyingGlass")

userInput.addEventListener('keyup', (e) => {
  if(e.key ==="Enter") {
    // console.log(userInput.value)
    searchMovie()
    userInput.value = ""

  }
})

searchIcon.addEventListener("click", () => {
  // console.log(userInput.value)
  searchMovie()
  userInput.value = ""
})

async function searchMovie() {
  const responce = await fetch(`http://www.omdbapi.com/?apikey=a6f5f021&s=${userInput.value}`)
  const movieListArr = await responce.json()
  //check if moveListArr is true

  // console.log(movieListArr)

  if(movieListArr.Response === "True") {
    renderMovies(movieListArr.Search)
  }else {
    movieNotFound(movieListArr.Error)
  }
}


const content = document.querySelector(".content-wrapper")

function movieNotFound(msg) {
  content.innerHTML = `
    <h1 class="not-found-msg">${msg}</h1>
  `
}


function renderMovies(moviesList) {
  console.log(moviesList);

  // Create a string to accumulate the HTML content
  let moviesHTML = "";

  moviesList.forEach(movie => {
    moviesHTML += `
    <div class="movie-container">
      <div class="image-container">
          <img src="${movie.Poster}" alt="${movie.Title}">
      </div>
      <div class="movie-info">
        <span>
            <i class="fa-regular fa-bookmark"></i>
        </span>
        <div class="about-movie">
            <h2 class="movie-title">${movie.Title}</h2>
            <p class="movie-description">Type : ${movie.Type}</p>
            <p class="movie-description">Relese year :${movie.Year}</p>
            <hr>
            <p class="movie-tag">Action, Adventure</p>
        </div>
      </div>  
      </div>
      `;
    });
    
    // Set the accumulated HTML content to the content element
    content.innerHTML = moviesHTML;
}
