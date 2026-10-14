(() => {
    const topbar = document.getElementById("topbar");
    if (!topbar) return;
    let walletLoadStarted = false;

    const loadWalletBalance = async () => {
        const wallet = document.getElementById("topWallet");
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!wallet || !token) return;

        try {
            const response = await fetch(`${window.location.origin}/api/wallet`, {
                headers: { Authorization: token }
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || `Wallet request failed (${response.status})`);
            }

            const balance = Number(data.balance);
            if (!Number.isFinite(balance)) {
                throw new Error("Wallet response contains an invalid balance");
            }

            wallet.textContent = `₹${balance.toLocaleString("en-IN")}`;
        } catch (error) {
            console.error("Unable to load the topbar wallet balance", error);
        }
    };

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

        if (!walletLoadStarted && document.getElementById("topWallet")) {
            walletLoadStarted = true;
            loadWalletBalance();
        }

        return true;
    };

    window.addEventListener("tradenova:wallet-updated", loadWalletBalance);
    initializeProfile();

    const observer = new MutationObserver(initializeProfile);
    observer.observe(topbar, { childList: true, subtree: true });
})();
