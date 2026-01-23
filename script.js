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
  apiKey: "AIzaSyCFQu6rxoxcoS9tRi6Y2WE3jr-ktbr2dTQ",
  authDomain: "fir-project-d0e90.firebaseapp.com",
  projectId: "fir-project-d0e90",
  storageBucket: "fir-project-d0e90.firebasestorage.app",
  messagingSenderId: "814638945883",
  appId: "1:814638945883:web:934d1d9542b2c89254517e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("User Login Successfully!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});

const inputText = document.getElementById("inputText");
const addTask = document.getElementById("addTask");
const contain = document.getElementById("contain");

addTask.addEventListener("click", () => {
  if (inputText.value == "") {
    alert("Enter a task");
    return;
  }

  let taskdiv = document.createElement("div");

  let check = document.createElement("input");
  check.type = "checkbox";

  let span = document.createElement("span");
  span.textContent = inputText.value;

  let del = document.createElement("button");
  del.textContent = "Delete";

  del.onclick = () => {
    taskdiv.remove();
  };

  taskdiv.append(check, span, del);
  contain.appendChild(taskdiv);

  inputText.value = "";

  taskdiv.classList.add("newtask");
});

let closeicon = document.getElementsByClassName("closeicon")[0];
let loginclass = document.getElementsByClassName("loginclass")[0];

closeicon.addEventListener("click", () => {
  let closediv = document.createElement("closediv");
  loginclass.classList.add("closediv");
});
