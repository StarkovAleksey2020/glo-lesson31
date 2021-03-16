window.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const inputCity = document.getElementById('select-cities'),
        closeButton = document.querySelector('.close-button'),
        pointDefault = document.querySelectorAll('.dropdown-lists__col'),
        country = document.querySelectorAll('.dropdown-lists__total-line'),
        allLists = document.querySelectorAll('.dropdown-lists__list'),
        defaultCountryList = document.querySelector('.dropdown-lists__list--default'),
        allCountryCities = document.querySelector('.dropdown-lists__list--select');


    class City {
        constructor() {
            this.allCities = {};
            this.cityClicked = false;
        }

        getCityBD() {
            const fetchPromise = fetch('./db_cities.json', {mode: 'cors'});
            fetchPromise.then(response => {
                if (response.status !== 200) {
                  throw new Error(`Status: ${response.statusText}. Code: ${response.status}.`);
                }
                return response.json();
              }).then(cities => {
                this.fillCountryList(cities.RU);
              });
        }

        clearLists() {
            const allListsElement = document.querySelectorAll('.dropdown-lists__list');
            allListsElement.forEach(item => {
                const innerList = item.querySelector('.dropdown-lists__col');
                innerList.innerHTML = '';
            });
        }

        fillCountryList(data, showAllCitiesCountryIndex, citiesCount) {
            this.clearLists();
            let elementForAppendChilds = '';

            // определяем элемент для вставки данных
            if (!this.cityClicked) {
                elementForAppendChilds = document.querySelector('.dropdown-lists__list--default')
                .querySelector('.dropdown-lists__col');
                defaultCountryList.style.display = 'block';
                allCountryCities.style.display = 'none';
            } else {
                elementForAppendChilds = document.querySelector('.dropdown-lists__list--select')
                .querySelector('.dropdown-lists__col');
                defaultCountryList.style.display = 'none';
                allCountryCities.style.display = 'block';
            }

            data.forEach((element, index, array) => {
                // формирование блока для добавления
                let countryItem = `<div class="dropdown-lists__countryBlock">
                    <div class="dropdown-lists__total-line">
                        <div class="dropdown-lists__country">${element.country}</div>
                        <div class="dropdown-lists__count">${element.count}</div>
                    </div>`;

                // сортировка массива городов по численности населения
                const cities = element.cities.sort(this.compareCount);

                // определяем лимит вывода числа городов
                let citiesLimit = 0;
                // если производится первичная отрисовка списка
                if (!this.cityClicked) {
                    if (cities.length < 3) {
                        citiesLimit = cities.length;
                    } else {
                        citiesLimit = 3;
                    }
                    // если список отрисовывается по клику на страну
                } else {
                    // если индекс клинутого элемента совпал с текущим отрисовываемым элементом
                    if (showAllCitiesCountryIndex === index) {
                        // если города до этого были выведены все - снижаем их число в списке 
                        // до 3 (или до максимума длины списка городов)
                        if (citiesCount === cities.length) {
                            citiesLimit = 3;
                        } else {
                            citiesLimit = cities.length;
                        }
                        // определение числа городов в элементах, не совпавших с переданным
                        // по клику индексом
                    } else {
                        if (cities.length < 3) {
                            citiesLimit = cities.length;
                        } else {
                            citiesLimit = 3;
                        }
                    }
                }

                // отрисовка списка городов
                for (let index = 0; index < citiesLimit; index++) {
                    countryItem += `<div class="dropdown-lists__line">
                    <div class="dropdown-lists__city dropdown-lists__city--ip">${cities[index].name}</div>
                    <div class="dropdown-lists__count">${cities[index].count}</div>
                  </div>`;
                }
                countryItem += `</div>`;

                // добавление элементов
                elementForAppendChilds.insertAdjacentHTML('beforeend', countryItem);

                // добавление слушателя на текущий элемент
                const newCountryElement = elementForAppendChilds.querySelectorAll('.dropdown-lists__total-line')[index];
                this.addCountryListeners(newCountryElement, index, array, citiesLimit);
            });
        }

        compareCount(a, b) {
            return +b.count - +a.count;
        }

        addCountryListeners(item, index, array, citiesLimitCurrent) {
            // метод принимает:
            // 1. Элемент, на который вешается слушатель
            // 2. Индекс этого элемента в массиве объектов
            // 3. Сам массив объектов
            // 4. Текущее выведенное число городов по данному элементу
            // Слушатель на элементе вызывает метод перерисовки списка стран/городов
            item.addEventListener('click', () => {
                this.clearLists();
                this.cityClicked = !this.cityClicked;
                this.fillCountryList(array, index, citiesLimitCurrent);
            });
        }

        selectAllCountryCities(element) {
            console.log(element);
        }

        eventsListeners() {
            inputCity.addEventListener('click', () => {
                this.getCityBD();
            });
            inputCity.addEventListener('input', () => {
                this.clearLists();
            });
        }
    }
    const cityObj = new City();
    cityObj.eventsListeners();

});