const injectScript = (file_path, tag) => {
    const node = document.getElementsByTagName(tag)[0];
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", file_path);

    node.appendChild(script);
}

// Injects script to default2.aspx
injectScript(chrome.extension.getURL("inject-script.js"), "body");

// Listens for messages sent from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let event;
    let extensionId = chrome.runtime.id;
    let detailObject = {};

    // Triggers events injected into default2.aspx as called from the extension popup. 
    if (message.type) {
        if (message.data) {
            Object.assign(detailObject, message.data);
        }
        event = new CustomEvent(message.type, { detail: { data: message.data, id: extensionId }});

        document.getElementsByTagName("body")[0].dispatchEvent(event);
    }

    return true;
});
