import clearLists from './clearlists';
import addCountryListeners from './addCountryListeners';
import City from './city';

// процедура отрисовки элементов
export default function fillCountryList(data, searchString) {
    clearLists();
    const allCountryCities = document.querySelector('.dropdown-lists__list--select'),
    button = document.querySelector('.button'),
    closeButton = document.querySelector('.close-button'),
    label = document.querySelector('.label'),
    inputCity = document.getElementById('select-cities'),
    autoCompleteElement = document.querySelector('.dropdown-lists__list--autocomplete'),
    dropDown = document.querySelector('.dropdown'),
    defaultCountryList = document.querySelector('.dropdown-lists__list--default');

    let elementForAppendChilds = '';

    // определяем корневой элемент для вставки данных
    if (City.cityOutputMode === 'default') {
        elementForAppendChilds = document.querySelector('.dropdown-lists__list--default')
        .querySelector('.dropdown-lists__col');
        defaultCountryList.style.display = 'block';
        allCountryCities.style.display = 'none';
        autoCompleteElement.style.display = 'none';
    } else if (City.cityOutputMode === 'select'){
        elementForAppendChilds = document.querySelector('.dropdown-lists__list--select')
        .querySelector('.dropdown-lists__col');
        defaultCountryList.style.display = 'none';
        autoCompleteElement.style.display = 'none';
        allCountryCities.style.display = 'block';
    } else if (City.cityOutputMode === 'autocomplete'){
        elementForAppendChilds = document.querySelector('.dropdown-lists__list--autocomplete')
        .querySelector('.dropdown-lists__col');
        defaultCountryList.style.display = 'none';
        allCountryCities.style.display = 'none';
        autoCompleteElement.style.display = 'block';
    }

    // отрисовка блоков для вариантов default & select
    if (City.cityOutputMode === 'default' || City.cityOutputMode === 'select') {
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
            if (City.cityOutputMode === 'default') {
                dropDown.style.left = '-40px';
            } else if (City.cityOutputMode === 'select') {
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
            if (City.cityOutputMode === 'default') {
                dropDown.style.transform = `translateX(${counter}px)`;
            } else if (City.cityOutputMode === 'select') {
                dropDown.style.transform = `translateX(-${counter}px)`;
            }
                dropDown.style.opacity = counter / 40;
            };

            // добавление слушателя на текущий элемент - государство
            const newCountryElement = elementForAppendChilds
            .querySelectorAll('.dropdown-lists__total-line')[index];
            
            addCountryListeners(newCountryElement, index);
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
