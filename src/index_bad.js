    'use strict';

    import sortArrayByLocal from './modules/sortArrayByLocal';
    import getCitiesFromStorage from './modules/getCitiesFromStorage';
    import routeCitiesArray from './modules/routeCitiesArray';
    import fillCitiesArray from './modules/fillCitiesArray';
    import clearLists from './modules/clearlists';
    import fillCountryList from './modules/fillCountryList';
    import City from './modules/city';

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


    // создание экземпляра класса и подключение слушателей событий
    const cityObj = new City();
    inputCity.value = '';
    button.disabled = true;

    cityObj.createLocal();

    cityObj.eventsListeners();