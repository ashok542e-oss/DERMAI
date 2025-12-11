console.log("DERMAI Login/Signup JS Loaded");

// ---------- Signup modal controls (only if you use a modal) ----------
const openSignupBtn = document.getElementById("openSignup");
const signupModal = document.getElementById("signupModal");
const closeSignupBtn = document.getElementById("closeSignup");
const backToLoginBtn = document.getElementById("modalBackToLogin");

function openSignupModal() {
  if (signupModal) signupModal.classList.remove("hidden");
}

function closeSignupModal() {
  if (signupModal) signupModal.classList.add("hidden");
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

// ---------- Default (hard-coded) users ----------
const defaultUsers = {
  "ashok@gmail.com":  { name: "Ashok",  password: "Ashok123"  },
  "amrit@gmail.com":  { name: "Amrit",  password: "Amrit123"  },
  "bhuwan@gmail.com": { name: "Bhuwan", password: "Bhuwan123" },
  "mandip@gmail.com": { name: "Mandip", password: "Mandip123" }
};

// ---------- User storage helpers (localStorage) ----------
function loadStoredUsers() {
  try {
    const raw = localStorage.getItem("dermaiUsers");
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading stored users:", e);
    return {};
  }
}

function saveStoredUsers(stored) {
  localStorage.setItem("dermaiUsers", JSON.stringify(stored));
}

// Combined users (default + stored)
function getAllUsers() {
  const stored = loadStoredUsers();
  return { ...defaultUsers, ...stored };
}

// Add a new user to localStorage
function addNewUser(email, password, name) {
  const stored = loadStoredUsers();
  stored[email] = { name, password };
  saveStoredUsers(stored);
}

// ---------- Login handling ----------
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage"); // add this in HTML

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      if (loginMessage) {
        loginMessage.textContent = "Please fill in both email and password.";
        loginMessage.classList.add("error");
        loginMessage.classList.remove("success");
      }
      return;
    }

    const users = getAllUsers();
    const user = users[email];
    const expectedPassword = user && user.password;

    if (!expectedPassword || expectedPassword !== password) {
      if (loginMessage) {
        loginMessage.textContent = "Invalid email or password.";
        loginMessage.classList.add("error");
        loginMessage.classList.remove("success");
      }
      return;
    }

    // Valid credentials
    if (loginMessage) {
      loginMessage.textContent = "Login successful! Redirecting…";
      loginMessage.classList.remove("error");
      loginMessage.classList.add("success");
    }

    // mark user as "logged in" and store which user
    localStorage.setItem("dermaiLoggedIn", "true");
    localStorage.setItem("dermaiUserEmail", email);
    if (user && user.name) {
      localStorage.setItem("dermaiUserName", user.name);
    }

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

// ---------- Signup handling ----------
const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage"); // add this in HTML

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const signupName = document.getElementById("signupName").value.trim();
    const signupEmail = document.getElementById("signupEmail").value.trim();
    const signupPassword = document.getElementById("signupPassword").value.trim();
    const signupConfirm = document.getElementById("signupConfirm").value.trim(); // ← matches your HTML

    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      if (signupMessage) {
        signupMessage.textContent = "Please fill in all fields.";
        signupMessage.classList.add("error");
        signupMessage.classList.remove("success");
      }
      return;
    }

    // Simple email check
    if (!signupEmail.includes("@") || !signupEmail.includes(".")) {
      if (signupMessage) {
        signupMessage.textContent = "Please enter a valid email address.";
        signupMessage.classList.add("error");
        signupMessage.classList.remove("success");
      }
      return;
    }

    if (signupPassword.length < 6) {
      if (signupMessage) {
        signupMessage.textContent = "Password should be at least 6 characters.";
        signupMessage.classList.add("error");
        signupMessage.classList.remove("success");
      }
      return;
    }

    if (signupPassword !== signupConfirm) {
      if (signupMessage) {
        signupMessage.textContent = "Passwords do not match.";
        signupMessage.classList.add("error");
        signupMessage.classList.remove("success");
      }
      return;
    }

    const allUsers = getAllUsers();
    if (allUsers[signupEmail]) {
      if (signupMessage) {
        signupMessage.textContent = "Account already exists. Please log in.";
        signupMessage.classList.add("error");
        signupMessage.classList.remove("success");
      }
      return;
    }

    // Save new user
    addNewUser(signupEmail, signupPassword, signupName);

    if (signupMessage) {
      signupMessage.textContent = "Account created successfully! You can now log in.";
      signupMessage.classList.remove("error");
      signupMessage.classList.add("success");
    }

    // Optionally auto-fill login email
    const loginEmailInput = document.getElementById("email");
    if (loginEmailInput) {
      loginEmailInput.value = signupEmail;
    }

    setTimeout(() => {
      closeSignupModal(); // if you use a modal, this will hide it
    }, 1000);
  });
}

