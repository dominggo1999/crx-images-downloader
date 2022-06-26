export const messageToBackground = async (message) => {
  return chrome?.runtime?.sendMessage(message);
};
