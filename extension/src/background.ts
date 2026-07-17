const defaults = {
  backendBaseUrl: "https://tonecast-4vqtt7s5.sauna.new"
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(defaults).catch(() => undefined);
});

// InboxSDK (MV3): the content script asks us to inject pageWorld.js into the
// page's MAIN world, since content scripts can't reach it directly.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request?.type === "inboxsdk__injectPageWorld" && sender.tab?.id != null) {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      world: "MAIN",
      files: ["pageWorld.js"]
    });
    sendResponse(true);
    return true;
  }
  return undefined;
});
