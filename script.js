const GIPHY_API_KEY = "ouX22sPmm2Jrck0XOh5EvUdXEgrOkWPa";
let offset = 0;
let gifs = [];
let selectedGifUrl = "";

// Open and close the GIF modal
document.getElementById("openGifModal").addEventListener("click", () => {
    document.getElementById("gif-modal").style.display = "block";
});

document.getElementById("closeGifModal").addEventListener("click", () => {
    document.getElementById("gif-modal").style.display = "none";
});

// Handle GIF search and navigation
document.getElementById("gifSearchBtn").addEventListener("click", fetchGifs);
document.getElementById("prevGif").addEventListener("click", () => {
    if (offset > 0) {
        offset -= 1;
        updateGifDisplay();
    }
});
document.getElementById("nextGif").addEventListener("click", () => {
    if (offset < gifs.length - 1) {
        offset += 1;
        updateGifDisplay();
    }
});

document.getElementById("submitGif").addEventListener("click", () => {
    if (selectedGifUrl) {
        addMessage(selectedGifUrl, true);
        document.getElementById("gif-modal").style.display = "none";
    }
});

// Save user email and comment in localStorage
const emailInput = document.getElementById("email");
const commentInput = document.getElementById("comment");

emailInput.addEventListener("input", () => {
    localStorage.setItem("email", emailInput.value);
});

commentInput.addEventListener("input", () => {
    localStorage.setItem("comment", commentInput.value);
});

// Fetch GIFs from Giphy API
async function fetchGifs() {
    const searchTerm = document.getElementById("gifSearchInput").value;
    if (!searchTerm) return;

    const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${GIPHY_API_KEY}&limit=5`
    );
    const { data } = await res.json();

    gifs = data;
    offset = 0;
    updateGifDisplay();
}

// Display the selected GIF
function updateGifDisplay() {
    if (gifs.length > 0) {
        selectedGifUrl = gifs[offset].images.fixed_height.url;
        document.getElementById("gifContainer").innerHTML = `<img src="${selectedGifUrl}" alt="GIF">`;
    }
}

// Add a text or GIF message to the chat box
function addMessage(content, isGif) {
    const email = emailInput.value.trim();
    if (!email) return;

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    const gravatarImg = document.createElement("img");
    gravatarImg.src = `https://www.gravatar.com/avatar/${md5(email.toLowerCase())}?s=50&d=identicon`;
    gravatarImg.classList.add("avatar");

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.innerHTML = isGif ? `<img src="${content}" alt="GIF">` : content;

    messageDiv.appendChild(gravatarImg);
    messageDiv.appendChild(messageContent);
    document.querySelector(".chat-box").appendChild(messageDiv);
    document.querySelector(".chat-box").scrollTop = document.querySelector(".chat-box").scrollHeight;

    // Save messages in localStorage
    let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.push({ email, content, isGif });
    localStorage.setItem("chatMessages", JSON.stringify(messages));
}

// Load stored chat messages and form inputs when the page loads
function loadChatData() {
    let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.forEach(({ email, content, isGif }) => addMessage(content, isGif));

    if (localStorage.getItem("email")) {
        emailInput.value = localStorage.getItem("email");
    }
    if (localStorage.getItem("comment")) {
        commentInput.value = localStorage.getItem("comment");
    }
}

document.addEventListener("DOMContentLoaded", loadChatData);

// Handle adding a new text message
document.getElementById("addComment").addEventListener("click", () => {
    const email = emailInput.value.trim();
    const comment = commentInput.value.trim();
    if (email && comment) {
        addMessage(comment, false);
        commentInput.value = "";
        localStorage.setItem("comment", ""); // Clear saved comment
    }
});
