// сортировка массива по локали
// входящие данные: массив, который будет преобразовываться; локаль
// на выходе: преобразованный массив
export default function sortArrayByLocal(array, locale) {
    const countryArray = [
        {"RU": [
            {"country": 
                ['РОССИЯ', 'RUSSIA', 'RUSSLAND']
            }
        ],
        "DE": [
            {"country":
                ['ГЕРМАНИЯ', 'GERMANY', 'DEUTSCHLAND']
            }
        ],
        "EN": [
            {"country":
                ['АНГЛИЯ', 'UNITED KINGDOM', 'ENGLAND']
            }
        ]
    }];
    const localeArray = countryArray[0][locale][0].country;

    let newArray = array.filter((item) => {
        if (localeArray.includes(item.country.toUpperCase())) {
            return true;
        }
    });
    const localCountry = newArray[0].country.toUpperCase();

    array.forEach((item) => {
        if (item.country.toUpperCase() !== localCountry) {
            newArray.push(item);
        }
    });
    return newArray;
}
