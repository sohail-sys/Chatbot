document.addEventListener("DOMContentLoaded", () => {
    loadChatData();
    setupTypingIndicator();
    setupEventListeners();
});

const GIPHY_API_KEY = "ouX22sPmm2Jrck0XOh5EvUdXEgrOkWPa";
let offset = 0, gifs = [], selectedGifUrl = "";
const emailInput = document.getElementById("email");
const commentInput = document.getElementById("comment");
const chatBox = document.querySelector(".chat-box");

// Sets up a typing indicator that appears when the user types a comment
function setupTypingIndicator() {
    const typingIndicator = document.createElement("div");
    typingIndicator.id = "typingIndicator";
    typingIndicator.textContent = "User is typing...";
    Object.assign(typingIndicator.style, { display: "none", fontStyle: "italic", color: "gray", fontSize: "12px" });
    chatBox.appendChild(typingIndicator);

    commentInput.addEventListener("input", () => {
        typingIndicator.style.display = commentInput.value.trim() ? "block" : "none";
    });
}

// Attaches event listeners to different buttons and inputs
function setupEventListeners() {
    document.getElementById("openGifModal").addEventListener("click", () => toggleModal("gif-modal", true));
    document.getElementById("closeGifModal").addEventListener("click", () => toggleModal("gif-modal", false));
    document.getElementById("gifSearchBtn").addEventListener("click", fetchGifs);
    document.getElementById("prevGif").addEventListener("click", () => navigateGif(-1));
    document.getElementById("nextGif").addEventListener("click", () => navigateGif(1));
    document.getElementById("submitGif").addEventListener("click", () => { if (selectedGifUrl) addMessage(selectedGifUrl, true); toggleModal("gif-modal", false); });
    document.getElementById("addComment").addEventListener("click", submitComment);
    emailInput.addEventListener("input", () => localStorage.setItem("email", emailInput.value));
    commentInput.addEventListener("input", () => localStorage.setItem("comment", commentInput.value));
}

// Fetches GIFs from Giphy API based on user search input
async function fetchGifs() {
    const searchTerm = document.getElementById("gifSearchInput").value;
    if (!searchTerm) return;
    const res = await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${GIPHY_API_KEY}&limit=5`);
    gifs = (await res.json()).data;
    offset = 0;
    updateGifDisplay();
}

// Navigates through fetched GIFs
function navigateGif(direction) {
    offset = Math.max(0, Math.min(offset + direction, gifs.length - 1));
    updateGifDisplay();
}

// Updates the displayed GIF in the modal
function updateGifDisplay() {
    if (gifs.length) {
        selectedGifUrl = gifs[offset].images.fixed_height.url;
        document.getElementById("gifContainer").innerHTML = `<img src="${selectedGifUrl}" alt="GIF">`;
    }
}

// Adds a new message (text or GIF) to the chat
function addMessage(content, isGif, isNew = true) {
    if (!emailInput.value.trim()) return;
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.innerHTML = `
        <div class="message-wrapper">
            <img src="https://www.gravatar.com/avatar/${md5(emailInput.value.toLowerCase())}?s=50&d=identicon" class="avatar">
            <div class="message-content">${isGif ? `<img src="${content}" alt="GIF">` : content}</div>
            <button class="delete-btn">🗑️</button>
        </div>`;
    
    // Attach delete event to remove the message when clicked
    messageDiv.querySelector(".delete-btn").addEventListener("click", () => deleteMessage(messageDiv, content, isGif));
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    document.getElementById("typingIndicator").style.display = "none";
    
    // Save message to local storage if it's new
    if (isNew) {
        let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
        messages.push({ email: emailInput.value, content, isGif });
        localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
}

// Deletes a message from chat and removes it from local storage
function deleteMessage(element, content, isGif) {
    let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages = messages.filter(msg => msg.content !== content || msg.isGif !== isGif);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    element.remove();
}

// Loads chat messages from local storage on page load
function loadChatData() {
    JSON.parse(localStorage.getItem("chatMessages"))?.forEach(({ content, isGif }) => addMessage(content, isGif, false));
    emailInput.value = localStorage.getItem("email") || "";
    commentInput.value = localStorage.getItem("comment") || "";
}

// Handles adding a new comment when the user submits
function submitComment() {
    if (emailInput.value.trim() && commentInput.value.trim()) {
        addMessage(commentInput.value, false);
        commentInput.value = "";
        document.getElementById("typingIndicator").style.display = "none";
        localStorage.setItem("comment", "");
    }
}

// Toggles the visibility of a modal window
function toggleModal(id, show) {
    document.getElementById(id).style.display = show ? "block" : "none";
}
