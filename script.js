// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDv4W65PIJxI2JPCM2c5fHtutoEVLRxFNg",
  authDomain: "todo-40515.firebaseapp.com",
  projectId: "todo-40515",
  storageBucket: "todo-40515.firebasestorage.app",
  messagingSenderId: "539722868518",
  appId: "1:539722868518:web:c711f62efa41a05fcf03e7",
  measurementId: "G-9XX4SSFH7N",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

document.getElementById("showSignup").addEventListener("click", () => {
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
});

document.getElementById("showLogin").addEventListener("click", () => {
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

document.getElementById("signupbtn").addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Signup Successfully!");
      signupForm.classList.add("hidden");
      loginForm.classList.add("hidden");
    })
    .catch((error) => {
      const errorcode = error.code;
      const errorMessage = error.errormessage;
    });
});

document.getElementById("loginbtn").addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Login Successfully!");
      document.querySelector(".container").style.display = "none";
      document.getElementById("wholecontain").style.display = "block";
    })
    .catch((error) => {
      const errorcode = error.code;
      const errorMessage = error.errormessage;
    });
});

const inputText = document.getElementById("inputText");
const addTask = document.getElementById("addTask");
const taskContainer = document.getElementById("taskContainer");

addTask.addEventListener("click", () => {
  if (inputText.value == "") {
    alert("Enter a task");
    return;
  }

  let taskdiv = document.createElement("div");

  let check = document.createElement("input");
  check.type = "checkbox";
  check.addEventListener("change", () => {
    taskdiv.classList.toggle("completed");
  });

  let span = document.createElement("span");
  span.textContent = inputText.value;

  let del = document.createElement("button");
  del.textContent = "Delete";

  del.onclick = () => {
    taskdiv.remove();
  };

  taskdiv.append(check, span, del);
  taskContainer.appendChild(taskdiv);

  inputText.value = "";

  taskdiv.classList.add("newtask");
});
