const API = `${window.location.origin}/api`;

document.getElementById("forgotPasswordForm").addEventListener("submit", async event => {
    event.preventDefault();

    const button = document.getElementById("sendResetButton");
    button.disabled = true;
    button.textContent = "Sending...";

    try {
        const response = await fetch(`${API}/auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById("email").value.trim()
            }),
            signal: AbortSignal.timeout(90000)
        });
        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("The server returned an unreadable response. Please check the Render service and try again.");
        }

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to send a password reset link.");
        }

        showToast(data.message, "success");
        document.getElementById("forgotPasswordForm").reset();
    } catch (error) {
        const message = error.name === "TimeoutError"
            ? "The request timed out. Render may still be waking up; wait a minute and try again."
            : error.message || "Server Error";
        showToast(message, "error");
    } finally {
        button.disabled = false;
        button.textContent = "Send Reset Link";
    }
});
