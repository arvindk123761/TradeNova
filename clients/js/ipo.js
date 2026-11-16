const API = `${window.location.origin}/api`;
const ipoContainer = document.getElementById("ipoContainer");
const applicationsList = document.getElementById("applicationsList");
const emptyIPO = document.getElementById("emptyIPO");
const loadingScreen = document.getElementById("loadingScreen");
const applyDialog = document.getElementById("applyDialog");
const token = localStorage.getItem("token") || sessionStorage.getItem("token");

let ipoList = [];
let applications = [];
let selectedIPO = null;
let selectedStatus = "All";

const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}[character]));

const formatCurrency = (value) => {
    const number = Number(value);
    return Number.isFinite(number)
        ? `₹${number.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
        : "—";
};

const formatDate = (value) => {
    if (!value) return "Not announced";
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    const date = match
        ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
        : new Date(value);
    return Number.isNaN(date.getTime())
        ? "Not announced"
        : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const priceFor = (ipo) => {
    const price = Number(ipo.price);
    if (Number.isFinite(price) && price > 0) return price;
    const matches = String(ipo.price_band || "").match(/[\d,.]+/g);
    return matches && matches.length
        ? Number(matches[matches.length - 1].replace(/,/g, ""))
        : 0;
};

const displayPrice = (ipo) => {
    if (ipo.price_band) {
        const band = String(ipo.price_band);
        return band.startsWith("₹") ? band : `₹${band}`;
    }
    return formatCurrency(priceFor(ipo));
};

const ipoStatus = (ipo) => {
    const status = String(ipo.status || "").toLowerCase();
    if (status === "active" || status === "open") return "Active";
    if (status === "upcoming") return "Upcoming";
    return "Closed";
};

const applicationKey = (application) => String(
    application.ipo_id ?? application.ipoId ?? ""
);

const hasApplied = (ipo) => applications.some((application) =>
    applicationKey(application) === String(ipo.id)
);

const loadComponents = async () => {
    const [sidebarResponse, topbarResponse] = await Promise.all([
        fetch("components/sidebar.html"),
        fetch("components/topbar.html")
    ]);
    if (!sidebarResponse.ok || !topbarResponse.ok) {
        throw new Error("Unable to load page navigation");
    }
    document.getElementById("sidebar").innerHTML = await sidebarResponse.text();
    document.getElementById("topbar").innerHTML = await topbarResponse.text();
};

const loadApplications = async () => {
    if (!token) {
        applications = [];
        renderApplications();
        return;
    }

    const response = await fetch(`${API}/ipo/applications`, {
        headers: { Authorization: token }
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load your IPO applications");
    }

    applications = Array.isArray(data.applications) ? data.applications : [];
    renderApplications();
};

const updateSummary = () => {
    document.getElementById("activeIPO").textContent =
        ipoList.filter((ipo) => ipoStatus(ipo) === "Active").length;
    document.getElementById("upcomingIPO").textContent =
        ipoList.filter((ipo) => ipoStatus(ipo) === "Upcoming").length;
    document.getElementById("closedIPO").textContent =
        ipoList.filter((ipo) => ipoStatus(ipo) === "Closed").length;
    document.getElementById("myIPO").textContent = applications.length;
};

const renderIPO = () => {
    const query = document.getElementById("searchIPO").value.trim().toLowerCase();
    const visibleIPOs = ipoList.filter((ipo) => {
        const statusMatches = selectedStatus === "All" || ipoStatus(ipo) === selectedStatus;
        const searchMatches = `${ipo.company_name || ""} ${ipo.sector || ""}`
            .toLowerCase()
            .includes(query);
        return statusMatches && searchMatches;
    });

    updateSummary();
    emptyIPO.style.display = visibleIPOs.length ? "none" : "flex";
    ipoContainer.style.display = visibleIPOs.length ? "grid" : "none";
    if (!visibleIPOs.length) {
        document.querySelector("#emptyIPO h2").textContent = ipoList.length
            ? "No IPOs match your search"
            : "No IPOs available";
        document.querySelector("#emptyIPO p").textContent = ipoList.length
            ? "Try another company name, sector, or status filter."
            : "Try again later to see available IPO listings.";
        return;
    }

    ipoContainer.innerHTML = visibleIPOs.map((ipo) => {
        const status = ipoStatus(ipo);
        const price = priceFor(ipo);
        const lotSize = Number(ipo.lot_size) || 0;
        const minimum = price * lotSize;
        const applied = hasApplied(ipo);
        const issueSize = ipo.issue_size ?? ipo.issueSize ?? ipo.issue_size_cr;
        const listingDate = ipo.listing_date ?? ipo.listingDate;
        const openDate = ipo.open_date ?? ipo.openDate;
        const closeDate = ipo.close_date ?? ipo.closeDate;

        return `
            <article class="ipo-card">
                <div class="ipo-card-top">
                    <div class="ipo-logo" aria-hidden="true">${escapeHTML((ipo.company_name || "I").slice(0, 1))}</div>
                    <span class="badge ${status.toLowerCase()}">${status === "Active" ? "Open now" : status}</span>
                </div>
                <h3 class="company-name">${escapeHTML(ipo.company_name || "IPO listing")}</h3>
                <p class="company-sector">${escapeHTML(ipo.sector || "Sector not specified")}</p>
                ${ipo.is_demo ? '<span class="demo-tag">Simulated demo</span>' : ""}
                <div class="ipo-key-facts">
                    <div class="fact-box"><span>Price band</span><strong>${escapeHTML(displayPrice(ipo))}</strong></div>
                    <div class="fact-box"><span>Lot size</span><strong>${lotSize ? lotSize.toLocaleString("en-IN") : "—"} shares</strong></div>
                </div>
                <div class="ipo-details">
                    <div class="detail-row"><span>Minimum application</span><strong>${minimum ? formatCurrency(minimum) : "—"}</strong></div>
                    <div class="detail-row"><span>Issue size</span><strong>${issueSize !== undefined && issueSize !== null && issueSize !== "" ? `${escapeHTML(issueSize)}${ipo.is_demo ? " Cr" : ""}` : "Not announced"}</strong></div>
                    <div class="detail-row"><span>Opens</span><strong>${formatDate(openDate)}</strong></div>
                    <div class="detail-row"><span>Closes</span><strong>${formatDate(closeDate)}</strong></div>
                    <div class="detail-row"><span>Expected listing</span><strong>${formatDate(listingDate)}</strong></div>
                </div>
                <button class="apply-btn" type="button" data-ipo-id="${escapeHTML(ipo.id)}"
                    ${status !== "Active" || applied ? "disabled" : ""}>
                    ${applied ? "Application submitted" : status === "Active" ? "Apply for IPO" : status === "Upcoming" ? "Opens soon" : "Issue closed"}
                </button>
            </article>
        `;
    }).join("");
};

const renderApplications = () => {
    document.getElementById("applicationCount").textContent =
        `${applications.length} ${applications.length === 1 ? "application" : "applications"}`;
    document.getElementById("myIPO").textContent = applications.length;

    if (!applications.length) {
        applicationsList.innerHTML = token
            ? '<p class="applications-empty">You have not applied to any IPO yet. Your applications will appear here.</p>'
            : '<p class="applications-empty">Sign in to see and track your IPO applications.</p>';
        return;
    }

    applicationsList.innerHTML = applications.map((application) => {
        const amount = Number(application.amount);
        const status = application.application_status || "Submitted";
        const company = application.company_name || "IPO application";
        const lots = Number(application.lots) || 0;
        const shares = lots * (Number(application.lot_size) || 0);
        const date = application.applied_at || application.created_at || application.application_date;

        return `
            <article class="application-row">
                <div class="application-company">
                    <span class="application-icon" aria-hidden="true">↗</span>
                    <div><strong>${escapeHTML(company)}</strong><span>${escapeHTML(application.sector || (application.is_demo ? "Simulated demo IPO" : "IPO"))}</span></div>
                </div>
                <div class="application-meta"><span>Applied</span><strong>${formatDate(date)}</strong></div>
                <div class="application-meta"><span>Lots / shares</span><strong>${lots || "—"} lots${shares ? ` · ${shares.toLocaleString("en-IN")} shares` : ""}</strong></div>
                <div class="application-meta"><span>Application amount</span><strong>${Number.isFinite(amount) ? formatCurrency(amount) : "—"}</strong></div>
                <span class="application-status">${escapeHTML(status)}</span>
            </article>
        `;
    }).join("");
};

const openApplicationDialog = (ipo) => {
    if (!token) {
        showToast("Please sign in to apply for an IPO", "error");
        return;
    }

    selectedIPO = ipo;
    document.getElementById("dialogCompany").textContent = `${ipo.company_name} · ${ipo.sector || "IPO"}`;
    document.getElementById("dialogPrice").textContent = displayPrice(ipo);
    document.getElementById("dialogLotSize").textContent = `${Number(ipo.lot_size).toLocaleString("en-IN")} shares`;
    document.getElementById("lotCount").value = "1";
    updateApplicationAmount();
    applyDialog.showModal();
};

const updateApplicationAmount = () => {
    if (!selectedIPO) return;
    const lots = Number(document.getElementById("lotCount").value);
    const amount = priceFor(selectedIPO) * Number(selectedIPO.lot_size) * lots;
    document.getElementById("applicationAmount").textContent =
        Number.isInteger(lots) && lots > 0 && Number.isFinite(amount)
            ? formatCurrency(amount)
            : "Enter a valid lot count";
};

const submitApplication = async () => {
    if (!selectedIPO) return;
    const button = document.getElementById("submitApplication");
    const lots = Number(document.getElementById("lotCount").value);
    if (!Number.isInteger(lots) || lots < 1) {
        showToast("Enter a valid number of lots", "error");
        return;
    }

    button.disabled = true;
    button.textContent = "Submitting...";
    try {
        const response = await fetch(`${API}/ipo/apply`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify({ ipo_id: selectedIPO.id, lots })
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Unable to submit application");

        applyDialog.close();
        showToast("IPO application submitted", "success");
        await loadApplications();
        renderIPO();
    } catch (error) {
        showToast(error.message || "Unable to submit application", "error");
    } finally {
        button.disabled = false;
        button.textContent = "Submit application";
    }
};

const initializeIPOPage = async () => {
    try {
        await loadComponents();
        const response = await fetch(`${API}/ipo`);
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Unable to load IPOs");
        ipoList = Array.isArray(data.ipos) ? data.ipos : [];
        try {
            await loadApplications();
        } catch (error) {
            applications = [];
            renderApplications();
            console.error("Unable to load IPO applications", error);
            showToast(error.message || "Unable to load your IPO applications", "error");
        }
        renderIPO();
    } catch (error) {
        console.error("Unable to load IPO page", error);
        showToast(error.message || "Unable to load IPOs", "error");
        document.querySelector("#emptyIPO h2").textContent = "IPO listings unavailable";
        document.querySelector("#emptyIPO p").textContent = "We could not load IPO information. Please try again shortly.";
        emptyIPO.style.display = "flex";
        ipoContainer.style.display = "none";
    } finally {
        loadingScreen.style.display = "none";
    }
};

document.getElementById("searchIPO").addEventListener("input", renderIPO);
document.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
        selectedStatus = button.dataset.status;
        document.querySelectorAll(".filter-chip").forEach((chip) =>
            chip.classList.toggle("active", chip === button));
        renderIPO();
    });
});
ipoContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ipo-id]");
    if (!button || button.disabled) return;
    const ipo = ipoList.find((item) => String(item.id) === button.dataset.ipoId);
    if (ipo) openApplicationDialog(ipo);
});
document.getElementById("lotCount").addEventListener("input", updateApplicationAmount);
document.getElementById("submitApplication").addEventListener("click", submitApplication);
initializeIPOPage();
