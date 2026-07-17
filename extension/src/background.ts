const defaults = {
  backendBaseUrl: "https://tonecast-4vqtt7s5.sauna.new"
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(defaults).catch(() => undefined);
});
