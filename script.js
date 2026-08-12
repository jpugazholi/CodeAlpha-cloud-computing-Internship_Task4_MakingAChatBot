/*NOVA AI - SMART RETRIEVAL CHATBOT
   CodeAlpha Internship - Task 4*/

const chatbot = document.getElementById("chatbot");
const chatButton = document.getElementById("chatButton");
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");

const CHAT_STORAGE_KEY = "nova_ai_chat_history";

// OPEN / CLOSE

function openChatbot() {
    chatbot.style.display = "flex";
    chatButton.style.display = "none";
    userInput.focus();
}


function closeChatbot() {
    chatbot.style.display = "none";
    chatButton.style.display = "flex";
}

// SEND MESSAGE

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

    }, 600);
}

// QUICK MESSAGE

function sendQuickMessage(message) {

    userInput.value = message;

    sendMessage();
}


// ADD MESSAGE

function addMessage(message, sender, save = true) {

    const messageElement = document.createElement("div");

    messageElement.classList.add("message");

    if (sender === "user") {
        messageElement.classList.add("user-message");
    } else {
        messageElement.classList.add("bot-message");
    }

    messageElement.textContent = message;

    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (save) {
        saveMessage(message, sender);
    }
}


// LOCAL STORAGE

function saveMessage(message, sender) {

    let history =
        JSON.parse(
            localStorage.getItem(CHAT_STORAGE_KEY)
        ) || [];

    history.push({
        message: message,
        sender: sender
    });

    localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(history)
    );
}


function loadChatHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(CHAT_STORAGE_KEY)
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


// CLEAR CHAT

function clearChat() {

    localStorage.removeItem(CHAT_STORAGE_KEY);

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

    userInput.focus();
}


// TYPING INDICATOR

function showTyping() {

    const typing = document.createElement("div");

    typing.id = "typingIndicator";

    typing.classList.add("typing-indicator");

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
        document.getElementById("typingIndicator");

    if (typing) {
        typing.remove();
    }
}


// TEXT NORMALIZATION

function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[!?.,]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}


// KEYWORD MATCHING

function containsAny(text, keywords) {

    return keywords.some(keyword =>
        text.includes(keyword)
    );
}


// SMART RETRIEVAL CHATBOT

function getBotResponse(message) {

    const input = normalizeText(message);


    // GREETING

    if (
        containsAny(input, [
            "hello",
            "hi",
            "hey",
            "good morning",
            "good afternoon",
            "good evening",
            "hai"
        ])
    ) {

        return (
            "Hello! 👋 Welcome to Nova AI. " +
            "I'm here to help you with services, pricing, " +
            "support, contact details and more."
        );
    }


    // HOW ARE YOU

    if (
        containsAny(input, [
            "how are you",
            "how r u",
            "how are u",
            "are you fine",
            "are you okay"
        ])
    ) {

        return (
            "I'm doing great! 😊 Thanks for asking. " +
            "How can I help you today?"
        );
    }


    // NAME

    if (
        containsAny(input, [
            "your name",
            "who are you",
            "what are you called",
            "what is your name"
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
            "what is this chatbot",
            "tell me about yourself"
        ])
    ) {

        return (
            "Nova AI is a retrieval-based customer support chatbot " +
            "designed to provide quick answers to common questions " +
            "through predefined knowledge patterns."
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
            "what can you help",
            "offerings"
        ])
    ) {

        return (
            "We provide smart customer support, instant information, " +
            "service guidance, FAQ assistance and general customer help."
        );
    }


    // FEATURES

    if (
        containsAny(input, [
            "feature",
            "features",
            "capabilities",
            "what can this chatbot do"
        ])
    ) {

        return (
            "Nova AI includes instant responses, predefined query patterns, " +
            "quick questions, typing indicators, chat history, clear chat " +
            "and responsive design."
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
            "what time do you close",
            "office hours"
        ])
    ) {

        return (
            "Our customer support is available Monday to Saturday, " +
            "from 9:00 AM to 6:00 PM."
        );
    }


    // SATURDAY

    if (
        input.includes("saturday")
    ) {

        return (
            "Yes! 😊 Our support service is available on Saturday, " +
            "from 9:00 AM to 6:00 PM."
        );
    }


    // SUNDAY

    if (
        input.includes("sunday")
    ) {

        return (
            "Our regular support hours are Monday to Saturday, " +
            "9:00 AM to 6:00 PM."
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
            "charge",
            "rate"
        ])
    ) {

        return (
            "Our pricing depends on the service you choose. " +
            "Please contact our support team for detailed pricing information."
        );
    }


    // CONTACT

    if (
        containsAny(input, [
            "contact",
            "phone",
            "telephone",
            "email",
            "mail",
            "customer care",
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
            "where are you",
            "where is your office"
        ])
    ) {

        return (
            "Our customer support is available online. " +
            "Please contact our team for detailed location information."
        );
    }


    // SUPPORT / HELP

    if (
        containsAny(input, [
            "help",
            "support",
            "assistance",
            "need assistance",
            "can you help"
        ])
    ) {

        return (
            "Absolutely! 😊 I can help you with services, pricing, " +
            "working hours, features, contact information and general questions."
        );
    }


    // PROBLEM / COMPLAINT

    if (
        containsAny(input, [
            "problem",
            "issue",
            "complaint",
            "not working",
            "something went wrong"
        ])
    ) {

        return (
            "I'm sorry you're experiencing a problem. 😔 " +
            "Please contact our support team and describe the issue " +
            "so we can assist you."
        );
    }


    // FEEDBACK

    if (
        containsAny(input, [
            "feedback",
            "review",
            "suggestion",
            "rate your service"
        ])
    ) {

        return (
            "We really appreciate your feedback! ⭐ " +
            "Your suggestions help us improve the customer experience."
        );
    }


    // JOKE

    if (
        containsAny(input, [
            "joke",
            "funny",
            "make me laugh",
            "something funny"
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
            "thank",
            "appreciate it"
        ])
    ) {

        return (
            "You're very welcome! 😊 " +
            "I'm always happy to help."
        );
    }


    // GOODBYE

    if (
        containsAny(input, [
            "bye",
            "goodbye",
            "see you",
            "see ya"
        ])
    ) {

        return (
            "Goodbye! 👋 Have a wonderful day!"
        );
    }


    // DEFAULT FALLBACK

    return (
        "Hmm 🤔 I don't have a specific answer for that yet.\n\n" +
        "Try asking me about:\n" +
        "• Services\n" +
        "• Pricing\n" +
        "• Working hours\n" +
        "• Features\n" +
        "• Contact details\n" +
        "• Support\n" +
        "• Location\n" +
        "• Or ask me for a joke! 😄"
    );
}


// ENTER KEY

userInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            sendMessage();
        }

    }
);


// SCROLL TO FEATURES

function scrollToFeatures() {

    const features =
        document.getElementById("features");

    if (features) {

        features.scrollIntoView({
            behavior: "smooth"
        });

    }
}


// LOAD CHAT HISTORY

loadChatHistory();