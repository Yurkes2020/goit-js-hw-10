import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const infoRef = document.querySelector('.country-info');
console.log(inputRef);

inputRef.addEventListener('input', debounce(onSearch), DEBOUNCE_DELAY);

function onSearch(event) {
  event.preventDefault();
  clearCountries();
  const countrySearch = event.target.value.trim();
  if (!countrySearch) {
    return;
  }
  fetchCountries(countrySearch)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (data.length === 1) {
        renderCountryInfo(data);
      } else {
        renderCountryList(data);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountryList(item) {
  const markupCountryList = item
    .map(({ name, flags }) => {
      return `<li>
      <img class="image" src="${flags.svg}" alt="${name.official}" width="40">
      <p>${name.official}</p>
      </li>`;
    })
    .join('');
  listRef.innerHTML = markupCountryList;
}

function renderCountryInfo(item) {
  const markupCountryInfo = item
    .map(({ name, capital, population, flags, languages }) => {
      return ` <div>
        <h1>${name.official}</h1>
        <img class="image" src="${flags.svg}" alt="${
        name.official
      }" width="100" > 
      <p> <span>Capital:</span>  ${capital}</p>
      <p> <span>Population:</span> ${population}</p>
      <p> <span>Language:</span> ${Object.values(languages)} </p>
      </div>`;
    })
    .join('');
  infoRef.innerHTML = markupCountryInfo;
}

function clearCountries() {
  listRef.innerHTML = '';
  infoRef.innerHTML = '';
}
