import React, { useEffect } from 'react';
import { sendMessageToTab } from '~/util/message';

const Popup = () => {
  const send = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      sendMessageToTab(activeTab.id, {
        action: 'get-images',
      });
    });
  };

  const download = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      sendMessageToTab(activeTab.id, {
        action: 'download-images',
      });
    });
  };

  useEffect(() => {
    // send();
  }, []);

  return (
    <div>
      <button onClick={send}>Get Images</button>
      <button onClick={download}>Download</button>
    </div>
  );
};

export default Popup;
