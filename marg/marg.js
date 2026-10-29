// Each Marg lives in his own SVG file and is placed inline, so the page's CSS
// can move his parts and the language switch reaches his handwriting.
async function placeMarg(spot) {
  const response = await fetch(`marg/${spot.dataset.marg}.svg`);
  const holder = document.createElement("div");
  holder.innerHTML = await response.text();
  const scene = holder.querySelector("svg");
  spot.replaceWith(scene);
  return scene;
}

function wakeWhenSeen(scene) {
  new IntersectionObserver(
    (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      scene.classList.add("awake");
    },
    { threshold: 0.6 },
  ).observe(scene);
}

function hopWhenTapped(scene) {
  scene.addEventListener("click", () => {
    scene.classList.remove("hop");
    void scene.getBoundingClientRect();
    scene.classList.add("hop");
  });
}

document.querySelectorAll("[data-marg]").forEach(async (spot) => {
  const scene = await placeMarg(spot);
  if (scene.classList.contains("wakes")) wakeWhenSeen(scene);
  if (scene.classList.contains("peek-scene")) hopWhenTapped(scene);
});
