import create from 'zustand/vanilla';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { messageToBackground } from './util';

const uniqueInArray = (items) => {
  const seen = {};

  return items.filter((item) => {
    // eslint-disable-next-line no-prototype-builtins
    if (seen.hasOwnProperty(item)) {
      return false;
    }
    seen[item] = true;
    return true;
  });
};

const searchImagesInDOM = async (document) => {
  const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;
  const images = await Array.from(document.querySelectorAll('*')).reduce((collection, node) => {
    // From background image
    // bg src
    const prop = window.getComputedStyle(node, null)
      .getPropertyValue('background-image');

    const match = srcChecker.exec(prop);
    if (match) {
      collection.push(match[1]);
    }

    // From image tag
    if (node.tagName === 'IMG') {
      // src from img tag
      if (node.src) {
        collection.push(node.src);
      }
    } else if (node.tagName === 'IFRAME') {
      // iframe
      try {
        searchImagesInDOM(node.contentDocument || node.contentWindow.document)
          .then((images) => {
            if (images?.length > 0) {
              images.forEach((img) => {
                if (img) { collection.push(img); }
              });
            }
          });
      } catch (e) {
        console.log(e);
      }
    }

    return collection;
  }, []);

  return uniqueInArray(images);
};

const store = create(() => ({
  images: [],
}));

chrome?.runtime?.onMessage.addListener(async (req, sender, sendRes) => {
  const { action } = req;

  if (action === 'get-images') {
    // If images exist
    const imageUrls = await searchImagesInDOM(document);

    if (imageUrls.length) {
      const infoFromBackground = await messageToBackground({
        action: 'get-images-info',
        urls: imageUrls,
      });

      console.log(infoFromBackground);

      const {
        setState,
      } = store;

      setState({
        images: infoFromBackground.images,
      });
    }
  }

  if (action === 'download-images') {
    const {
      getState,
    } = store;

    const images = getState().images;

    const zip = new JSZip();

    images.forEach(({ fileName, base64 }) => {
      zip.file(fileName, base64.split(',')[1], { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'images.zip');
    });
  }
});
