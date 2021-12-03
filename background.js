// Listens for message from inject-script.js
chrome.runtime.onMessageExternal.addListener(
    (message, sender, sendResponse) => {
        if (message.type === "SendingAccountInfoToBackground") {
            chrome.runtime.sendMessage({
                type: "SendAppCapsToPopup",
                data: message.data
            });
        }
        if (message.type === "SendingUserPrefsToBackground") {
            chrome.runtime.sendMessage({
                type: "SendUserPrefsToPopup",
                data: message.data,
            });            
        }
    }
);

// Generic passthrough for events from popup.js to content-script.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: message.type,
            data: message.data,
        });
    });
});
