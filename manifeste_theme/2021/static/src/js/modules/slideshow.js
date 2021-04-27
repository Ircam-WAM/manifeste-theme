import 'core-js/fn/promise';

class Slideshow {
  constructor(slideshow) {
    this.slideshow = slideshow;

    this.init();
  }

  async init() {
    const { default: Flickity } = await import(/* webpackChunkName: "flickity" */ 'flickity');
    await import(/* webpackChunkName: "flickity" */ 'flickity-imagesloaded');

    this.flickity = new Flickity(this.slideshow, {
      cellSelector: '.js-slideshow-slide',
      imagesLoaded: true,
      arrowShape: 'M23.78 30.22a4.17 4.17 0 01.35 5.5l-.35.4-9.55 9.55h81.6a4.17 4.17 0 01.49 8.3l-.49.03h-81.6l9.55 9.55a4.17 4.17 0 01.35 5.5l-.35.4a4.17 4.17 0 01-5.5.34l-.4-.34L1.23 52.78l-.02-.02a4.2 4.2 0 01-.1-.1l.12.12A4.18 4.18 0 010 49.65v.18a4.15 4.15 0 01.65-2.23c0-.02.02-.03.03-.05a3.99 3.99 0 01.53-.65l.01-.01 16.67-16.67a4.17 4.17 0 015.89 0z',
      setGallerySize: true,
      adaptiveHeight: true
    });

    // If custom player, trigger resize when ready
    const medias = Array.from(this.slideshow.querySelectorAll('.js-media'));
    if (medias.length) {
      medias.forEach((media) => media.addEventListener('ready', () => {
        var cell = this.flickity.getParentCell(media);
        this.flickity.cellSizeChange(cell && cell.element);
      }));
    }
  }
}

export default class {
  constructor() {
    this.slideshows = [];
    Array.from(document.querySelectorAll('.js-slideshow')).forEach((slideshow) => {
      this.slideshows.push(new Slideshow(slideshow));
    });
  }
}
