// sign-up.js - Signup form logic

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

  // Signup form submit
  if (signupForm) {
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
          showMessage(
            "signupMessage",
            "Account created. You can now log in.",
            "success",
            3000
          );
          signupForm.reset();
          // Redirect to login page after successful signup
          setTimeout(() => {
            window.location.href = "/login.html";
          }, 2000);
        } else {
          showMessage(
            "signupMessage",
            result.message || "Signup failed",
            "error"
          );
        }
      } catch (error) {
        console.error("Signup error:", error);
        showMessage("signupMessage", "Signup failed. Please try again.", "error");
      }
    });
  }
});
