import svg4everybody from 'svg4everybody';
import objectFitImages from 'object-fit-images';

export default class Polyfills {
  constructor() {
    svg4everybody();
    objectFitImages();
  }
}
