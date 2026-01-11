// ---- Load saved cloak on page load ----
window.addEventListener("DOMContentLoaded", () => {
    const savedTitle = localStorage.getItem("cloak_title");
    const savedIcon = localStorage.getItem("cloak_favicon");

    if (savedTitle) document.title = savedTitle;
    if (savedIcon) changeFavicon(savedIcon);
});

// ---- Function to change favicon ----
function changeFavicon(src) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
    }
    link.href = src;
}

// ---- Apply cloak + save it ----
function applyCloak(title, iconPath) {
    document.title = title;
    changeFavicon(iconPath);

    localStorage.setItem("cloak_title", title);
    localStorage.setItem("cloak_favicon", iconPath);
}

// ---- Clear cloak ----
function resetCloak() {
    localStorage.removeItem("cloak_title");
    localStorage.removeItem("cloak_favicon");
    location.reload();
}

// ---- Safari-safe about:blank cloaker ----
function cloakBlankSafari() {
    const win = window.open("about:blank", "_blank");
    win.document.write("<title>Google Classroom</title>");
    win.document.write("<link rel='icon' href='google-classroom.ico'>");
    win.document.close();
    window.location.href = "https://classroom.google.com";
}
