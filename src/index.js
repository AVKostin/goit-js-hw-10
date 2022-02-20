import './css/styles.css';
import Notiflix from 'notiflix';
import markupCountryListTemplate from './hbs-templates/markup-country-list.hbs';
import markupCountryInfoTemplate from './hbs-templates/markup-country-info.hbs';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';

const searchInput = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countriesInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

searchInput.focus();

Notiflix.Notify.init({
	position: 'center-top',
	width: '400px',
	fontSize: '18px',
});

let countryName = '';

const onSearch = e => {
	countryName = e.target.value.trim();

	clearInput();
	setCountries(countryName);
	function setCountries(countryName) {
		fetchCountries(countryName)
			.then(data => {
				const amount = data.length;
				console.log(amount);
				if (amount > 10) {
					Notiflix.Notify.info(
						'Найдено очень много стран. Пожалуйста, укажите более конкретное название.',
					);
					return;
				}
				if (amount >= 2 && amount <= 10) {
					renderCountriesMarkup(data);
				} else {
					renderCountriesInfoMarkup(data);
				}
			})
			.catch(onFetchError);
	}
};

function onFetchError(error) {
	if (countryName !== '') {
		Notiflix.Notify.failure('Oops, нет страны с таким именем');
	}
}

function renderCountriesMarkup(data) {
	countriesList.insertAdjacentHTML('beforeend', markupCountryListTemplate(data));
}

function renderCountriesInfoMarkup(data) {
	countriesInfo.insertAdjacentHTML('beforeend', markupCountryInfoTemplate(data));
}

function clearInput() {
	countriesList.innerHTML = '';
	countriesInfo.innerHTML = '';
}

searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
