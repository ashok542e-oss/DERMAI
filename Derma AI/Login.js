console.log("DERMAI Login/Signup JS Loaded");

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

openSignupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openSignupModal();
});

closeSignupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeSignupModal();
});

backToLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeSignupModal();
});

signupModal.addEventListener("click", (e) => {
    if (e.target === signupModal) closeSignupModal();
});
