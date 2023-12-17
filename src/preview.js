document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);

    const movieId = urlParams.get('i');



    async function getInfo(){
        const responce = await fetch(`https://www.omdbapi.com/?apikey=a6f5f021&i=${movieId}`)
        const data = await responce.json()
        console.log(data)
    }

    await getInfo()
});