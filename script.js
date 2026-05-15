/* ============================================================
   FLOATING BUBBLES — Background Animation
   ============================================================ */
(function () {
  const canvas = document.getElementById("bg-canvas");
  const ctx    = canvas.getContext("2d");
  let W, H, bubbles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeBubble(startAtBottom = false) {
    return {
      x:     Math.random() * W,
      y:     startAtBottom ? H + Math.random() * 80 : Math.random() * H,
      r:     Math.random() * 18 + 6,
      dy:    -(Math.random() * 0.5 + 0.2),
      dx:    (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.3 + 0.08,
      hue:   Math.random() * 60 + 200,   // blue-purple range
    };
  }

  function init() {
    resize();
    bubbles = [];
    const count = Math.min(40, Math.floor(W / 22));
    for (let i = 0; i < count; i++) bubbles.push(makeBubble(false));
  }

  init();
  window.addEventListener("resize", init);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    bubbles.forEach((b) => {
      // Draw bubble
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle   = `hsla(${b.hue},75%,78%,${b.alpha})`;
      ctx.fill();
      ctx.strokeStyle = `hsla(${b.hue},80%,88%,${b.alpha * 1.8})`;
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Shine highlight
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.28, b.y - b.r * 0.28, b.r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${b.hue},90%,96%,${b.alpha * 2.2})`;
      ctx.fill();

      // Move
      b.y += b.dy;
      b.x += b.dx;

      // Reset when bubble floats off top
      if (b.y + b.r < 0) {
        Object.assign(b, makeBubble(true));
      }
      // Wrap horizontally
      if (b.x - b.r > W) b.x = -b.r;
      if (b.x + b.r < 0) b.x = W + b.r;
    });

    requestAnimationFrame(draw);
  }

  draw();
})();


/* ============================================================
   FIREBASE SETUP
   ============================================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey:            "AIzaSyDv4W65PIJxI2JPCM2c5fHtutoEVLRxFNg",
  authDomain:        "todo-40515.firebaseapp.com",
  projectId:         "todo-40515",
  storageBucket:     "todo-40515.firebasestorage.app",
  messagingSenderId: "539722868518",
  appId:             "1:539722868518:web:c711f62efa41a05fcf03e7",
  measurementId:     "G-9XX4SSFH7N",
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);


/* ============================================================
   HELPERS
   ============================================================ */
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  ["loginError", "signupError"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}

function friendlyError(code) {
  const map = {
    "auth/user-not-found":       "No account found with this email.",
    "auth/wrong-password":       "Incorrect password. Try again.",
    "auth/invalid-email":        "Please enter a valid email address.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/weak-password":        "Password must be at least 6 characters.",
    "auth/invalid-credential":   "Invalid email or password.",
    "auth/too-many-requests":    "Too many attempts. Please try later.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.textContent    = loading ? "Please wait…" : btn.dataset.label;
  btn.disabled       = loading;
  btn.classList.toggle("loading", loading);
}

// Store original button labels
["loginBtn", "signupBtn"].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.dataset.label = btn.textContent;
});


/* ============================================================
   AUTH STATE — show/hide views
   ============================================================ */
onAuthStateChanged(auth, (user) => {
  const authWrap = document.getElementById("authWrap");
  const todoWrap = document.getElementById("todoWrap");
  if (user) {
    authWrap.classList.add("hidden");
    todoWrap.classList.remove("hidden");
    updateEmptyMsg();
  } else {
    authWrap.classList.remove("hidden");
    todoWrap.classList.add("hidden");
  }
});


/* ============================================================
   FORM TOGGLE (Login ↔ Signup) with animation
   ============================================================ */
function swapForms(hideId, showId) {
  const hideEl = document.getElementById(hideId);
  const showEl = document.getElementById(showId);
  clearErrors();

  hideEl.classList.add("form-exit");
  setTimeout(() => {
    hideEl.classList.add("hidden");
    hideEl.classList.remove("form-exit");
    showEl.classList.remove("hidden");
    showEl.classList.add("form-enter");
    setTimeout(() => showEl.classList.remove("form-enter"), 350);
  }, 200);
}

document.getElementById("showSignup").addEventListener("click", () =>
  swapForms("loginForm", "signupForm")
);
document.getElementById("showLogin").addEventListener("click", () =>
  swapForms("signupForm", "loginForm")
);


/* ============================================================
   SIGN UP
   ============================================================ */
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const email    = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) {
    showError("signupError", "Please fill in all fields.");
    return;
  }

  setLoading("signupBtn", true);

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged handles UI switch
  } catch (err) {
    showError("signupError", friendlyError(err.code));
  } finally {
    setLoading("signupBtn", false);
  }
});


/* ============================================================
   LOGIN
   ============================================================ */
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const email    = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showError("loginError", "Please fill in all fields.");
    return;
  }

  setLoading("loginBtn", true);

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged handles UI switch
  } catch (err) {
    showError("loginError", friendlyError(err.code));
  } finally {
    setLoading("loginBtn", false);
  }
});


/* ============================================================
   LOGOUT
   ============================================================ */
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Logout error:", err);
  }
});


/* ============================================================
   TODO LOGIC
   ============================================================ */
const inputText     = document.getElementById("inputText");
const addTaskBtn    = document.getElementById("addTask");
const taskContainer = document.getElementById("taskContainer");

function updateEmptyMsg() {
  const emptyMsg = document.getElementById("emptyMsg");
  if (!emptyMsg) return;
  emptyMsg.classList.toggle("hidden", taskContainer.children.length > 0);
}

function createTaskEl(text) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("newtask");

  // Checkbox
  const check = document.createElement("input");
  check.type = "checkbox";
  check.setAttribute("aria-label", "Mark task complete");
  check.addEventListener("change", () => {
    taskDiv.classList.toggle("completed", check.checked);
  });

  // Label
  const span = document.createElement("span");
  span.textContent = text;

  // Delete button
  const del = document.createElement("button");
  del.textContent = "Delete";
  del.classList.add("del-btn");
  del.setAttribute("aria-label", "Delete task");
  del.addEventListener("click", () => {
    taskDiv.style.opacity   = "0";
    taskDiv.style.transform = "translateX(12px)";
    taskDiv.style.transition = "opacity 0.25s, transform 0.25s";
    setTimeout(() => {
      taskDiv.remove();
      updateEmptyMsg();
    }, 260);
  });

  taskDiv.append(check, span, del);
  return taskDiv;
}

function addTask() {
  const text = inputText.value.trim();

  if (!text) {
    // Shake input instead of alert
    inputText.style.borderColor = "#e53e3e";
    inputText.style.boxShadow   = "0 0 0 3px rgba(229,62,62,0.15)";
    inputText.focus();
    setTimeout(() => {
      inputText.style.borderColor = "";
      inputText.style.boxShadow   = "";
    }, 900);
    return;
  }

  taskContainer.appendChild(createTaskEl(text));
  inputText.value = "";
  inputText.focus();
  updateEmptyMsg();
}

addTaskBtn.addEventListener("click", addTask);

// Enter key to add task
inputText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});