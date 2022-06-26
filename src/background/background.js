const blobToBase64 = (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onload = () => {
      // const dataUrl = reader.result;
      // const base64 = dataUrl.split(',')[1];
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
};

chrome?.runtime?.onMessage.addListener((req, sender, sendRes) => {
  const { action, urls } = req;

  if (action === 'get-images-info') {
    (async () => {
      const images = await Promise.all(
        urls.map(async (imageUrl) => {
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const base64 = await blobToBase64(blob);
          return {
            url: imageUrl,
            size: blob.size,
            type: blob.type,
            base64,
          };
        }),
      );

      sendRes({ images });
    })();
  }

  return true;
});
