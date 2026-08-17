/* =========================================
   NOVA AI - COMPLETE CHATBOT
========================================= */

const chatbot = document.getElementById("chatbot");
const chatButton = document.getElementById("chatButton");
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const voiceBtn = document.getElementById("voiceBtn");

const STORAGE_KEY = "nova_ai_chat_history";


// =========================================
// OPEN / CLOSE
// =========================================

function openChatbot() {
    chatbot.style.display = "flex";
    chatButton.style.display = "none";
    userInput.focus();
}

function closeChatbot() {
    chatbot.style.display = "none";
    chatButton.style.display = "flex";
}


// =========================================
// SEND MESSAGE
// =========================================

function sendMessage() {

    const message = userInput.value.trim();

    if (!message) return;

    addMessage(message, "user");

    userInput.value = "";

    showTyping();

    setTimeout(() => {

        removeTyping();

        const response = getBotResponse(message);

        addMessage(response, "bot");

        speakText(response);

    }, 600);
}


// =========================================
// QUICK MESSAGE
// =========================================

function sendQuickMessage(message) {

    userInput.value = message;

    sendMessage();
}


// =========================================
// ADD MESSAGE
// =========================================

function addMessage(message, sender, save = true) {

    if (sender === "bot") {

        const container = document.createElement("div");

        container.className = "bot-container";

        const messageElement =
            document.createElement("div");

        messageElement.className =
            "message bot-message";

        messageElement.textContent = message;

        const actions =
            document.createElement("div");

        actions.className =
            "message-actions";

        actions.innerHTML = `
            <button onclick="copyMessage(this)" title="Copy">
                📋
            </button>

            <button onclick="speakMessage(this)" title="Listen">
                🔊
            </button>

            <button onclick="giveFeedback('up')" title="Helpful">
                👍
            </button>

            <button onclick="giveFeedback('down')" title="Not helpful">
                👎
            </button>
        `;

        container.appendChild(messageElement);
        container.appendChild(actions);

        chatMessages.appendChild(container);

    } else {

        const messageElement =
            document.createElement("div");

        messageElement.className =
            "message user-message";

        messageElement.textContent = message;

        chatMessages.appendChild(messageElement);
    }

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

    if (save) {
        saveMessage(message, sender);
    }
}


// =========================================
// LOCAL STORAGE
// =========================================

function saveMessage(message, sender) {

    const history =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

    history.push({
        message,
        sender
    });

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
    );
}


function loadChatHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

    if (!history || history.length === 0) {
        return;
    }

    chatMessages.innerHTML = "";

    history.forEach(item => {

        addMessage(
            item.message,
            item.sender,
            false
        );

    });
}


// =========================================
// CLEAR CHAT
// =========================================

function clearChat() {

    localStorage.removeItem(STORAGE_KEY);

    chatMessages.innerHTML = `
        <div class="welcome-message">

            <div class="welcome-icon">
                ✦
            </div>

            <h3>Hello! 👋</h3>

            <p>
                I'm Nova, your AI assistant.
                Ask me anything about our services.
            </p>

        </div>
    `;
}


// =========================================
// TYPING INDICATOR
// =========================================

function showTyping() {

    const typing =
        document.createElement("div");

    typing.id = "typingIndicator";

    typing.className =
        "typing-indicator";

    typing.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    chatMessages.appendChild(typing);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


function removeTyping() {

    const typing =
        document.getElementById(
            "typingIndicator"
        );

    if (typing) {
        typing.remove();
    }
}


// =========================================
// VOICE INPUT
// =========================================

let recognition = null;

function startVoiceInput() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert(
            "Voice input is not supported in this browser. " +
            "Please use Google Chrome or Microsoft Edge."
        );

        return;
    }

    if (recognition) {
        recognition.stop();
        recognition = null;
        return;
    }

    recognition =
        new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.continuous = false;

    recognition.onstart = function () {

        voiceBtn.classList.add("listening");

        voiceBtn.textContent = "🔴";
    };

    recognition.onresult =
        function(event) {

            const transcript =
                event.results[0][0].transcript;

            userInput.value = transcript;

        };

    recognition.onerror =
        function() {

            alert(
                "Sorry, I couldn't understand your voice."
            );

        };

    recognition.onend =
        function() {

            voiceBtn.classList.remove(
                "listening"
            );

            voiceBtn.textContent = "🎤";

            recognition = null;
        };

    recognition.start();
}


// =========================================
// TEXT TO SPEECH
// =========================================

function speakText(text) {

    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.rate = 1;

    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


function speakMessage(button) {

    const message =
        button
            .parentElement
            .previousElementSibling
            .textContent;

    speakText(message);
}


// =========================================
// COPY RESPONSE
// =========================================

function copyMessage(button) {

    const message =
        button
            .parentElement
            .previousElementSibling
            .textContent;

    navigator.clipboard.writeText(message);

    button.textContent = "✅";

    setTimeout(() => {
        button.textContent = "📋";
    }, 1200);
}


// =========================================
// FEEDBACK
// =========================================

function giveFeedback(type) {

    if (type === "up") {

        alert(
            "Thanks! 👍 Your feedback helps improve Nova AI."
        );

    } else {

        alert(
            "Thanks for your feedback. We'll try to improve!"
        );
    }
}


// =========================================
// DOWNLOAD CHAT
// =========================================

function downloadChat() {

    const history =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

    if (history.length === 0) {

        alert("There is no chat history to download.");

        return;
    }

    let text =
        "NOVA AI - CHAT HISTORY\n";

    text +=
        "========================\n\n";

    history.forEach(item => {

        const name =
            item.sender === "user"
                ? "You"
                : "Nova AI";

        text +=
            `${name}: ${item.message}\n\n`;

    });

    const blob =
        new Blob(
            [text],
            { type: "text/plain" }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "nova-ai-chat-history.txt";

    link.click();

    URL.revokeObjectURL(url);
}


// =========================================
// DARK / LIGHT MODE
// =========================================

function toggleTheme() {

    document.body.classList.toggle("dark");

    const darkMode =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "nova_theme",
        darkMode ? "dark" : "light"
    );
}


function loadTheme() {

    const theme =
        localStorage.getItem("nova_theme");

    if (theme === "dark") {
        document.body.classList.add("dark");
    }
}


// =========================================
// NORMALIZE TEXT
// =========================================

function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[!?.,]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}


function containsAny(text, keywords) {

    return keywords.some(
        keyword => text.includes(keyword)
    );
}


// =========================================
// CHATBOT KNOWLEDGE
// =========================================

function getBotResponse(message) {

    const input =
        normalizeText(message);


    // GREETING

    if (
        containsAny(input, [
            "hello",
            "hi",
            "hey",
            "hai",
            "good morning",
            "good afternoon",
            "good evening"
        ])
    ) {

        return (
            "Hello! 👋 Welcome to Nova AI. " +
            "How can I help you today?"
        );
    }


    // HOW ARE YOU

    if (
        containsAny(input, [
            "how are you",
            "how r u",
            "are you fine"
        ])
    ) {

        return (
            "I'm doing great! 😊 Thanks for asking. " +
            "How can I help you?"
        );
    }


    // NAME

    if (
        containsAny(input, [
            "your name",
            "who are you",
            "what are you called"
        ])
    ) {

        return (
            "I'm Nova AI ✦, your smart customer support assistant."
        );
    }


    // ABOUT

    if (
        containsAny(input, [
            "about you",
            "about nova",
            "about this chatbot",
            "what is this chatbot"
        ])
    ) {

        return (
            "Nova AI is a retrieval-based customer support chatbot " +
            "designed to provide quick answers using predefined " +
            "knowledge patterns."
        );
    }


    // SERVICES

    if (
        containsAny(input, [
            "service",
            "services",
            "what do you offer",
            "what do you provide",
            "what can you do",
            "what can you help"
        ])
    ) {

        return (
            "We provide smart customer support, service guidance, " +
            "instant information and FAQ assistance."
        );
    }


    // FEATURES

    if (
        containsAny(input, [
            "feature",
            "features",
            "capabilities"
        ])
    ) {

        return (
            "Nova AI supports instant responses, smart retrieval, " +
            "voice input, voice responses, chat history, feedback, " +
            "dark mode and downloadable conversations."
        );
    }


    // WORKING HOURS

    if (
        containsAny(input, [
            "working hours",
            "opening hours",
            "business hours",
            "when are you open",
            "what time do you open",
            "what time do you close"
        ])
    ) {

        return (
            "Our customer support is available Monday to Saturday, " +
            "from 9:00 AM to 6:00 PM."
        );
    }


    // PRICING

    if (
        containsAny(input, [
            "price",
            "pricing",
            "cost",
            "how much",
            "fee",
            "charge"
        ])
    ) {

        return (
            "Our pricing depends on the service you choose. " +
            "Please contact our support team for detailed pricing."
        );
    }


    // CONTACT

    if (
        containsAny(input, [
            "contact",
            "phone",
            "email",
            "mail",
            "reach you"
        ])
    ) {

        return (
            "You can contact our support team at " +
            "support@example.com or call +91 98765 43210."
        );
    }


    // LOCATION

    if (
        containsAny(input, [
            "location",
            "address",
            "where are you"
        ])
    ) {

        return (
            "Our customer support is available online. " +
            "Please contact our team for detailed location information."
        );
    }


    // SUPPORT

    if (
        containsAny(input, [
            "help",
            "support",
            "assistance",
            "can you help"
        ])
    ) {

        return (
            "Absolutely! 😊 I can help with services, pricing, " +
            "working hours, features, contact information and more."
        );
    }


    // PROBLEM

    if (
        containsAny(input, [
            "problem",
            "issue",
            "complaint",
            "not working"
        ])
    ) {

        return (
            "I'm sorry you're experiencing a problem. 😔 " +
            "Please contact our support team with the details."
        );
    }


    // FEEDBACK

    if (
        containsAny(input, [
            "feedback",
            "review",
            "suggestion"
        ])
    ) {

        return (
            "We appreciate your feedback! ⭐ " +
            "Your suggestions help us improve."
        );
    }


    // JOKE

    if (
        containsAny(input, [
            "joke",
            "funny",
            "make me laugh"
        ])
    ) {

        return (
            "Why did the programmer quit his job? 😂\n\n" +
            "Because he didn't get arrays! 😄"
        );
    }


    // THANK YOU

    if (
        containsAny(input, [
            "thank you",
            "thanks",
            "appreciate it"
        ])
    ) {

        return (
            "You're very welcome! 😊"
        );
    }


    // GOODBYE

    if (
        containsAny(input, [
            "bye",
            "goodbye",
            "see you"
        ])
    ) {

        return (
            "Goodbye! 👋 Have a wonderful day!"
        );
    }


    // FALLBACK

    return (
        "Hmm 🤔 I don't have a specific answer for that yet.\n\n" +
        "Try asking me about Services, Pricing, Working Hours, " +
        "Features, Support, Contact, Location or ask me for a joke! 😄"
    );
}


// =========================================
// ENTER KEY
// =========================================

userInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            sendMessage();
        }

    }
);


// =========================================
// SCROLL
// =========================================

function scrollToFeatures() {

    document
        .getElementById("features")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// =========================================
// LOAD
// =========================================

loadChatHistory();

loadTheme();