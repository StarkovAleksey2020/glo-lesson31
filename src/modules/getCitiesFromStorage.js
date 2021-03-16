// возвращает из localStorage (при наличии) массив стран/городов
export default function getCitiesFromStorage() {
    return localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : [];
}
