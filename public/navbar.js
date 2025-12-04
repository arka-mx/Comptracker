// navbar.js — interactive behaviour (active state + tiny accessibility helpers)
console.log("Navbar loaded")
// attach navigation to buttons that have data-href
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item[data-href]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const url = btn.getAttribute('data-href');
      if (!url) return;
      // navigate
      window.location.href = url;
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const items = Array.from(document.querySelectorAll(".nav-item"));
  const signup = document.getElementById("signupBtn");
  const login = document.getElementById("loginBtn");
  const brand = document.querySelector(".brand");

  for (i = 0; i < document.querySelectorAll(".-nav-item").length; i++) {
    document.querySelectorAll(".nav-item")[i].addEventListener("click", () => {
      window.location.href = "/dashboard";
    });
  }

  // Toggle active class for clicked nav item (visual)
  items.forEach((btn) => {
    btn.addEventListener("click", () => {
      items.forEach((i) => i.classList.remove("active"));
      btn.classList.add("active");
      console.log("Nav clicked:", btn.textContent.trim());
    });
  });

  // Simple handlers (replace with routing/modals as needed)
  signup.addEventListener("click", () => {
    console.log("Signup clicked");
    // open signup modal or navigate
  });

  login.addEventListener("click", () => {
    console.log("Login clicked");
    // open login modal or navigate
  });

  // keyboard: left/right arrow navigation between center items
  document.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    if (!active || !active.classList.contains("nav-item")) return;

    const idx = items.indexOf(active);
    if (e.key === "ArrowRight") {
      const next = items[(idx + 1) % items.length];
      next.focus();
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      const prev = items[(idx - 1 + items.length) % items.length];
      prev.focus();
      e.preventDefault();
    }
  });

  // make brand focusable and announceable via keyboard
  brand.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      console.log("Brand focused");
    }
  });
});
