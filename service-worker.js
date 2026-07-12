const GMAIL_URL_PATTERN = /^https:\/\/mail\.google\.com\//;

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) {
    return;
  }

  if (!tab.url || !GMAIL_URL_PATTERN.test(tab.url)) {
    await Promise.all([
      chrome.action.setBadgeBackgroundColor({
        color: "#ef4444",
        tabId: tab.id,
      }),
      chrome.action.setBadgeText({
        text: "MAIL",
        tabId: tab.id,
      }),
      chrome.action.setTitle({
        title: "Open Gmail to launch Inbox Parade",
        tabId: tab.id,
      }),
    ]);
    return;
  }

  await Promise.all([
    chrome.action.setBadgeText({ text: "", tabId: tab.id }),
    chrome.action.setTitle({
      title: "Toggle Inbox Parade",
      tabId: tab.id,
    }),
  ]);

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  } catch (error) {
    console.error("Inbox Parade could not be toggled.", error);
  }
});
