// sign-up.js - Complete frontend logic for all forms

// Form visibility functions
function showSignupForm() {
  document.getElementById("signupForm").classList.add("active");
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("resetForm").classList.remove("active");
  // document.getElementById("verificationSignup").style.display = "none"; // disabled
}

function showLogin() {
  document.getElementById("signupForm").classList.remove("active");
  document.getElementById("loginForm").classList.add("active");
  document.getElementById("resetForm").classList.remove("active");
}

function showResetForm() {
  document.getElementById("signupForm").classList.remove("active");
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("resetForm").classList.add("active");
  document.getElementById("resetStep1").style.display = "block";
  document.getElementById("resetStep2").style.display = "none";
}

// Global variables to store form data
let currentSignupEmail = "";
let currentResetEmail = "";

// Signup form handler
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
  const signupForm = document.querySelector(".sign-up");
  const loginForm = document.querySelector(".login-form");

  // Signup form submit
  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const emailInput = document.getElementById("email");

    if (passwordInput.value !== confirmPasswordInput.value) {
      showMessage("signupMessage", "Passwords do not match!", "error");
      return;
    }

    const email = emailInput.value;
    currentSignupEmail = email;

    try {
      // Simple signup: call /signup directly (no email verification)
      const phone = document.getElementById("phone-number").value;
      const password = document.getElementById("password").value;
      const response = await fetch(apiPath("/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, password }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.success) {
        showMessage("signupMessage", "Account created. You can now log in.", "success", 3000);
        signupForm.reset();
        showLogin();
      } else {
        showMessage("signupMessage", result.message || "Signup failed", "error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      showMessage("signupMessage", "Signup failed. Please try again.", "error");
    }
  });

  // Login form submit
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
        showMessage("loginMessage", "Login successful! Redirecting…", "success", 1500);
        // Give the user a brief moment to see the message, then redirect
        setTimeout(() => {
          window.location.href = "index.html";
        }, 600);
      } else {
        showMessage("loginMessage", result.message || "Login failed", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showMessage("loginMessage", "Login failed. Please try again.", "error");
    }
  });
});

// Simple password reset without code
function resetPasswordSimple() {
  const email = document.getElementById("resetEmail").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword = document.getElementById("confirmNewPassword").value;

  if (!email) {
    showMessage("resetMessage", "Please enter your email", "error");
    return;
  }
  if (newPassword !== confirmNewPassword) {
    showMessage("resetSimpleMessage", "New passwords do not match", "error");
    return;
  }

  fetch(apiPath("/reset-password"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        showMessage("resetSimpleMessage", "Password reset successful! You can now log in.", "success", 4000);
        showLogin();
      } else {
        showMessage("resetSimpleMessage", result.message || "Reset failed", "error");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showMessage("resetSimpleMessage", "Reset failed", "error");
    });
}
