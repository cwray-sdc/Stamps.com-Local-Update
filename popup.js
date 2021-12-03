window.onload = function () {

    // Tab navigation functionality
    document.querySelectorAll(".nav-tabs")[0].addEventListener("click", (e) => {
        const navTarget = e.target.getAttribute("nav-target");

        if (navTarget) {
            activeNavItem = document.querySelectorAll(
                `[nav-target="${navTarget}"]`
            )[0];

            // Hide all the nav sections
            [...document.querySelectorAll('[nav-section="lists"]')].map((el) => {
                el.classList.add("hidden");
            });
            [...document.querySelectorAll(".nav-link")].map((el) => {
                el.removeAttribute("aria-current");
                el.classList.remove("active");
            });

            // Show the selected nav section
            document.getElementById(`${navTarget}`).classList.remove("hidden");
            activeNavItem.classList.add("active");
            activeNavItem.setAttribute("aria-current", "page");
        }

    });

    // Listens for messages from background.js
    chrome.runtime.onMessage.addListener((response, sender, sendResponse) => {
        let section;
        if (response.type === "SendAppCapsToPopup") {

            section = "appCaps";

            if (response.data) {
                buildItems(section, "cap", response.data.Capabilities);

                document
                    .querySelectorAll("#appCaps ul")[0]
                    .addEventListener("click", (e) => {
                        const cap = e.target.parentElement.getAttribute("cap");
                        const capValue = e.target.checked;

                        if (capValue !== "undefined") {
                            chrome.runtime.sendMessage({
                                type: "UpdateCaps",
                                data: {
                                    cap: cap,
                                    value: capValue,
                                },
                            });
                        }
                    });
            } else {
                displayNotLoggedInMessage(section)
            }

        }
        if (response.type === "SendUserPrefsToPopup") {
            section = "userPrefs";
            if (response.data) {
                buildItems(section, "pref", response.data.data);

                document
                    .querySelectorAll("#userPrefs ul")[0]
                    .addEventListener("change", (e) => {
                        const pref = e.target.parentElement.getAttribute('pref');
                        const prefValue = e.target.value;
    
                        if (prefValue !== "undefined") {
                            chrome.runtime.sendMessage({
                                type: "UpdateUserPref",
                                data: {
                                    pref: pref,
                                    value: prefValue,
                                },
                            });
                        }
                    });
            } else {
                displayNotLoggedInMessage(section)
            }
        }
    });

    chrome.runtime.sendMessage({
        type: "GetAccountInfo",
    });

    chrome.runtime.sendMessage({
        type: "GetUserPrefs",
    });
};

const buildItems = (wrapperId, label, data) => {
    const wrapper = document.getElementById(wrapperId);
    const dataArray = [];

    // Clear loading icon from wrapper
    wrapper.innerHTML = "";

    wrapper.appendChild(document.createElement("ul"));

    wrapperList = document.querySelectorAll(`#${wrapperId} ul`)[0];

    for (const [key, value] of Object.entries(data)) {
        dataArray.push([key, value]);
    }

    // Alphabetize items
    dataArray.sort((a, b) => {
        const textA = a[0].toUpperCase();
        const textB = b[0].toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    const createItem = (key, value) => {
        let item = document.createElement("li");
        let itemName = document.createElement("span");
        let itemValue = document.createElement("input");

        // Create checkboxes for App Caps and text boxes for User Pref
        if (label !== "pref") {
            itemValue.setAttribute("type", "checkbox");
            itemValue.checked = value;
        } else {
            itemValue.value = value;
        }

        itemName.appendChild(document.createTextNode(key));

        item.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between"
        );

        // Add data attributes for passing data back to inject-script.js
        item.setAttribute(label, key);
        item.setAttribute(`${label}Value`, value);
        itemName.classList.add("name");
        itemValue.classList.add("value");

        item.appendChild(itemName);
        item.appendChild(itemValue);

        return item;
    };

    // Add the items
    dataArray.map((item) => {
        wrapperList.appendChild(createItem(item[0], item[1]));
    })
};

const displayNotLoggedInMessage = (section) => {
    document.getElementById(section).innerHTML = "Please access this extension with a logged in user. "
} 