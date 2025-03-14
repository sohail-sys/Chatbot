document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.querySelector(".chat-box");
    const emailInput = document.getElementById("email");
    const commentInput = document.getElementById("comment");
    const addButton = document.querySelector("button");

    let storedChat = localStorage.getItem("chat");
    let messages = [];

    try {
        messages = storedChat ? JSON.parse(storedChat) : [];
    } catch (error) {
        console.error("Invalid JSON in localStorage. Resetting chat history.");
        localStorage.removeItem("chat");
    }

    function getGravatarUrl(email) {
        const emailHash = md5(email.trim().toLowerCase());
        return `https://www.gravatar.com/avatar/${emailHash}?s=50&d=identicon`;
    }

    function displayMessages() {
        chatBox.innerHTML = ""; // Clear the chat box before reloading messages
        messages.forEach(msg => {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message");

            // Create Gravatar Image
            const gravatarImg = document.createElement("img");
            gravatarImg.src = getGravatarUrl(msg.email);
            gravatarImg.classList.add("avatar");
            gravatarImg.alt = "User Avatar";

            // Create message content (ONLY text, no name)
            const messageContent = document.createElement("div");
            messageContent.classList.add("message-content");
            messageContent.textContent = msg.text; // Show only text

            messageDiv.appendChild(gravatarImg);
            messageDiv.appendChild(messageContent);
            chatBox.appendChild(messageDiv);
        });
    }

    function addComment() {
        const email = emailInput.value.trim();
        const comment = commentInput.value.trim();

        if (email && comment) {
            const newMessage = { email, text: comment };
            messages.push(newMessage); // Store as object

            localStorage.setItem("chat", JSON.stringify(messages)); // Save structured data
            displayMessages(); // Refresh chat box

            // Clear inputs
            commentInput.value = "";
        }
    }

    addButton.addEventListener("click", addComment);
    displayMessages(); // Load messages on page load
});
