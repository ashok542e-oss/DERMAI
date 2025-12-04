document.addEventListener('DOMContentLoaded', () => {

    // ==========================
    // ELEMENTS
    // ==========================
    const chatPopup = document.getElementById('chatPopup');
    const chatIcon = document.getElementById('chatIcon');
    const closeChat = document.getElementById('closeChat');

    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const typingIndicator = document.getElementById('typingIndicator');

    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');


    // ==========================
    // CHAT POPUP BEHAVIOR
    // ==========================
    chatIcon.addEventListener("click", () => {
        chatPopup.classList.add("open");
    });

    closeChat.addEventListener("click", () => {
        chatPopup.classList.remove("open");
    });


    // ==========================
    // UTIL FUNCTIONS
    // ==========================
    function getTime() {
        const now = new Date();
        let h = now.getHours();
        let m = now.getMinutes().toString().padStart(2,'0');
        const am = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return `${h}:${m} ${am}`;
    }

    function scrollDown() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addMessage(text, type) {
        const msg = document.createElement("div");
        msg.classList.add("message", type === "user" ? "user-message" : "bot-message");
        msg.innerHTML = text + `<span class="message-time">${getTime()}</span>`;
        chatMessages.appendChild(msg);
        scrollDown();
    }

    function showTyping() {
        typingIndicator.style.display = "block";
        scrollDown();
    }

    function hideTyping() {
        typingIndicator.style.display = "none";
    }


    // ==========================
    // BOT LOGIC
    // ==========================
    function botResponse(text) {
        const msg = text.toLowerCase();

        if (msg.includes("order")) {
            return "To track your order, please provide your order number. 📦";
        }
        if (msg.includes("return")) {
            return "You can return products within 30 days. Need help starting the return?";
        }
        if (msg.includes("product")) {
            return "I can help with any product-related question. Which product are you asking about?";
        }
        if (msg.includes("technical")) {
            return "Please describe the technical issue you're facing. I'm here to help! ⚙️";
        }

        return "Thank you for your message! How else can I assist you? 😊";
    }


    // ==========================
    // SEND MESSAGE
    // ==========================
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, "user");
        chatInput.value = "";

        showTyping();

        setTimeout(() => {
            hideTyping();
            addMessage(botResponse(text), "bot");
        }, 600);
    }

    sendMessageBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", e => {
        if (e.key === "Enter") sendMessage();
    });


    // ==========================
    // QUICK BUTTONS
    // ==========================
    document.addEventListener("click", e => {
        if (e.target.classList.contains("quick-btn")) {
            const msg = e.target.getAttribute("data-msg");
            chatInput.value = msg;
            sendMessage();
        }
    });


    // ==========================
    // CONTACT FORM
    // ==========================
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show toast message
        successMessage.classList.add("show");

        setTimeout(() => {
            successMessage.classList.remove("show");
        }, 3000);

        contactForm.reset();
    });
});
