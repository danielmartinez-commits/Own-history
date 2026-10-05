const tracks = [
  {
    file: "music/Sunsetz.mp3",
    title: "Sunsetz — Cigarrets after sex",
    metaphor: "para las cosas que uno siente antes de aprender a decirlas."
  },
  {
    file: "music/Her.mp3",
    title: "Her — TKVE",
    metaphor: "para querer incluso aquello que uno no sabe explicar."
  },
  {
    file: "music/Iris.mp3",
    title: "Iris — The Goo Goo Dolls",
    metaphor: "para los pequeños futuros que alguna vez imaginamos sin darnos cuenta."
  },
  {
    file: "music/Lalaland.mp3",
    title: "La la land — Them",
    metaphor: "para cuando el tiempo parece una promesa que uno quisiera detener."
  },
  {
    file: "music/Take.mp3",
    title: "Take on me — A-ha",
    metaphor: "para esas personas que llegan y desordenan un poco la gravedad."
  },
  {
    file: "music/golden.mp3",
    title: "Golden — TVKE",
    metaphor: "para las cosas que una sonrisa no siempre consigue esconder."
  },
  {
    file: "music/the-night-we-met.mp3",
    title: "The night we met",
    metaphor: "para cuando no hace falta encontrar una razón para admirar."
  }
];

const threshold = document.getElementById("threshold");
const story = document.getElementById("story");
const enterButton = document.getElementById("enterButton");
const player = document.getElementById("player");
const cassette = document.getElementById("cassette");
const soundToggle = document.getElementById("soundToggle");
const playerIndicator = document.getElementById("playerIndicator");
const miniTrack = document.getElementById("miniTrack");
const nowPlaying = document.getElementById("nowPlaying");
const trackMetaphor = document.getElementById("trackMetaphor");
const revealTrack = document.getElementById("revealTrack");
const trackTitle = document.getElementById("trackTitle");
const trackHint = document.getElementById("trackHint");

let currentTrack = null;
let hasEntered = false;

function chooseRandomTrack() {
  if (tracks.length === 1) return tracks[0];
  const candidates = tracks.filter(track => track !== currentTrack);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function setTrack(track) {
  currentTrack = track;
  player.src = track.file;
  player.loop = true;

  const number = String(tracks.indexOf(track) + 1).padStart(2, "0");
  nowPlaying.textContent = `TRACK ${number}`;
  miniTrack.textContent = `TRACK ${number}`;
  trackHint.textContent = `TRACK ${number} · reproducción aleatoria`;
  trackMetaphor.textContent = track.metaphor;
  trackTitle.textContent = track.title;
  trackTitle.hidden = true;
}

async function startMusic() {
  setTrack(chooseRandomTrack());
  player.volume = 0.34;

  try {
    await player.play();
    cassette.classList.add("playing");
    playerIndicator.classList.add("visible");
  } catch (error) {
    // El navegador puede impedir audio en circunstancias excepcionales.
    // El usuario puede iniciar/reanudarlo desde el control superior.
    console.info("El navegador bloqueó la reproducción automática:", error);
  }
}

enterButton.addEventListener("click", async () => {
  if (hasEntered) return;
  hasEntered = true;

  threshold.classList.add("leave");

  setTimeout(() => {
    threshold.style.display = "none";
    story.style.display = "block";
    requestAnimationFrame(() => story.classList.add("active"));
    story.setAttribute("aria-hidden", "false");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, 1100);

  await startMusic();
});

soundToggle.addEventListener("click", async () => {
  if (player.paused) {
    try {
      await player.play();
      cassette.classList.add("playing");
      soundToggle.textContent = "II";
      playerIndicator.classList.add("visible");
    } catch (error) {
      console.info(error);
    }
  } else {
    player.pause();
    cassette.classList.remove("playing");
    soundToggle.textContent = "▶";
  }
});

revealTrack.addEventListener("click", () => {
  trackTitle.hidden = !trackTitle.hidden;
  revealTrack.textContent = trackTitle.hidden
    ? "ver qué está sonando"
    : "guardar el misterio";
});

player.addEventListener("play", () => {
  cassette.classList.add("playing");
  soundToggle.textContent = "II";
});

player.addEventListener("pause", () => {
  cassette.classList.remove("playing");
  soundToggle.textContent = "▶";
});

window.addEventListener("keydown", event => {
  if (event.code === "Space" && hasEntered) {
    event.preventDefault();
    soundToggle.click();
  }
});
