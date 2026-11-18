(() => {
    const API = `${window.location.origin}/api`;
    const MAX_QUESTION_LENGTH = 1000;
    const MAX_HISTORY_MESSAGES = 10;
    const conversation = [];
    const messages = document.getElementById("chatMessages");
    const form = document.getElementById("assistantForm");
    const input = document.getElementById("assistantQuestion");
    const sendButton = document.getElementById("sendQuestion");
    const status = document.getElementById("assistantStatus");
    const lengthLabel = document.getElementById("questionLength");

    function addMessage(role, content, options = {}) {
        const article = document.createElement("article");
        article.className = `chat-message chat-message--${role}${options.pending ? " chat-message--pending" : ""}`;
        if (options.id) article.id = options.id;
        const avatar = document.createElement("span");
        avatar.className = "chat-avatar";
        avatar.setAttribute("aria-hidden", "true");
        avatar.textContent = role === "user" ? "U" : "✦";
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble";
        const label = document.createElement("strong");
        label.textContent = role === "user" ? "YOU" : "TRADENOVA ASSISTANT";
        const paragraph = document.createElement("p");
        paragraph.textContent = content;
        bubble.append(label, paragraph);
        article.append(avatar, bubble);
        messages.appendChild(article);
        messages.scrollTop = messages.scrollHeight;
        return article;
    }

    function setStatus(message, isError = false) {
        status.textContent = message;
        status.classList.toggle("assistant-status-error", isError);
    }

    function updateLength() {
        lengthLabel.textContent = `${input.value.length} / ${MAX_QUESTION_LENGTH}`;
    }

    async function sendQuestion(question) {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            setStatus("Please log in to use the AI assistant.", true);
            return;
        }
        if (!question || question.length > MAX_QUESTION_LENGTH) {
            setStatus(`Enter a question of 1-${MAX_QUESTION_LENGTH} characters.`, true);
            return;
        }

        addMessage("user", question);
        const pending = addMessage("assistant", "Thinking through your question…", { pending: true, id: "assistantPending" });
        const history = conversation.slice(-MAX_HISTORY_MESSAGES).map(({ role, content }) => ({ role, content }));
        sendButton.disabled = true;
        input.disabled = true;
        setStatus("Generating an educational answer…");

        try {
            const response = await fetch(`${API}/assistant/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ question, history })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.success || typeof data.answer !== "string") {
                const message = typeof data.message === "string" ? data.message : "";
                if (response.status === 503 && message.includes("GEMINI_API_KEY")) {
                    throw new Error("AI setup required: add GEMINI_API_KEY to server/.env and restart the local server. On Render, add GEMINI_API_KEY under the service's Environment settings and redeploy. Get a key from Google AI Studio; never paste it into this chat or frontend code.");
                }
                throw new Error(message || `The assistant could not respond (${response.status}).`);
            }

            pending.remove();
            addMessage("assistant", data.answer);
            conversation.push({ role: "user", content: question }, { role: "model", content: data.answer });
            conversation.splice(0, Math.max(0, conversation.length - MAX_HISTORY_MESSAGES));
            setStatus("Educational information only. Verify important claims with reliable sources.");
        } catch (error) {
            pending.remove();
            addMessage("assistant", error.message || "The assistant is unavailable right now. Please try again.");
            setStatus(error.message || "The assistant is unavailable right now.", true);
        } finally {
            sendButton.disabled = false;
            input.disabled = false;
            input.focus();
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) return;
        input.value = "";
        updateLength();
        sendQuestion(question);
    });

    input.addEventListener("input", updateLength);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    document.querySelectorAll("[data-prompt]").forEach((button) => {
        button.addEventListener("click", () => {
            input.value = button.dataset.prompt;
            updateLength();
            input.focus();
        });
    });

    document.getElementById("clearConversation").addEventListener("click", () => {
        conversation.length = 0;
        messages.replaceChildren();
        addMessage("assistant", "Hi! I can explain stock-market concepts in plain language. What would you like to learn?");
        setStatus("New conversation started. Chat history stays in this page session.");
        input.value = "";
        updateLength();
        input.focus();
    });

    async function loadNavigation() {
        const sidebar = document.getElementById("sidebar");
        const topbar = document.getElementById("topbar");
        try {
            const [sidebarResponse, topbarResponse] = await Promise.all([
                fetch("components/sidebar.html"),
                fetch("components/topbar.html")
            ]);
            if (!sidebarResponse.ok || !topbarResponse.ok) throw new Error("Navigation could not be loaded");
            sidebar.innerHTML = await sidebarResponse.text();
            topbar.innerHTML = await topbarResponse.text();
            document.getElementById("assistantLink")?.classList.add("active");
            window.dispatchEvent(new Event("tradenova:user-updated"));
        } catch (error) {
            console.error("Unable to load assistant navigation", error);
        }
    }

    updateLength();
    loadNavigation();
})();
