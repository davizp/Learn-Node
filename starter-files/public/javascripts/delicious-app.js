import autocomplete from './modules/autocomplete';
import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxHeart from './modules/heart';

const searchEl = $('.search');
const mapEl = $('#map');
const heartForms = $$('form.heart');

autocomplete(
  $('#address'),
  $('#lat'),
  $('#lng'),
);


typeAhead(searchEl);
makeMap(mapEl);
heartForms.on('submit', ajaxHeart);
