window.addEventListener("DOMContentLoaded",(function(){"use strict";const t=document.getElementById("select-cities"),e=(document.querySelector(".close-button"),document.querySelector("dropdown-lists__col")),s=document.querySelectorAll("dropdown-lists__total-line");document.querySelector("dropdown-lists__list--select"),(new class{constructor(){this.allCities={}}getCityBD(){fetch("./db_cities.json",{mode:"cors"}).then((t=>{if(200!==t.status)throw new Error(`Status: ${t.statusText}. Code: ${t.status}.`);return t.json()})).then((t=>{this.fillCountryList(t.RU)}))}fillCountryList(t){t.forEach(((t,n,o)=>{let i=`<div class="dropdown-lists__countryBlock">\n                    <div class="dropdown-lists__total-line">\n                        <div class="dropdown-lists__country">${s.country}</div>\n                        <div class="dropdown-lists__count">${s.count}</div>\n                    </div>`;i+="</div>",e.insertAdjacentHTML("beforeend",i)}))}addCurrencyItem(t,e){currencySelect.insertAdjacentHTML("beforeend",`<option value='${1e4*e}'>${t}</option>`)}eventsListeners(){t.addEventListener("click",(()=>{this.getCityBD()}))}}).eventsListeners()}));