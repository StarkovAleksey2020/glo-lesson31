window.addEventListener('DOMContentLoaded', function () {
    'use strict';

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
        autoCompleteElement = document.querySelector('.dropdown-lists__list--autocomplete');


    class City {
        constructor() {
            this.citiesArray = {};
            this.cityClicked = false;
            this.cityClickedIndex = undefined;
            this.cityOutputMode = 'default';
            this.searchCity = '';
            this.citiesBuf = [];
        }

        // заполняем массив данных для показа
        getCityBD(mode, country, searchString) {
            this.citiesBuf = [];

            const fetchPromise = fetch('./db_cities.json', {mode: 'cors'});
            fetchPromise.then(response => {
                if (response.status !== 200) {
                  throw new Error(`Status: ${response.statusText}. Code: ${response.status}.`);
                }
                return response.json();
              }).then(cities => {
                this.citiesArray = cities.RU;

                // заполняем массив со всеми странами/городами
                this.citiesArray.forEach((item, itemIndex) => {
                    item.cities.sort(this.compareCount);
                    let citiesArrayBuf = [];
                    // перебор городов с фильтрацией по искомой подстроке и типу поиска
                    for (let index = 0; index < item.cities.length; index++) {
                        if ((this.cityOutputMode === 'default') ||
                         (this.cityOutputMode === 'select' && itemIndex !== this.cityClickedIndex)) {
                            if (index < 3) {
                                citiesArrayBuf.push(item.cities[index]);
                            }
                        } else if (this.cityOutputMode === 'select' && itemIndex === this.cityClickedIndex) {
                            citiesArrayBuf.push(item.cities[index]);
                        } else if (this.cityOutputMode === 'autocomplete') {
                            if (searchString.length > 0) {
                                const currentCityItem = item.cities[index].name.toLowerCase();
                                if (currentCityItem.indexOf(searchString) !== -1) {
                                    this.citiesBuf.push(item.cities[index]);
                                }
                            }
                        }
                    }
                    item.cities = citiesArrayBuf;
                });

                // в зависимости от типа поиска передаем разные массивы в процедуру отрисовки элементов
                if (this.cityOutputMode === 'default' || this.cityOutputMode === 'select') {
                    this.fillCountryList(this.citiesArray);
                } else {
                    this.fillCountryList(this.citiesBuf);
                }
              });
        }

        // процедура очистки экранных элементов
        clearLists() {
            const allListsElement = document.querySelectorAll('.dropdown-lists__list');
            allListsElement.forEach(item => {
                const innerList = item.querySelector('.dropdown-lists__col');
                innerList.innerHTML = '';
            });
        }

        // процедура отрисовки элементов
        fillCountryList(data) {
            this.clearLists();
            let elementForAppendChilds = '';

            // определяем корневой элемент для вставки данных
            if (this.cityOutputMode === 'default') {
                elementForAppendChilds = document.querySelector('.dropdown-lists__list--default')
                .querySelector('.dropdown-lists__col');
                defaultCountryList.style.display = 'block';
                allCountryCities.style.display = 'none';
                autoCompleteElement.style.display = 'none';
            } else if (this.cityOutputMode === 'select'){
                elementForAppendChilds = document.querySelector('.dropdown-lists__list--select')
                .querySelector('.dropdown-lists__col');
                defaultCountryList.style.display = 'none';
                autoCompleteElement.style.display = 'none';
                allCountryCities.style.display = 'block';
            } else if (this.cityOutputMode === 'autocomplete'){
                elementForAppendChilds = document.querySelector('.dropdown-lists__list--autocomplete')
                .querySelector('.dropdown-lists__col');
                defaultCountryList.style.display = 'none';
                allCountryCities.style.display = 'none';
                autoCompleteElement.style.display = 'block';
            }

            // отрисовка блоков для вариантов default & select
            if (this.cityOutputMode === 'default' || this.cityOutputMode === 'select') {
                data.forEach((element, index, array) => {
                    // формирование блока для добавления
                    let countryItem = `<div class="dropdown-lists__countryBlock">
                        <div class="dropdown-lists__total-line">
                            <div class="dropdown-lists__country">${element.country}</div>
                            <div class="dropdown-lists__count">${element.count}</div>
                        </div>`;

                    // отрисовка списка городов
                    for (let i = 0; i < data[index].cities.length; i++) {
                        countryItem += `<div class="dropdown-lists__line" data-url="${data[index].cities[i].link}">
                        <div class="dropdown-lists__city" data-url="${data[index].cities[i].link}">
                        ${data[index].cities[i].name}</div>
                        <div class="dropdown-lists__count" data-url="${data[index].cities[i].link}">
                        ${data[index].cities[i].count}</div>
                    </div>`;
                    }
                    countryItem += `</div>`;

                    // добавление элементов
                    elementForAppendChilds.insertAdjacentHTML('beforeend', countryItem);

                    // добавление слушателя на текущий элемент - государство
                    const newCountryElement = elementForAppendChilds
                    .querySelectorAll('.dropdown-lists__total-line')[index];
                    
                    this.addCountryListeners(newCountryElement, index);
                });
                // отрисовываем список городов без стран или сообщение "Ничего не найдено"
            } else {
                if (data.length > 0 ) {
                    data.forEach((element, index) => {
                        let citiesItem = `<div class="dropdown-lists__countryBlock">
                                <div class="dropdown-lists__line" data-url="${element.link}">
                                <div class="dropdown-lists__city" data-url="${element.link}">${element.name}</div>
                                <div class="dropdown-lists__count" data-url="${element.link}">${element.count}</div>
                            </div>
                        </div>`;
                        // добавление элементов
                        elementForAppendChilds.insertAdjacentHTML('beforeend', citiesItem);
                    });
                } else {
                    const messageNothingFound = `<div class="dropdown-lists__countryBlock">
                        <div class="dropdown-lists__line">
                            <div class="dropdown-lists__city">Ничего не найдено</div>
                            <div class="dropdown-lists__count"></div>`;
                    elementForAppendChilds.insertAdjacentHTML('beforeend', messageNothingFound);
                }
            }

            // добавление поведения на клик по городу
            const allCities = elementForAppendChilds.querySelectorAll('.dropdown-lists__line');
            allCities.forEach(item => {
                item.addEventListener('click', (e) => {
                    let city = e.target.textContent.trim();
                    if (e.target.className !== 'dropdown-lists__city') {
                        const line = e.target.closest('.dropdown-lists__line');
                        city = line.querySelector('.dropdown-lists__city').textContent.trim();
                    }
                    inputCity.value = city;
                    button.href = e.target.dataset.url;
                    button.disabled = false;
                    label.style.display = 'none';
                    closeButton.style.display = 'block';
                });
            });
        }

        // сортировка массива по убыванию
        compareCount(a, b) {
            return +b.count - +a.count;
        }

        // слушатель на элементы списка - страны (для перехода в режим select)
        addCountryListeners(countryArrayElement, countryIndex) {
            countryArrayElement.addEventListener('click', (e) => {
                let country = e.target.textContent;
                if (e.target.className !== 'dropdown-lists__country') {
                    const line = e.target.closest('.dropdown-lists__total-line');
                    country = line.querySelector('.dropdown-lists__country').textContent;
                }

                inputCity.value = country;
                label.style.display = 'none';
                closeButton.style.display = 'block';
                this.cityOutputMode = 'select';
                this.cityClickedIndex = countryIndex;
                this.getCityBD(this.cityOutputMode, this.cityClickedIndex);
            });
        }

        // слушатели класса
        eventsListeners() {
            // на клик по полю input
            inputCity.addEventListener('click', () => {
                this.getCityBD('default');
            });
            // на ввод подстроки поиска городов
            inputCity.addEventListener('input', (e) => {
                let searchString = e.target.value.trim().toLowerCase();
                this.cityOutputMode = 'autocomplete';
                this.cityClickedIndex = undefined;
                if (searchString.length > 0) {
                    this.getCityBD(this.cityOutputMode, undefined, searchString);
                } else {
                    this.clearLists();
                    this.cityOutputMode = 'default';
                    this.getCityBD(this.cityOutputMode);
                }
            });
            closeButton.addEventListener('click', (e) => {
                inputCity.value = '';
                label.style.display = 'block';
                closeButton.style.display = 'none';
                button.href = '#';
                button.disabled = true;
                this.clearLists();
                this.cityOutputMode = 'default';
                this.getCityBD(this.cityOutputMode);
            });
        }
    }
    // создание экземпляра класса и подключение слушателей событий
    const cityObj = new City();
    inputCity.value = '';
    button.disabled = true;
    cityObj.eventsListeners();

});