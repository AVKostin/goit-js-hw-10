import './css/styles.css';
import Notiflix from 'notiflix';
import markupCountryListTemplate from './hbs-templates/markup-country-list.hbs';
import markupCountryInfoTemplate from './hbs-templates/markup-country-info.hbs';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';

const searchInputRef = document.querySelector('#search-box');
const countriesListRef = document.querySelector('.country-list');
const countriesInfoRef = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

Notiflix.Notify.init({
	position: 'center-top',
	width: '400px',
	fontSize: '18px',
});

const onSearch = e => {
	const countryName = e.target.value.trim();
	if (countryName === '') {
		clearInput();
		return;
	}
	fetchCountries(countryName)
		.then(data => {
			const amount = data.length;
			if (data.length > 10)
				return Notiflix.Notify.info(
					'Найдено очень много стран. Пожалуйста, укажите более конкретное название.',
				);
			if (amount > 1) return renderCountriesMarkup(data);
			renderCountriesInfoMarkup(data);
		})
		.catch(error => {
			clearInput();
			return Notiflix.Notify.failure('Oops, нет страны с таким именем');
		});
};

function renderCountriesInfoMarkup(country) {
	const markup = markupCountryInfoTemplate(country);

	countriesListRef.innerHTML = '';
	countriesInfoRef.innerHTML = markup;
	searchInputRef.value = '';
}

function renderCountriesMarkup(list) {
	const markup = markupCountryListTemplate(list);

	countriesInfoRef.innerHTML = '';
	countriesListRef.innerHTML = markup;
}

function clearInput() {
	countriesInfoRef.innerHTML = '';
	countriesListRef.innerHTML = '';
}

searchInputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
