import City from './city';
import getCitiesFromStorage from './getCitiesFromStorage';
import fillCitiesArray from './fillCitiesArray';
import routeCitiesArray from './routeCitiesArray';
import sortArrayByLocal from './sortArrayByLocal';

const inputCity = document.getElementById('select-cities'),
closeButton = document.querySelector('.close-button'),
label = document.querySelector('.label'),
button = document.querySelector('.button'),
pointDefault = document.querySelectorAll('.dropdown-lists__col'),
country = document.querySelectorAll('.dropdown-lists__total-line'),
allLists = document.querySelectorAll('.dropdown-lists__list'),
defaultCountryList = document.querySelector('.dropdown-lists__list--default'),
allCountryCities = document.querySelector('.dropdown-lists__list--select'),
autoCompleteElement = document.querySelector('.dropdown-lists__list--autocomplete'),
mainSection = document.querySelector('.main'),
dropDown = document.querySelector('.dropdown');


// заполняем массив данных для показа
export default function getCityBD(mode, country, searchString, local) {
    City.citiesBuf = [];

    const statusMessage = document.createElement('div');
    statusMessage.style.cssText = 'font-size: 2rem';
    statusMessage.style.color = '#FFFFFF';
    statusMessage.style.marginTop = '30px';
    statusMessage.classList.add('loader');

    button.appendChild(statusMessage);

    City.citiesArray = getCitiesFromStorage();

    if (City.citiesArray === undefined || City.citiesArray.length === 0) {
        const fetchPromise = fetch('./db_cities.json', {mode: 'cors'});
        fetchPromise.then(response => {
            if (response.status !== 200) {
            throw new Error(`Status: ${response.statusText}. Code: ${response.status}.`);
            }
        return response.json();
        }).then(cities => {

        localStorage.setItem('cities', JSON.stringify(cities));

        City.citiesArray = cities[local];
        setTimeout(() => {statusMessage.classList.remove('loader');}, 100);
        City.citiesArray = fillCitiesArray(City.citiesArray, searchString);
        console.log('City.citiesArray: ', City.citiesArray);

        routeCitiesArray(City.citiesArray, searchString);
        });
    } else {
        City.citiesArray = City.citiesArray[City.local];

        // сортировка массива
        City.citiesArray = sortArrayByLocal(City.citiesArray, City.local);

        setTimeout(() => {statusMessage.classList.remove('loader');}, 100);
        City.citiesArray = fillCitiesArray(City.citiesArray, searchString);


        routeCitiesArray(City.citiesArray, searchString);

}
}
