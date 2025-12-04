// login.js - Login form logic

// Helper to build API path; if the page was loaded via file://, fallback to localhost:3000
function apiPath(path) {
  try {
    const origin = window.location.origin;
    if (origin && origin !== "null") {
      return `${origin}${path}`;
    }
  } catch (e) {
    // ignore — we'll use the default
  }
  return `http://localhost:3000${path}`;
}

// MESSAGE HELPERS: show/clear messages in UI containers
function showMessage(containerId, text, type = "error", timeout = 7000) {
  try {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.classList.remove("error", "info", "success");
    el.classList.add(type);
    el.textContent = text;
    el.style.display = "block";
    if (timeout > 0) {
      window.setTimeout(() => {
        clearMessage(containerId);
      }, timeout);
    }
  } catch (e) {
    console.error("showMessage error:", e);
  }
}

function clearMessage(containerId) {
  try {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.textContent = "";
    el.style.display = "none";
    el.classList.remove("error", "info", "success");
  } catch (e) {
    console.error("clearMessage error:", e);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login-form");

  // Login form submit
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const response = await fetch(apiPath("/login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Store user email in localStorage
          localStorage.setItem("userEmail", email);
          showMessage(
            "loginMessage",
            "Login successful! Redirecting…",
            "success",
            1500
          );
          // Give the user a brief moment to see the message, then redirect
          setTimeout(() => {
            window.location.href = "/menu.html";
          }, 600);
        } else {
          showMessage("loginMessage", result.message || "Login failed", "error");
        }
      } catch (error) {
        console.error("Login error:", error);
        showMessage("loginMessage", "Login failed. Please try again.", "error");
      }
    });
  }
});