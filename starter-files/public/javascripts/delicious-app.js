import autocomplete from './modules/autocomplete';
import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import typeAhead from './modules/typeAhead';

const searchEl = $('.search');

autocomplete(
  $('#address'),
  $('#lat'),
  $('#lng'),
);


typeAhead(searchEl);