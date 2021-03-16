//import fillCountryList from './fillCountryList';
//import * from '../index';

// сборка массива стран/городов в зависимости от типа события
export default function routeCitiesArray(array, searchString, _this) {
    // в зависимости от типа поиска передаем разные массивы в процедуру отрисовки элементов
    if (_this.cityOutputMode === 'default' || _this.cityOutputMode === 'select') {
        _this.fillCountryList(array);
    } else {
        _this.fillCountryList(_this.citiesBuf, searchString);
    }
}
