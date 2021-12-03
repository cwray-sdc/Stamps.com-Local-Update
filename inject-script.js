document.getElementsByTagName("body")[0].addEventListener(
    "UpdateCaps",
    (e) => {
        console.log("UpdateCaps event triggered");
        const cap = {};
        cap[e.detail.data.cap] = e.detail.data.value;

        Common.utils.Account.setAccountInfo(Object.assign(window.accountInfo.Capabilities, cap));
    },
    false
);

document.getElementsByTagName("body")[0].addEventListener(
    "UpdateUserPref",
    (e) => {
        console.log("Update User Pref event triggered");
        const pref = {};
        pref[e.detail.data.pref] = e.detail.data.value;
        Common.utils.Account.saveUserPrefs(pref);
    },
    false
);

document.getElementsByTagName("body")[0].addEventListener(
    "GetAccountInfo",
    (e) => {
        chrome.runtime.sendMessage(e.detail.id, { type: "SendingAccountInfoToBackground", data: window.accountInfo });        
        
        console.log("Sending AccountInfo to background.js.");
    },
    false
);


document.getElementsByTagName("body")[0].addEventListener(
    "GetUserPrefs",
    (e) => {
        chrome.runtime.sendMessage(e.detail.id, { type: "SendingUserPrefsToBackground", data: Common.utils.Account.getUserPrefs()
    });
        console.log("Sending UserPrefs to background.js.");
    },
    false
);