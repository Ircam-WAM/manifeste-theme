import 'core-js/fn/promise';
import 'custom-event-polyfill';

let playerId = 0;

class Media {
  constructor(media, options) {
    this.media = media;

    this.settings = Object.assign({
      onPlay: () => {},
      onReady: () => {}
    }, options);

    this.player = this.media.querySelector('.js-media-player');
    this.items = Array.from(this.media.querySelectorAll('.js-media-item'));

    this.items.forEach((item, index) => item.addEventListener('click', () => this.play(index)));

    this.init();
  }

  select(index = 0) {
    this.currentIndex = index;
    this.currentItem = this.items[this.currentIndex];
    this.items.forEach((item) => item.classList[item === this.currentItem ? 'add' : 'remove']('is-active'));
  }

  play(index = 0) {
    this.select(index);
  }

  next() {
    if (this.currentIndex < this.items.length - 1) {
      this.play(this.currentIndex + 1);
    }
  }

  ready() {
    this.media.dispatchEvent(new CustomEvent('ready'));
  }
}

class Audio extends Media {
  async init() {
    // Async load audiojs
    const { audiojs } = await import(/* webpackChunkName: "audiojs" */ 'audiojs');

    // Create player
    this.player = document.createElement('audio');
    this.player.preload = 'true';
    this.media.insertBefore(this.player, this.media.firstChild);

    // Create audiojs instance
    this.audiojs = audiojs.create(this.player, {
      useFlash: false, // Come on it’s 2019
      css: false,
      trackEnded: () => this.next(),
      play: () => {
        this.audiojs.wrapper.classList.add('playing');
        this.settings.onPlay(this);
      }
    });

    audiojs.events.ready(() => {
      // Create title
      this.title = document.createElement('div');
      this.title.className = 'title';
      this.audiojs.wrapper.appendChild(this.title);

      // Select first item
      this.select();

      // Player is ready
      this.ready();
    });
  }

  select(index = 0) {
    super.select(index);

    // Set title
    this.title.innerHTML = this.currentItem.innerHTML;

    // Load file
    this.audiojs.load(this.currentItem.dataset.mediaSrc);
  }

  play(index = 0) {
    super.play(index);

    this.audiojs.play();
  }

  pause() {
    this.audiojs.pause();
  }
}

class Video extends Media {
  async init() {
    // Async load videojs & videojs-playlist
    const { default: videojs } = await import(/* webpackChunkName: "videojs" */ 'video.js');
    await import(/* webpackChunkName: "videojs" */ 'videojs-playlist');

    // Create player
    this.player = document.createElement('video');
    this.player.controls = 'true';
    this.playerId = `media-player-${playerId++}`;
    this.player.setAttribute('id', this.playerId);
    this.player.setAttribute('class', 'video-js vjs-ircam-skin');
    this.media.insertBefore(this.player, this.media.firstChild);

    // Create videojs instance
    this.videojs = videojs(this.playerId, {
      aspectRatio: '905:520'
    }, () => {
      // Bind play event
      this.videojs.on('play', () => this.settings.onPlay(this))

      // Create playlist
      const playlist = this.items.map((item) => {
        const srcs = item.dataset.mediaSrc.split(',');
        const mimes = item.dataset.mediaMime.split(',');
        return {
          sources: srcs.map((src, index) => ({
            src: src,
            mime: mimes[index]
          })),
          poster: item.dataset.mediaPoster
        };
      });

      // Assign playlist to player
      this.videojs.playlist(playlist);

      // Autoplay
      // not using this.videojs.playlist.autoadvance(0); because of playlist UI
      this.videojs.on('ended', () => this.next())

      // Select first item
      this.select();

      // Player is ready
      this.ready();
    });
  }

  select(index = 0) {
    super.select(index);

    // Select item in playlist
    this.videojs.playlist.currentItem(this.currentIndex);
  }

  play(index = 0) {
    super.play(index);

    this.videojs.play();
  }

  pause() {
    this.videojs.pause();
  }
}

export default class {
  constructor() {
    this.medias = [];

    const options = {
      onPlay: (media) => this.medias.filter((m) => m !== media).map((m) => m.pause())
    };

    Array.from(document.querySelectorAll('.js-media[data-media-type]')).forEach((media) => {
      switch (media.dataset.mediaType) {
        case 'audio':
          this.medias.push(new Audio(media, options));
        break;
        case 'video':
          this.medias.push(new Video(media, options));
        break;
      }
    });
  }
}
