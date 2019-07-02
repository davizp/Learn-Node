import axios from 'axios';
import { $ } from './bling';

function ajaxHeart(event) {
  event.preventDefault();

  axios
    .post(this.action)
    .then(res => {
      const isHearted = this.heart.classList.toggle('heart__button--hearted');
      const heartCountEl = $('.heart-count');

      if (isHearted) {
        this.heart.classList.add('heart__button--float');
        setTimeout(() => this.heart.classList.remove('heart__button--float'), 2500);
      }

      heartCountEl.textContent = res.data.hearts.length;
    })
    .catch(err => console.log(err));

  console.log('Hearted!');
}

export default ajaxHeart;
