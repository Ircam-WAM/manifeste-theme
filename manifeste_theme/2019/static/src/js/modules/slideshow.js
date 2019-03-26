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
      pageDots: false,
      arrowShape: 'M87.5 45.8h-64l25-21.8a4.2 4.2 0 1 0-5.4-6.3L9.8 46.9h-.1a4 4 0 0 0-.8 1l-.2.4a4.1 4.1 0 0 0 0 3.4l.3.3c.2.4.4.8.7 1v.1l33.4 29.2a4.2 4.2 0 1 0 5.5-6.3l-25-21.8h63.9a4.2 4.2 0 0 0 0-8.4z',
      setGallerySize: false,
      cellAlign: 'left',
      contain: true
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
