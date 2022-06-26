import create from 'zustand/vanilla';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { messageToBackground } from './util';

const store = create(() => ({
  images: [],
}));

chrome?.runtime?.onMessage.addListener(async (req, sender, sendRes) => {
  const { action } = req;

  if (action === 'get-images') {
    // If images exist
    const imagesElements = document.images;

    if (imagesElements.length) {
      const infoFromBackground = await messageToBackground({
        action: 'get-images-info',
        urls: Array.from(imagesElements).filter((image) => image.src).map((image) => image.src),
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

    images.forEach(({ url, base64, type }) => {
      const filename = url.substring(url.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, '');
      const extension = `.${type.split('/')[1]}`;

      zip.file(filename + extension, base64.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, ''), { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'images.zip');
    });
  }
});
