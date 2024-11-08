console.log("lets write javascript!")
let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(){
    let a =await fetch("http://127.0.0.1:3000/Songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/Songs/")[1])
        }
        
    }
    return songs;
}

const playMusic = (track)=>{
    //let audio = new Audio("/songs/"+ track)
    currentSong.src = "/Songs/" + track;
    currentSong.play()
    play.src = "Assets/pause.svg"
    document.querySelector(".songInfo").innerHTML = track.replaceAll("%20"," ")
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}
 
async function main(){
    

    //get the lists of songs
    songs= await getSongs()
    console.log(songs)

    let songUL= document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="Assets/music.svg" alt="">
        <div class="info">
            <div> ${song.replaceAll("%20"," ")}</div>
            <div>Song Artist</div>
        </div>
        <div class="playnow">
            <img class="invert" src="Assets/play.svg" alt="">
        </div>
    </li>`;
    }

    //attach event listner to eac song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    //Attach a event listner to play,next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "Assets/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "Assets/play.svg"
        }
    })

    //Listen fo time Update
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

     // Add an event listener for close button
     document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

     // Add an event listener to next
        next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


}

main()