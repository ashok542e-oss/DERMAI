// auth.js – simple front-end "login required" handling

document.addEventListener("DOMContentLoaded", () => {
  function isLoggedIn() {
    return localStorage.getItem("dermaiLoggedIn") === "true";
  }

  // Any link with data-require-login will be protected
  const protectedLinks = document.querySelectorAll('a[data-require-login="true"]');

  protectedLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      if (!isLoggedIn()) {
        e.preventDefault();

        // send user to login page, with info about where they came from
        window.location.href = "login.html?from=services";
      }
      // if logged in, normal navigation happens
    });
  });
});
