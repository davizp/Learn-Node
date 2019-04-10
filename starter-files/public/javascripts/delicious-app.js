import autocomplete from './modules/autocomplete';
import '../sass/style.scss';

import { $, $$ } from './modules/bling';

autocomplete(
  $('#address'),
  $('#lat'),
  $('#lng'),
);
