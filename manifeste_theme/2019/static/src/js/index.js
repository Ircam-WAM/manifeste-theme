//
// Require all the modules
//

import SVG from './modules/svg';
import Header from './modules/header';
import Filter from './modules/filter';
import Slideshow from './modules/slideshow';
import Media from './modules/media';
import Cookies from './modules/cookies';

//
// Init all the modules
//

window[SVG] = new SVG();
window[Header] = new Header();
window[Filter] = new Filter();
window[Slideshow] = new Slideshow();
window[Media] = new Media();
window[Cookies] = new Cookies();
