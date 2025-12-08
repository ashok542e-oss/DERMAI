console.log("DERMAI Login/Signup JS Loaded");

// ---------- Signup modal controls ----------
const openSignupBtn = document.getElementById("openSignup");
const signupModal = document.getElementById("signupModal");
const closeSignupBtn = document.getElementById("closeSignup");
const backToLoginBtn = document.getElementById("modalBackToLogin");

function openSignupModal() {
  signupModal.classList.remove("hidden");
}

function closeSignupModal() {
  signupModal.classList.add("hidden");
}

if (openSignupBtn) {
  openSignupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openSignupModal();
  });
}

if (closeSignupBtn) {
  closeSignupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeSignupModal();
  });
}

if (backToLoginBtn) {
  backToLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeSignupModal();
  });
}

if (signupModal) {
  signupModal.addEventListener("click", (e) => {
    if (e.target === signupModal) closeSignupModal();
  });
}

// ---------- Login handling ----------
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      loginMessage.textContent = "Please fill in both email and password.";
      loginMessage.classList.add("error");
      loginMessage.classList.remove("success");
      return;
    }

    // Demo only: accept any non-empty email + password
    // Here you could add real validation later
    loginMessage.textContent = "Login successful! Redirecting…";
    loginMessage.classList.remove("error");
    loginMessage.classList.add("success");

    // mark user as "logged in" in localStorage
    localStorage.setItem("dermaiLoggedIn", "true");

    // read ?from=... parameter so we can go back to the right page
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");

    let target = "index.html";
    if (from === "services") {
      target = "services.html";
    }

    setTimeout(() => {
      window.location.href = target;
    }, 800);
  });
}
