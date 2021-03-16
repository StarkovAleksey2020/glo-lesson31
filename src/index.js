    'use strict';

    import sortArrayByLocal from './modules/sortArrayByLocal';
    import routeCitiesArray from './modules/routeCitiesArray';
    import clearLists from './modules/clearLists';
    import compareCount from './modules/compareCount';
    import getCookie from './modules/getCookie';

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


    class City {
        constructor() {
            this.citiesArray = {};
            this.cityClicked = false;
            this.cityClickedIndex = undefined;
            this.cityOutputMode = 'default';
            this.searchCity = '';
            this.citiesBuf = [];
            this.local = '';
        }

        getCitiesFromStorage() {
            return localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : [];
        }

        // заполняем массив данных для показа
        getCityBD(mode, country, searchString, local) {
            this.citiesBuf = [];

            const statusMessage = document.createElement('div');
            statusMessage.style.cssText = 'font-size: 2rem';
            statusMessage.style.color = '#FFFFFF';
            statusMessage.style.marginTop = '30px';
            statusMessage.classList.add('loader');
            button.appendChild(statusMessage);
          
            this.citiesArray = this.getCitiesFromStorage();

            if (this.citiesArray === undefined || this.citiesArray.length === 0) {
                const fetchPromise = fetch('./db_cities.json', {mode: 'cors'});
                fetchPromise.then(response => {
                    if (response.status !== 200) {
                    throw new Error(`Status: ${response.statusText}. Code: ${response.status}.`);
                    }
                return response.json();
              }).then(cities => {

                localStorage.setItem('cities', JSON.stringify(cities));

                this.citiesArray = cities[local];
                setTimeout(() => {statusMessage.classList.remove('loader');}, 100);
                this.citiesArray = this.fillCitiesArray(this.citiesArray, searchString);

                routeCitiesArray(this.citiesArray, searchString, this);
              });
            } else {
                this.citiesArray = this.citiesArray[this.local];

                // сортировка массива
                this.citiesArray = sortArrayByLocal(this.citiesArray, this.local);

                setTimeout(() => {statusMessage.classList.remove('loader');}, 100);
                this.citiesArray = this.fillCitiesArray(this.citiesArray, searchString);

                routeCitiesArray(this.citiesArray, searchString, this);

            }
        }

        // заполняем массив со всеми странами/городами
        fillCitiesArray(array, searchString) {
            array.forEach((item, itemIndex) => {
                item.cities.sort(compareCount);
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
            return array;
        }
        // процедура отрисовки элементов
        fillCountryList(data, searchString) {
            clearLists();
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

                    // первоначальные настройки для анимации списка стран/городов
                    dropDown.style.position = 'absolute';
                    if (this.cityOutputMode === 'default') {
                        dropDown.style.left = '-40px';
                    } else if (this.cityOutputMode === 'select') {
                        dropDown.style.left = '40px';
                    }
                    dropDown.style.opacity = 0;
                    
                   // добавление элементов
                   elementForAppendChilds.insertAdjacentHTML('beforeend', countryItem);

                   // анимация списка
                   let start = 0;
                   let animation = setInterval(() => {
                       if (start === 40) {
                           clearInterval(animation);
                           dropDown.style.position = 'relative';
                           return;
                       }
                       draw(start);
                       start++;
                   }, 5);

                   let draw = (counter) => {
                    if (this.cityOutputMode === 'default') {
                        dropDown.style.transform = `translateX(${counter}px)`;
                    } else if (this.cityOutputMode === 'select') {
                        dropDown.style.transform = `translateX(-${counter}px)`;
                    }
                        dropDown.style.opacity = counter / 40;
                   };

                    // добавление слушателя на текущий элемент - государство
                    const newCountryElement = elementForAppendChilds
                    .querySelectorAll('.dropdown-lists__total-line')[index];
                    
                    this.addCountryListeners(newCountryElement, index);
                });
                // отрисовываем список городов без стран или сообщение "Ничего не найдено"
            } else {
                if (data.length > 0 ) {
                    data.forEach((element, index) => {
                        // выделение искомой подстроки в наименовании города
                        let cityNameFirst = '',
                        cityNameSecond = '',
                        cityNameThird = '',
                        cityResult = '';

                        let firstSubstring = element.name.toLowerCase().indexOf(searchString.toLowerCase());
                        
                        let lastSubstring = element.name.toLowerCase()
                        .indexOf(searchString.toLowerCase().substring(searchString.length - 1));

                        // если искомая подстрока - в начале наименования города
                        if (firstSubstring === 0) {
                            cityNameFirst = element.name.substring(firstSubstring, lastSubstring + 1);
                            if (lastSubstring < element.name.length) {
                                cityNameSecond = element.name.substring(lastSubstring + 1);
                            }
                            cityResult = `<strong>${cityNameFirst}</strong>${cityNameSecond}`;
                        // если подстрока в середине наименования города
                        } else if (firstSubstring > 0) {
                            cityNameFirst = element.name.substring(0, firstSubstring);
                            cityNameSecond = searchString;
                            const endSearchStringCurrent = cityNameFirst.length + searchString.length;
                            if (lastSubstring < element.name.length) {
                                cityNameThird = element.name.substring(endSearchStringCurrent);
                            }
                            cityResult = `${cityNameFirst}<strong>${cityNameSecond}</strong>${cityNameThird}`;
                        }
                        let citiesItem = `<div class="dropdown-lists__countryBlock">
                                <div class="dropdown-lists__line" data-url="${element.link}">
                                <div class="dropdown-lists__city" data-url="${element.link}">${cityResult}</div>
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
                this.getCityBD(this.cityOutputMode, this.cityClickedIndex, '', this.local);
            });
        }

        // работа с локалью
        createLocal() {
            // проверяем наличие куки с локалью
            const local = getCookie('local');
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


        // слушатели класса
        eventsListeners() {
            // на клик по полю input
            inputCity.addEventListener('click', () => {
            // получаем таблицу стран/городов в соотвествии с локалью
            this.getCityBD('default','','', this.local);
            });
            // на ввод подстроки поиска городов
            inputCity.addEventListener('input', (e) => {
                let searchString = e.target.value.trim().toLowerCase();
                this.cityOutputMode = 'autocomplete';
                this.cityClickedIndex = undefined;
                if (searchString.length > 0) {
                    this.getCityBD(this.cityOutputMode, undefined, searchString, this.local);
                } else {
                    clearLists();
                    this.cityOutputMode = 'default';
                    this.getCityBD(this.cityOutputMode,'','', this.local);
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
                this.getCityBD(this.cityOutputMode,'','', this.local);
            });
        }
    }
    // создание экземпляра класса и подключение слушателей событий
    const cityObj = new City();
    inputCity.value = '';
    button.disabled = true;

    cityObj.createLocal();

    cityObj.eventsListeners();

