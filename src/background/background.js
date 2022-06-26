import mime from 'mime-types';
import short from 'short-uuid';

const blobToBase64 = (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
};

const getFileName = (url, base64, id, extension) => {
  if (url === base64) {
    return `base_64_${id}.${extension}`;
  }

  const extRegexp = /\.[^/.]+$/;
  const extensionInUrl = extRegexp.test(url);

  let filename = url
    .substring(url.lastIndexOf('/') + 1) // strip protocol
    .replace(/[/\\?%*:|"<>]/g, '-'); // strip illegal chars;

  // strip extension if exist
  filename = extensionInUrl ? filename.replace(extRegexp, '') : filename;

  // UUID forcing unique file name
  return `${filename + short.generate()}.${extension}`;
};

chrome?.runtime?.onMessage.addListener((req, sender, sendRes) => {
  const { action, urls } = req;

  if (action === 'get-images-info') {
    (async () => {
      const images = await Promise.all(
        urls.map(async (imageUrl, id) => {
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const base64 = await blobToBase64(blob);
          const extension = mime.extension(blob.type);

          return {
            url: imageUrl,
            size: blob.size,
            extension,
            base64,
            fileName: getFileName(imageUrl, base64, id, extension),
          };
        }),
      );

      const validExtensions = ['png', 'jpeg', 'jpg', 'webp', 'bmp', 'gif'];

      sendRes({
        images: images.filter((i) => {
          return validExtensions.includes(i.extension);
        }),
      });
    })();
  }

  return true;
});
