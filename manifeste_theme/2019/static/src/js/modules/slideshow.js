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
      pageDots: (this.slideshow.dataset.slideshowDots !== undefined),
      arrowShape: 'M0 50.022L29.022 21v23.639H100v10.705H29.022v23.7z',
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
