import autocomplete from './modules/autocomplete';
import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';

const searchEl = $('.search');
const mapEl = $('#map');

autocomplete(
  $('#address'),
  $('#lat'),
  $('#lng'),
);


typeAhead(searchEl);
makeMap(mapEl);
