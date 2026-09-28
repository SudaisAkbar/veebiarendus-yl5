//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";

let korv = [];
let tarneHind = 0; // Bonus: delivery fee

const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');

lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: parseFloat(toodeInfo.querySelector(".toode_hind").innerText),
            kogus: 1
        };

        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        
        if (!onKorvis) {
            lisaArtikkel(toode);
            korv.push(toode);
            nupuOhjamine(lisaKorviNupp, toode);
            arvutaKogusumma(); // Task 5.2
        }
    });
});

// Function to add item HTML into the cart
function lisaArtikkel(toode) {
    let artiklidKonteiner = korviSisu.querySelector('.korv-artiklid');
    if (!artiklidKonteiner) {
        artiklidKonteiner = korviSisu;
    }

    artiklidKonteiner.insertAdjacentHTML('beforeend', `
        <div class="korv_artikkel">
            <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
            <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
            <div class="korv_artikkel_buttons">  
                <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
                <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
                <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
                <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
            </div>
        </div>
    `);

    lisaKorviJalus();
}

// Function to attach button listeners inside cart items
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

// Increase item quantity (+)
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;
            arvutaKogusumma(); // Task 5.2
        }
    });
}

// Task 5.1: Decrease item quantity (-)
function vahendaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            if (korvArtikkel.kogus > 1) {
                korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = --korvArtikkel.kogus;
                arvutaKogusumma(); // Task 5.2
            } else {
                eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp);
            }
        }
    });
}

// Remove item from cart (x)
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;

    if (korv.length < 1) {
        const jalus = document.querySelector('.korv-jalus');
        if (jalus) jalus.remove();
    }
    arvutaKogusumma(); // Task 5.2
}

// Add cart footer with buttons and total line
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
            <div class="korv-jalus">
                <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
                <button class="btn" data-action="kassa">Maksma</button>
                <h3 id="kokku_rida" style="margin-left: 1rem; align-self: center;">Kokku: <span id="summa">0.00</span> €</h3>
            </div>
        `);

        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => kassa());
    }
}

// Empty entire cart
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    const jalus = document.querySelector('.korv-jalus');
    if (jalus) jalus.remove();

    lisaKorviNupud.forEach(lisaKorviNupp => {
        lisaKorviNupp.innerText = 'Lisa ostukorvi';
        lisaKorviNupp.disabled = false;
    });

    korv = [];
    arvutaKogusumma(); // Task 5.2
}

// Task 5.2 & Bonus: Calculate total shopping cart price including delivery
function arvutaKogusumma() {
    const summaElement = document.getElementById("summa");
    if (!summaElement) return;

    let kokku = 0;
    korv.forEach(toode => {
        kokku += toode.hind * toode.kogus;
    });

    if (korv.length > 0) {
        kokku += tarneHind;
    }

    summaElement.innerText = kokku.toFixed(2);
}


//-------------------------2. osa Taimer ------------------------

let taimerInterval = null;

function alustaTaimer(kestvus, kuva) {
    let start = Date.now(),
        vahe,
        minutid,
        sekundid;

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent = minutid + ":" + sekundid;

        if (vahe < 0) {
            clearInterval(taimerInterval);
            document.getElementById("time").innerHTML = "alusta uuesti";
        }
    }
    taimer();
    taimerInterval = setInterval(taimer, 1000);
}

// Adventure bonus: Start timer only when "Maksma" is clicked
function kassa() {
    if (!taimerInterval) {
        let taimeriAeg = 60 * 2,
            kuva = document.getElementById("time");
        alustaTaimer(taimeriAeg, kuva);
    }
    document.getElementById("form").scrollIntoView({ behavior: "smooth" });
}


//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const telefon = document.getElementById("telefon");
const aadress = document.getElementById("aadress"); // minu kood
const kinnitus = document.getElementById("kinnitus");
const errorMessage = document.getElementById("errorMessage");
const tarneValikud = document.querySelectorAll('input[name="tarne"]');

// Bonus: Update total when delivery method changes
tarneValikud.forEach(raadio => {
    raadio.addEventListener("change", (e) => {
        tarneHind = parseFloat(e.target.value);
        arvutaKogusumma();
    });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    // First name must not be empty and must not contain digits
    if (eesnimi.value.trim() === "") {
        errors.push("Sisesta eesnimi");
    } else if (/\d/.test(eesnimi.value)) {
        errors.push("Eesnime väljal ei tohi olla numbreid");
    }

    // Last name must not be empty and must not contain digits
    if (perenimi.value.trim() === "") {
        errors.push("Sisesta perenimi");
    } else if (/\d/.test(perenimi.value)) {
        errors.push("Perenime väljal ei tohi olla numbreid");
    }

    // Phone: at least 6 characters and digits only
    const telVaartus = telefon.value.trim();
    if (telVaartus.length < 6 || !/^\d+$/.test(telVaartus)) {
        errors.push("Telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid");
    }

    // minu kood: Validate custom field (Aadress must be at least 4 characters)
    // minu kood
    if (aadress.value.trim().length < 4) {
        errors.push("Sisesta korrektne aadress");
    }
    // minu kood

    // One radio button must be selected
    let tarneValitud = false;
    tarneValikud.forEach(raadio => {
        if (raadio.checked) tarneValitud = true;
    });
    if (!tarneValitud) {
        errors.push("Üks raadionuppudest peab olema valitud");
    }

    // Checkbox agreement
    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    if (errors.length > 0) {
        errorMessage.innerHTML = errors.join('<br>');
    } else {
        errorMessage.innerHTML = "";
        alert("Tellimus edukalt esitatud!");
        form.reset();
        tuhjendaKorv();
    }
});