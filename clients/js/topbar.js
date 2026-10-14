(() => {
    const topbar = document.getElementById("topbar");
    if (!topbar) return;

    const initializeProfile = () => {
        const avatar = document.getElementById("topUserAvatar");
        const label = document.getElementById("topUser");
        if (!avatar || !label) return false;

        let user = null;
        try {
            user = JSON.parse(localStorage.getItem("user") || "null");
        } catch (error) {
            console.error("Unable to read the saved TradeNova user profile", error);
        }

        const fullName = user && typeof user.full_name === "string"
            ? user.full_name.trim()
            : "";
        const email = user && typeof user.email === "string"
            ? user.email.trim()
            : "";
        const displayName = fullName || email || "Account";

        const initial = displayName.charAt(0).toUpperCase() || "U";
        if (avatar.textContent !== initial) avatar.textContent = initial;
        if (label.textContent !== displayName) label.textContent = displayName;
        return true;
    };

    initializeProfile();

    const observer = new MutationObserver(initializeProfile);
    observer.observe(topbar, { childList: true, subtree: true });
})();
