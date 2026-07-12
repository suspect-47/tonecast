const defaults = {
  backendBaseUrl: "http://localhost:8787"
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(defaults).catch(() => undefined);
});
