// процедура очистки экранных элементов
export default function clearLists() {
    const allListsElement = document.querySelectorAll('.dropdown-lists__list');
    allListsElement.forEach(item => {
        const innerList = item.querySelector('.dropdown-lists__col');
        innerList.innerHTML = '';
    });
}
