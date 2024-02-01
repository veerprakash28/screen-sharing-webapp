const ipcRenderer = require("electron").ipcRenderer;
const codeContainer = document.getElementById("codeContainer");
const codeElement = document.getElementById("code");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const copyButton = document.querySelector(".copyButton");

let shareInProgress = false;

function resetUI() {
  startButton.style.display = "block";
  stopButton.style.display = "none";
  codeContainer.style.display = "none";
  copyButton.style.display = "none";
}

window.onload = function () {
  ipcRenderer.on("uuid", (event, data) => {
    codeElement.innerHTML = data;
  });

  resetUI(); // Set initial UI state
};

function startShare() {
  ipcRenderer.send("start-share", {});
  shareInProgress = true;
  startButton.style.display = "none";
  stopButton.style.display = "block";
  codeContainer.style.display = "flex"; // Show the code container
  copyButton.style.display = "block"; // Show the copy button
}

function stopShare() {
  ipcRenderer.send("stop-share", {});
  shareInProgress = false;
  resetUI(); // Reset UI to initial state
  codeElement.innerHTML = "";
}

function copyCode() {
  const codeText = codeElement.innerText.trim();

  if (codeText !== "") {
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = codeText;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);

    // Change the color of the button temporarily
    copyButton.style.backgroundColor = "green";
    copyButton.innerHTML = "Copied!";
    setTimeout(() => {
      copyButton.style.backgroundColor = "#4148ae";
      copyButton.innerHTML = "Copy";
    }, 3000);
  }
}
