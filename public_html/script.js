const root = document.body;
const toggle = document.querySelector(".theme-toggle");
const storageKey = "turksat-theme";

function applyTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem(storageKey, nextTheme);
  const label = nextTheme === "light" ? "Koyu temaya geç" : "Açık temaya geç";
  if (toggle) toggle.setAttribute("aria-label", label);
}

const savedTheme = localStorage.getItem(storageKey);
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  applyTheme("dark");
}

if (toggle) {
  toggle.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "light" ? "dark" : "light");
  });
}
