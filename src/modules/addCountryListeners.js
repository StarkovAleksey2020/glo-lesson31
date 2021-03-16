import City from './city';

// слушатель на элементы списка - страны (для перехода в режим select)
export default function addCountryListeners(countryArrayElement, countryIndex, cityOutputMode, cityClickedIndex) {
    countryArrayElement.addEventListener('click', (e) => {
        let country = e.target.textContent;
        if (e.target.className !== 'dropdown-lists__country') {
            const line = e.target.closest('.dropdown-lists__total-line');
            country = line.querySelector('.dropdown-lists__country').textContent;
        }

        City.inputCity.value = country;
        City.label.style.display = 'none';
        City.closeButton.style.display = 'block';
        City.cityOutputMode = 'select';
        City.cityClickedIndex = countryIndex;
        City.getCityBD(City.cityOutputMode, City.cityClickedIndex, '', City.local);
    });
}
