export const messageToBackground = async (message) => {
  await chrome?.runtime?.sendMessage(message);
};

export const queryText = /iamlazy/ig;
export const isIframe = window.self !== window.top;

export const sendMessageToTab = async (tabId, message) => {
  if (chrome?.runtime?.id && tabId && message) {
    console.log(tabId, message);
    await chrome.tabs.sendMessage(tabId, message);
  }
};
