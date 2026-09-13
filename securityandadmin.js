// ===============================
// LOAD JSON DATA
// ===============================

fetch("securityandadmin.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load data.json");
        }
        return response.json();
    })
    .then(data => {

        console.log("JSON loaded successfully:", data);

        // ===============================
        // DASHBOARD DATA
        // ===============================

        if (data.dashboard) {

            const activeUsers =
                document.querySelector("[data-count='18420']");

            const totalBalances =
                document.querySelector("[data-count='284']");

            const transactionsToday =
                document.querySelector("[data-count='9317']");

            const flagged =
                document.querySelector("[data-count='14']");

            if (activeUsers) {
                activeUsers.dataset.count =
                    data.dashboard.activeUsers;
            }

            if (totalBalances) {
                totalBalances.dataset.count =
                    data.dashboard.totalBalancesCr;
            }

            if (transactionsToday) {
                transactionsToday.dataset.count =
                    data.dashboard.transactionsToday;
            }

            if (flagged) {
                flagged.dataset.count =
                    data.dashboard.flaggedForReview;
            }
        }


        // ===============================
        // USER DATA
        // ===============================

        if (data.users) {

            const tableBody =
                document.querySelector("#usersTable tbody");

            if (tableBody) {

                tableBody.innerHTML = "";

                data.users.forEach(user => {

                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.account}</td>
                        <td>
                            <span class="status ${user.status === "Suspended" ? "suspended" : ""}">
                                ${user.status}
                            </span>
                        </td>
                        <td>
                            <button class="user-action">
                                ${user.status === "Suspended" ? "Reinstate" : "Suspend"}
                            </button>
                        </td>
                    `;

                    tableBody.appendChild(row);
                });

                addUserActionEvents();
            }
        }


        // ===============================
        // TRANSACTION DATA
        // ===============================

        if (data.transactions) {

            const tableBody =
                document.querySelector("#transactionsTable tbody");

            if (tableBody) {

                tableBody.innerHTML = "";

                data.transactions.forEach(transaction => {

                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${transaction.id}</td>
                        <td>${transaction.account}</td>
                        <td>${transaction.type}</td>
                        <td>${transaction.amount}</td>
                        <td>${transaction.date}</td>
                        <td>${transaction.status}</td>
                    `;

                    tableBody.appendChild(row);
                });
            }
        }


        // ===============================
        // TRANSACTION ALERTS
        // ===============================

        if (data.notifications &&
            data.notifications.transactionAlerts) {

            console.log(
                "Transaction Alerts:",
                data.notifications.transactionAlerts
            );
        }


        // ===============================
        // PAYMENT NOTIFICATIONS
        // ===============================

        if (data.notifications &&
            data.notifications.paymentNotifications) {

            console.log(
                "Payment Notifications:",
                data.notifications.paymentNotifications
            );
        }


        // ===============================
        // SECURITY ALERTS
        // ===============================

        if (data.notifications &&
            data.notifications.securityAlerts) {

            console.log(
                "Security Alerts:",
                data.notifications.securityAlerts
            );
        }

    })
    .catch(error => {
        console.error("JSON Error:", error);
    });


// ===============================
// SIDEBAR
// ===============================

const hamburger = document.querySelector(".hamburger");
const sidebar = document.querySelector(".sidebar");
const backdrop = document.querySelector(".backdrop");

if (hamburger) {

    hamburger.addEventListener("click", () => {
        sidebar.classList.add("active");
        backdrop.classList.add("active");
    });

}

if (backdrop) {

    backdrop.addEventListener("click", () => {
        sidebar.classList.remove("active");
        backdrop.classList.remove("active");
    });

}


// ===============================
// ACCORDION NAVIGATION
// ===============================

const accordionButtons =
    document.querySelectorAll(".accordion-btn");

accordionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const content =
            button.nextElementSibling;

        content.classList.toggle("show");
        button.classList.toggle("active");

    });

});


// ===============================
// PANEL SWITCHING
// ===============================

const navLinks =
    document.querySelectorAll("[data-panel]");

const panels =
    document.querySelectorAll(".panel");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        const panelName =
            link.getAttribute("data-panel");

        panels.forEach(panel => {
            panel.classList.remove("active");
        });

        const selectedPanel =
            document.getElementById(panelName);

        if (selectedPanel) {
            selectedPanel.classList.add("active");
        }

        if (sidebar) {
            sidebar.classList.remove("active");
        }

        if (backdrop) {
            backdrop.classList.remove("active");
        }

    });

});


// ===============================
// TOGGLE SWITCHES
// ===============================

const toggles =
    document.querySelectorAll("[data-toggle]");

toggles.forEach(toggle => {

    toggle.addEventListener("click", () => {
        toggle.classList.toggle("active");
    });

});


// ===============================
// TRANSACTION CONFIRMATION
// ===============================

const confirmationButtons =
    document.querySelectorAll(".transaction-confirm");

confirmationButtons.forEach(button => {

    button.addEventListener("click", () => {

        const card =
            button.closest(".notification-card");

        if (card) {

            card.style.opacity = "0";
            card.style.transform =
                "translateX(20px)";

            setTimeout(() => {
                card.remove();
            }, 300);

        }

    });

});


// ===============================
// PASSWORD STRENGTH
// ===============================

const passwordInput =
    document.querySelector("#newPassword");

const strengthBar =
    document.querySelector(".strength-bar");

const strengthText =
    document.querySelector(".strength-text");

if (passwordInput) {

    passwordInput.addEventListener("input", () => {

        const password =
            passwordInput.value;

        let score = 0;

        if (password.length >= 8) {
            score++;
        }

        if (password.length >= 12) {
            score++;
        }

        if (/[a-z]/.test(password) &&
            /[A-Z]/.test(password)) {
            score++;
        }

        if (/[0-9]/.test(password)) {
            score++;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        }

        if (strengthBar) {
            strengthBar.style.width =
                (score * 20) + "%";
        }

        if (strengthText) {

            if (score <= 1) {
                strengthText.textContent = "Weak";
            }
            else if (score <= 3) {
                strengthText.textContent = "Medium";
            }
            else {
                strengthText.textContent = "Strong";
            }

        }

    });

}


// ===============================
// PASSWORD MATCH
// ===============================

const confirmPassword =
    document.querySelector("#confirmPassword");

if (confirmPassword) {

    confirmPassword.addEventListener("input", () => {

        const password =
            document.querySelector("#newPassword").value;

        if (confirmPassword.value === password) {

            confirmPassword.classList.add("valid");
            confirmPassword.classList.remove("invalid");

        }
        else {

            confirmPassword.classList.add("invalid");
            confirmPassword.classList.remove("valid");

        }

    });

}


// ===============================
// PASSWORD FORM
// ===============================

const passwordForm =
    document.querySelector("#passwordForm");

if (passwordForm) {

    passwordForm.addEventListener("submit", event => {

        event.preventDefault();

        const password =
            document.querySelector("#newPassword").value;

        const confirm =
            document.querySelector("#confirmPassword").value;

        if (password !== confirm) {

            alert("Passwords do not match.");
            return;

        }

        alert("Password changed successfully.");

        passwordForm.reset();

    });

}


// ===============================
// USER SEARCH
// ===============================

const userSearch =
    document.querySelector("#userSearch");

if (userSearch) {

    userSearch.addEventListener("input", () => {

        const searchValue =
            userSearch.value.toLowerCase();

        const rows =
            document.querySelectorAll(
                "#usersTable tbody tr"
            );

        rows.forEach(row => {

            const text =
                row.textContent.toLowerCase();

            row.style.display =
                text.includes(searchValue)
                    ? ""
                    : "none";

        });

    });

}


// ===============================
// SUSPEND / REINSTATE USER
// ===============================

function addUserActionEvents() {

    const userActionButtons =
        document.querySelectorAll(".user-action");

    userActionButtons.forEach(button => {

        button.addEventListener("click", () => {

            const row =
                button.closest("tr");

            const status =
                row.querySelector(".status");

            if (button.textContent.trim() === "Suspend") {

                status.textContent = "Suspended";
                status.classList.add("suspended");

                button.textContent = "Reinstate";

            }
            else {

                status.textContent = "Active";
                status.classList.remove("suspended");

                button.textContent = "Suspend";

            }

        });

    });

}


// ===============================
// TRANSACTION SEARCH
// ===============================

const transactionSearch =
    document.querySelector("#transactionSearch");

if (transactionSearch) {

    transactionSearch.addEventListener("input", () => {

        const searchValue =
            transactionSearch.value.toLowerCase();

        const rows =
            document.querySelectorAll(
                "#transactionsTable tbody tr"
            );

        rows.forEach(row => {

            const text =
                row.textContent.toLowerCase();

            row.style.display =
                text.includes(searchValue)
                    ? ""
                    : "none";

        });

    });

}


// ===============================
// COUNT-UP ANIMATION
// ===============================

const counters =
    document.querySelectorAll("[data-count]");

const observer =
    new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const element =
                    entry.target;

                const target =
                    Number(element.dataset.count);

                const prefix =
                    element.dataset.prefix || "";

                const suffix =
                    element.dataset.suffix || "";

                let current = 0;

                const increment =
                    target / 100;

                const interval =
                    setInterval(() => {

                        current += increment;

                        if (current >= target) {

                            current = target;
                            clearInterval(interval);

                        }

                        element.textContent =
                            prefix +
                            Math.floor(current)
                                .toLocaleString() +
                            suffix;

                    }, 15);

                observer.unobserve(element);

            }

        });

    });


counters.forEach(counter => {
    observer.observe(counter);
});