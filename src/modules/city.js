import getCitiesFromStorage from './getCitiesFromStorage';
import fillCitiesArray from './fillCitiesArray';
import sortArrayByLocal from './sortArrayByLocal';
import getCityBD from './getCityBD';
import clearLists from './clearlists';

// объявляем экранные переменные
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

export default class City {
    constructor() {
        this.citiesArray = {};
        this.cityClicked = false;
        this.cityClickedIndex = undefined;
        this.cityOutputMode = 'default';
        this.searchCity = '';
        this.citiesBuf = [];
        this.local = '';
    }

    // работа с локалью
    createLocal() {
        // проверяем наличие куки с локалью
        const local = this.getCookie('local');
        if (!local) {
            // определяем локаль - если введено неверное значение - устанавливаем RU
            let lang = prompt('Введите локаль (RU, EN, DE)', 'RU');
            if (!['RU', 'EN', 'DE'].includes(lang.toUpperCase())) {
                lang = 'RU';
            }

            // получаем последнюю дату года для занесения в куки
            const today = new Date();
            const expireDate = new Date('December 31, ' + today.getFullYear());

            // заносим куки
            document.cookie = 'local=' + encodeURIComponent(lang) + '; expires=' + expireDate + '; secure';
            this.local = lang;
        } else {
            this.local = local;
        }
    }

    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    // слушатели класса
    eventsListeners() {
        // на клик по полю input
        inputCity.addEventListener('click', () => {
        // получаем таблицу стран/городов в соотвествии с локалью
        getCityBD('default','','', this.local);
        });
        // на ввод подстроки поиска городов
        inputCity.addEventListener('input', (e) => {
            let searchString = e.target.value.trim().toLowerCase();
            this.cityOutputMode = 'autocomplete';
            this.cityClickedIndex = undefined;
            if (searchString.length > 0) {
                getCityBD(this.cityOutputMode, undefined, searchString, this.local);
            } else {
                clearLists();
                this.cityOutputMode = 'default';
                getCityBD(this.cityOutputMode,'','', this.local);
            }
        });
        closeButton.addEventListener('click', (e) => {
            inputCity.value = '';
            label.style.display = 'block';
            closeButton.style.display = 'none';
            button.href = '#';
            button.disabled = true;
            clearLists();
            this.cityOutputMode = 'default';
            getCityBD(this.cityOutputMode,'','', this.local);
        });
    }
}
