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
            })
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to send a password reset link.");
        }

        showToast(data.message, "success");
        document.getElementById("forgotPasswordForm").reset();
    } catch (error) {
        showToast(error.message || "Server Error", "error");
    } finally {
        button.disabled = false;
        button.textContent = "Send Reset Link";
    }
});
