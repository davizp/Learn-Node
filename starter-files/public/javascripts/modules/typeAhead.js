import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHMTL(stores) {
  return stores.map(store => `
    <a href="/store/${store.slug}" class="search__result">
      <strong>${store.name}</strong>
    </a>
  `).join('');
}

function typeAhead(search) {
  if (!search) {
    return;
  }

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function() {
    if(!this.value) {
      searchResults.style.display = 'none';
      return;
    }

    searchResults.style.display = 'block';

    axios.get(`/api/search?q=${this.value}`)
      .then(res => {
        console.log(res.data);

        if(res.data.length) {
          const html = searchResultsHMTL(res.data);

          searchResults.innerHTML = dompurify.sanitize(html);
          return;
        }

        searchResults.innerHTML = dompurify.sanitize(`
          <div class="search__result">
            No results for <strong>${this.value}</strong> found!
          </div>
        `);
      })
      .catch(err => console.error(err));
  });

  // handle keyboard inputs
  const keys = {
    UP: 38,
    DOWN: 40,
    ENTER: 13
  };

  const importantKeys = [keys.UP, keys.DOWN, keys.ENTER];

  searchInput.on('keyup', event => {
    if (!importantKeys.includes(event.keyCode)) {
      return;
    }

    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`) || {};
    const items = search.querySelectorAll('.search__result');
    let next;

    if (event.keyCode === keys.DOWN) {
      next = current.nextElementSibling || items[0];
    } else if (event.keyCode === keys.UP) {
      next = current.previousElementSibling || items[items.length - 1];
    } else if (event.keyCode === keys.ENTER && current.href) {
      window.location.href = current.href;
    }

    if (current.classList) {
      current.classList.remove(activeClass);
    }

    if(next) {
      next.classList.add(activeClass);
    }
  });
}

export default typeAhead;
