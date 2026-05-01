const targetDate = new Date("2026-05-01T23:55:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const diff = targetDate - now;
  const el = document.getElementById("countdown");
  const buttonContainer = document.getElementById("button-container");

  if (diff <= 0) {
    el.textContent = "It is time 💖";
    buttonContainer.classList.add("show");
    return;
  }

  buttonContainer.classList.remove("show");

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

updateCountdown();
setInterval(updateCountdown, 1000);
