import compareCount from './compareCount';
import City from './city';

// заполняем массив со всеми странами/городами
export default function fillCitiesArray(array, searchString) {
    array.forEach((item, itemIndex) => {
        item.cities.sort(compareCount);
        let citiesArrayBuf = [];
        // перебор городов с фильтрацией по искомой подстроке и типу поиска
        for (let index = 0; index < item.cities.length; index++) {
            if ((City.cityOutputMode === 'default') ||
                (City.cityOutputMode === 'select' && itemIndex !== City.cityClickedIndex)) {
                if (index < 3) {
                    citiesArrayBuf.push(item.cities[index]);
                }
            } else if (City.cityOutputMode === 'select' && itemIndex === City.cityClickedIndex) {
                citiesArrayBuf.push(item.cities[index]);
            } else if (City.cityOutputMode === 'autocomplete') {
                if (searchString.length > 0) {
                    const currentCityItem = item.cities[index].name.toLowerCase();
                    if (currentCityItem.indexOf(searchString) !== -1) {
                        City.citiesBuf.push(item.cities[index]);
                    }
                }
            }
        }
        item.cities = citiesArrayBuf;
    });
    return array;
}
