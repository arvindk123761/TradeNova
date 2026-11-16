const API = `${window.location.origin}/api`;
const resetToken = new URLSearchParams(window.location.search).get("token");
const resetForm = document.getElementById("resetPasswordForm");

if (!resetToken) {
    showToast("This password reset link is invalid or incomplete. Request a new one.", "error");
    document.getElementById("resetPasswordButton").disabled = true;
}

resetForm.addEventListener("submit", async event => {
    event.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password.length < 6) {
        showToast("Password must be at least 6 characters long.", "error");
        return;
    }

    if (password !== confirmPassword) {
        showToast("Passwords do not match.", "error");
        return;
    }

    const button = document.getElementById("resetPasswordButton");
    button.disabled = true;
    button.textContent = "Updating...";

    try {
        const response = await fetch(`${API}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: resetToken, password })
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to reset your password.");
        }

        showToast(data.message, "success");
        resetForm.reset();
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
    } catch (error) {
        showToast(error.message || "Server Error", "error");
    } finally {
        button.disabled = false;
        button.textContent = "Update Password";
    }
});
