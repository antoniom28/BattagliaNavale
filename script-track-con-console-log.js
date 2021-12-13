let lettera = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

const contenitoreNemico = document.getElementById('contenitore-nemico');
const contenitore = document.getElementById('contenitore');

/* Genera il bootstrap per l'intero tabellone di gioco di entrambi */
for (let i = 0; i < 10; i++) {
    contenitore.innerHTML += `<div class="row" id="row${i}">`;
    
    contenitoreNemico.innerHTML += `<div class="row" id="row${i}-nemico">`;

    const row = document.getElementById('row' + i);
    const rowNemico = document.getElementById('row' + i + '-nemico');

    if (i == 0) {
        for (let j = 0; j < 10; j++) {
            if (j == 0) {
                row.innerHTML += '<div class="col"></div>';
                rowNemico.innerHTML += '<div class="col"></div>';
            } else {
                row.innerHTML += '<div class="col">' + lettera[j] + '</div>';
                rowNemico.innerHTML += '<div class="col">' + lettera[j] + '</div>';
            }
        }
    } else
        for (let j = 0; j < 10; j++) {
            if (j == 0) {
                row.innerHTML += '<div class="col">' + i + '</div>';
                rowNemico.innerHTML += '<div class="col">' + i + '</div>';
            }
            else {
                row.innerHTML += `<div class="col"><div onclick="piazzaNave('${lettera[j]+i}')" id="${lettera[j] + i}"><div class="nave"></div></div></div>`;
                rowNemico.innerHTML += `<div class="col"><div id="${lettera[j] + i}-nemica"><div class="nave"></div></div></div>`;
            }
        }
}

let fasePreparazione = 0;
/* Variabile per distinguire tra la fase di preparazione e di inizio gioco */

let puntiUtente = 0;
let puntiNemico = 0;
/* Calcola punti */

let sceltaUtente1 = '';
let sceltaUtente2 = '';

let primaScelta = 0;
/* distingue tra sceltaUtente1 e 2  */

let indiceLettera = 0;
let indiceNumero = 0;
let indiceLettera2 = 0;
let indiceNumero2 = 0;

let indiciGiaScelti = [];
let nGiaScelti = 0;
/* Controllerà man mano tutti gli indici già scelti per non far sovrapporre navi,
o far colpire più volte una stessa coordinata*/

let naveDaTre = 1;
/* Inserita per gestire il caso navedatre nel piazzamento navi */

let j = 0;
let i = 0;
let errore = 0;
/* variabile errore, se alla fine */

let naviDaPiazzare = [5, 4, 3, 3, 2];
let naviDaPiazzareNemica = [5, 4, 3, 3, 2];
/* farà in modo da far inserire una sola volta la nave di quella lunghezza */

function piazzaNave(scelta) {
    let somma = 0;
    for (let n = 0; n < 5; n++) {
        somma += naviDaPiazzare[n];
    }
    if (somma == 0)
        return;

    indiceLettera = 0;
    indiceNumero = 0;
    indiceLettera2 = 0;
    indiceNumero2 = 0;
    j = 0;
    i = 0;
    errore = 0;

    while (indiceLettera == 0 || indiceLettera2 == 0
        || indiceNumero == 0 || indiceNumero2 == 0 || errore == 0) {
        if (primaScelta == 0) {
            indiceLettera = '';
            indiceNumero = 0;
            sceltaUtente1 = scelta;
            primaScelta = 1;
            document.getElementById(scelta).className += ' stai-scegliendo';
            /* Serve per colorare le coordinate che si stanno scegliendo */
        } else {
            indiceLettera2 = '';
            indiceNumero2 = 0;
            sceltaUtente2 = scelta;
            primaScelta = 0;
            document.getElementById(sceltaUtente1).classList.remove('stai-scegliendo')
            if (sceltaUtente1 > sceltaUtente2) {
                /* Per fare un solo ciclo for da 0 a 9, scambio le scelte se per caso
                la coordinata2 fosse più grande della coordinata1 */
                let t = sceltaUtente2;
                sceltaUtente2 = sceltaUtente1;
                sceltaUtente1 = t;
            }
        }

        /* tutti questi while "estraggono" dalle scelte dell'utente gli indici
        delle coordinate, per poi facilitiare i controlli sui singoli */
        i = 0;
        while (indiceLettera == 0) {
            if (sceltaUtente1.includes(lettera[i])) {
                indiceLettera = i;
            }
            i++;
            if (i > 10)
                break;
        }

        i = 0;
        while (indiceLettera2 == 0) {
            if (sceltaUtente2.includes(lettera[i])) {
                indiceLettera2 = i;
            }
            i++;
            if (i > 10)
                break;
        }

        i = 0;
        while (indiceNumero == 0) {
            if (sceltaUtente1.includes(i)) {
                indiceNumero = i;
            }
            i++;
            if (i > 10)
                break;
        }

        i = 0;
        while (indiceNumero2 == 0) {
            if (sceltaUtente2.includes(i)) {
                indiceNumero2 = i;
            }
            i++;
            if (i > 10)
                break;
        }


        if (sceltaUtente1.length == 2 && sceltaUtente2.length == 2)
            errore = 1;
        console.log('errore coordinate di 3 ecc. == ', errore);

        /* Controlla se gli indici sono solamente orizzontali o verticali */
        if (errore == 1) {
            if (indiceNumero < indiceNumero2 && indiceLettera == indiceLettera2)
                errore = 1;
            else if (indiceLettera < indiceLettera2 && indiceNumero == indiceNumero2)
                errore = 1;
            else
                errore = 0;
        }
        console.log('errore indici == ', errore);

        if (primaScelta == 1) {
            errore = 0;
            break;
        }

        /* Evita che l'utente possa mettere navi sovrapposte */
        if (errore == 1) {
            for (let n = 0; n < nGiaScelti; n++) {
                if (indiceLettera == indiceLettera2) {
                    for (let iN = indiceNumero; iN <= indiceNumero2; iN++) {
                        if (lettera[indiceLettera] + iN == indiciGiaScelti[n]) {
                            errore = 0;
                            console.log('trovato un gia scelto');
                            break;
                        }
                    }
                } else if (indiceNumero == indiceNumero2) {
                    for (let iL = indiceLettera; iL <= indiceLettera2; iL++) {
                        if (lettera[iL] + indiceNumero == indiciGiaScelti[n]) {
                            errore = 0;
                            console.log('trovato un gia scelto');
                            break;
                        }
                    }
                }
                if (errore == 0)
                    break;
            }
        }
        console.log('errore gia scelta == ', errore);

        /* Controlla se stiamo per inserire una nave di lunghezza X già inserita*/
        if (errore == 1) {
            if (indiceNumero != indiceNumero2) {
                for (let n = 0; n < 5; n++) {
                    if (naviDaPiazzare[n] == (indiceNumero2 - indiceNumero + 1)) {
                        naviDaPiazzare[n] = 0;
                        console.log('verticale navidapizzare[', n, '] = ', naviDaPiazzare[n]);
                        console.log('la nave di lunghezza', (indiceNumero2 - indiceNumero + 1), 'va bene');
                        break;
                    } else if (n == 4) {
                        errore = 0;
                        console.log('la nave è più di 5,4,3,2');
                    }
                }
            } else {
                for (let n = 0; n < 5; n++) {
                    if (naviDaPiazzare[n] == (indiceLettera2 - indiceLettera + 1)) {
                        naviDaPiazzare[n] = 0;
                        console.log('orizzontale navidapizzare[', n, '] = ', naviDaPiazzare[n]);
                        console.log('la nave di lunghezza', (indiceLettera2 - indiceLettera + 1), 'va bene');
                        break;
                    } else if (n == 4) {
                        errore = 0;
                        console.log('la nave è più di 5,4,3,2');
                    }
                }
            }
        }
        console.log('errore di lunghezza == ', errore);


        console.log('indice lettera 1 :', indiceLettera, 'ovvero', lettera[indiceLettera]);
        console.log('indice lettera 2 :', indiceLettera2, 'ovvero', lettera[indiceLettera2]);

        console.log('indice numero1 :', indiceNumero);
        console.log('indice numero2 :', indiceNumero2);
    }

    let x = 0;
    let y = 0;
    if (errore == 1) {
        fasePreparazione++;
        if (fasePreparazione > 4)
            setTimeout(function () {
                document.getElementById('caselle').style.display = 'none';
            }, 1200);
        if (indiceNumero == indiceNumero2) { /* Piazzamento navi ORIZZONTALI */ /* Piazzamento navi ORIZZONTALI */
            if (indiceLettera2 - indiceLettera + 1 != 3) {
                /* Tiene conto di quante e quali navi abbiamo piazzato */
                document.getElementById('caselle-' + (indiceLettera2 - indiceLettera + 1)).innerHTML
                    = 'Nave da ' + (indiceLettera2 - indiceLettera + 1) + ' caselle : <strong> 0 </strong>';
            } else {
                document.getElementById('caselle-' + (indiceLettera2 - indiceLettera + 1)).innerHTML
                    = 'Nave da ' + (indiceLettera2 - indiceLettera + 1) + ' caselle : ' + '<strong>' + naveDaTre + '</strong>';
                naveDaTre = 0;
            }
            let n = nGiaScelti;
            let xx = indiceLettera;
            nGiaScelti = nGiaScelti + (indiceLettera2 - indiceLettera + 1);
            /* Inseriamo nel controllo degli indici già scelti, le coordinate appena inserite
            (qui siamo sicuri che le coordinate sono corrette, arrivando qui con errore ==1 
            significa che ha passato tutti gli altri controlli) */
            for (n; n < nGiaScelti; n++) {
                if (indiciGiaScelti[n] = lettera[xx] + indiceNumero)
                    indiciGiaScelti[n] = lettera[xx++] + indiceNumero;
                console.log('VERTIC inserito', indiciGiaScelti[n], 'nei gia scelti');
            }

            x = lettera[indiceLettera];
            y = indiceNumero;
            console.log('prendo primo id : ', x + y);
            document.getElementById(x + y).className += ' metti-nave-orizzontale orizzontale-sx';
            while (indiceLettera != indiceLettera2 - 1) {
                x = lettera[indiceLettera + 1];
                y = indiceNumero;
                console.log('prendo id : ', x + y);
                document.getElementById(x + y).className += ' metti-nave-orizzontale';
                indiceLettera++;
            }
            x = lettera[indiceLettera + 1];
            y = indiceNumero;
            console.log('prendo ultimo id : ', x + y);
            document.getElementById(x + y).className += ' metti-nave-orizzontale orizzontale-dx';
        } else { /* Piazzamento navi VERTICALI */ /* Piazzamento navi VERTICALI */
            if (indiceNumero2 - indiceNumero + 1 != 3) {
                document.getElementById('caselle-' + (indiceNumero2 - indiceNumero + 1)).innerHTML
                    = 'Nave da ' + (indiceNumero2 - indiceNumero + 1) + ' caselle : <strong> 0 </strong>';
            } else {
                document.getElementById('caselle-' + (indiceNumero2 - indiceNumero + 1)).innerHTML
                    = 'Nave da ' + (indiceNumero2 - indiceNumero + 1) + ' caselle : ' + '<strong>' + naveDaTre + '</strong>';
                naveDaTre = 0;
            }
            let n = nGiaScelti;
            let xx = indiceNumero;
            nGiaScelti = nGiaScelti + (indiceNumero2 - indiceNumero + 1);
            for (n; n < nGiaScelti; n++) {
                if (indiciGiaScelti[n] = lettera[indiceLettera] + xx)
                    indiciGiaScelti[n] = lettera[indiceLettera] + xx++;
                console.log('VERTIC inserito', indiciGiaScelti[n], 'nei gia scelti');
            }

            x = lettera[indiceLettera];
            y = indiceNumero;
            console.log('prendo primo id : ', x + y);
            document.getElementById(x + y).className += ' metti-nave-verticale verticale-sx';
            while (indiceNumero != indiceNumero2 - 1) {
                x = lettera[indiceLettera];
                y = indiceNumero + 1;
                console.log('prendo id : ', x + y);
                document.getElementById(x + y).className += ' metti-nave-verticale';
                indiceNumero++;
            }
            x = lettera[indiceLettera];
            y = indiceNumero + 1;
            console.log('prendo primo id : ', x + y);
            document.getElementById(x + y).className += ' metti-nave-verticale verticale-dx';
        }
    }
}

let naviNemicheDaPiazzare = 0;
let indiciGiaSceltiNemici = [];
let nGiaSceltiNemici = 0;

/* Qui eseguiremo gli stessi identici controlli come nell'utente ma le coordinate verranno
generate randomicamente */
function piazzaNaveNemica() {
    while (naviNemicheDaPiazzare < 5) {
        indiceLettera = (Math.random() * 8 + 1).toFixed(0);
        indiceNumero = (Math.random() * 8 + 1).toFixed(0);

        let x1;
        let y1;
        let antiLoop = 0;
        errore = 0;

        indiceLettera = (Math.random() * 8 + 1).toFixed(0);
        indiceNumero = (Math.random() * 8 + 1).toFixed(0);

        while (1) {
            indiceLettera2 = (Math.random() * 8 + 1).toFixed(0);
            indiceNumero2 = (Math.random() * 8 + 1).toFixed(0);

            if (indiceLettera2 == indiceLettera && indiceNumero2 > indiceNumero)
                errore = 1;
            else if (indiceLettera2 > indiceLettera && indiceNumero2 == indiceNumero)
                errore = 1;
            else {
                errore = 0;
                console.log('errore di indice');
            }

            if (errore == 1) {
                for (let n = 0; n < nGiaSceltiNemici; n++) {
                    if (indiceLettera == indiceLettera2) {
                        for (let iN = indiceNumero; iN <= indiceNumero2; iN++) {
                            if (lettera[indiceLettera] + iN == indiciGiaSceltiNemici[n]) {
                                errore = 0;
                                console.log('trovato un gia scelto');
                                break;
                            }
                        }
                    } else if (indiceNumero == indiceNumero2) {
                        for (let iL = indiceLettera; iL <= indiceLettera2; iL++) {
                            if (lettera[iL] + indiceNumero == indiciGiaSceltiNemici[n]) {
                                errore = 0;
                                console.log('trovato un gia scelto');
                                break;
                            }
                        }
                    }
                    if (errore == 0)
                        break;
                }
            }

            if (errore == 1) {
                if (indiceNumero != indiceNumero2) {
                    for (let n = 0; n < 5; n++) {
                        if (naviDaPiazzareNemica[n] == (indiceNumero2 - indiceNumero + 1)) {
                            naviDaPiazzareNemica[n] = 0;
                            console.log('verticale navidapizzare[', n, '] = ', naviDaPiazzareNemica[n]);
                            console.log('la nave di lunghezza', (indiceNumero2 - indiceNumero + 1), 'va bene');
                            break;
                        } else if (n == 4) {
                            errore = 0;
                            console.log('la nave è più di 5,4,3,2');
                        }
                    }
                } else {
                    for (let n = 0; n < 5; n++) {
                        if (naviDaPiazzareNemica[n] == (indiceLettera2 - indiceLettera + 1)) {
                            naviDaPiazzareNemica[n] = 0;
                            console.log('orizzontale navidapizzare[', n, '] = ', naviDaPiazzareNemica[n]);
                            console.log('la nave di lunghezza', (indiceLettera2 - indiceLettera + 1), 'va bene');
                            break;
                        } else if (n == 4) {
                            errore = 0;
                            console.log('la nave è più di 5,4,3,2');
                        }
                    }
                }
            }

            if (errore == 1) {
                naviNemicheDaPiazzare++;
                break;
            }

            antiLoop++;
            if (antiLoop > 100) {
                console.log('non ho tovato nulla');
                errore = 0;
                break;
            }
        }
        console.log("scelto nave nemica 1", lettera[indiceLettera] + indiceNumero);
        console.log("scelto nave nemica 2", lettera[indiceLettera2] + indiceNumero2);
        let colora;
        if (errore == 1) {
            if (indiceNumero == indiceNumero2) {/* ORIZZONTALE ORIZZONTALE ORIZZONTALE ORIZZONTALE */
                x1 = lettera[indiceLettera];
                y1 = indiceNumero;
                console.log("piazzo nave nemica sx", x1 + y1);
                indiciGiaSceltiNemici[nGiaSceltiNemici++] = x1 + y1;
                colora = document.getElementById(x1 + y1 + '-nemica');
                colora.className += ' metti-nave-nemica-orizzontale orizzontale-sx';

                while (indiceLettera != indiceLettera2 - 1) {
                    x1 = lettera[indiceLettera++ + 1];
                    y1 = indiceNumero;
                    indiciGiaSceltiNemici[nGiaSceltiNemici++] = x1 + y1;
                    colora = document.getElementById(x1 + y1 + '-nemica');
                    colora.className += ' metti-nave-nemica-orizzontale';
                    console.log("piazzo nave nemica", x1 + y1);
                }

                x1 = lettera[indiceLettera2];
                y1 = indiceNumero;
                console.log("piazzo nave nemica dx", x1 + y1);
                indiciGiaSceltiNemici[nGiaSceltiNemici++] = x1 + y1;
                colora = document.getElementById(x1 + y1 + '-nemica');
                colora.className += ' metti-nave-nemica-orizzontale orizzontale-dx';
            } else if (indiceLettera == indiceLettera2) {/* VERTICALE VERTICALE VERTICALE VERTICALE */
                x1 = lettera[indiceLettera];
                y1 = indiceNumero;
                console.log("piazzo nave nemica sx", x1 + y1);
                indiciGiaSceltiNemici[nGiaSceltiNemici++] = x1 + y1;
                colora = document.getElementById(x1 + y1 + '-nemica');
                colora.className += ' metti-nave-nemica-verticale verticale-sx';

                while (indiceNumero != indiceNumero2 - 1) {
                    x1 = lettera[indiceLettera];
                    y1 = indiceNumero++ + 1;
                    indiciGiaSceltiNemici[nGiaSceltiNemici++] = x1 + y1;
                    colora = document.getElementById(x1 + y1 + '-nemica');
                    colora.className += ' metti-nave-nemica-verticale';
                    console.log("piazzo nave nemica", x1 + y1);
                }
                x1 = lettera[indiceLettera];
                y1 = indiceNumero2;
                console.log("piazzo nave nemica dx", x1 + y1);
                indiciGiaSceltiNemici[nGiaSceltiNemici++] = x1 + y1;
                colora = document.getElementById(x1 + y1 + '-nemica');
                colora.className += ' metti-nave-nemica-verticale verticale-dx';

            }



            for (let n = 0; n < nGiaSceltiNemici; n++) {
                console.log('gia scelti:', indiciGiaSceltiNemici[n]);
            }
        }
    }
}


/*function hexColour(c) {
    if (c < 256) {
      return Math.abs(c).toString(16);
    }
    return 0;
  }*/

let difficolta = -1;
function difficoltaGioco(d) {
    if (difficolta != -1)
        return;
    difficolta = d;
    if (d == 0) {
        document.getElementById('difficile').style.border = '2px solid black';
        document.getElementById('media').style.border = 'none';
        document.getElementById('facile').style.border = 'none';
    }
    else if (d == 1) {
        document.getElementById('media').style.border = '2px solid black';
        document.getElementById('difficile').style.border = 'none';
        document.getElementById('facile').style.border = 'none';
    }
    else {
        document.getElementById('facile').style.border = '2px solid black';
        document.getElementById('media').style.border = 'none';
        document.getElementById('difficile').style.border = 'none';
    }
}

let wait = 0;
/* Variabile per non far cliccare nulla all'utente durante la scelta del nemico */
let velocita = 3000;
document.getElementById('lenta').style.border = '2px solid black';
function velocitaGioco(v) {
    if (v == 0) {
        velocita = 3000;
        document.getElementById('lenta').style.border = '2px solid black';
        document.getElementById('normale').style.border = 'none';
        document.getElementById('veloce').style.border = 'none';
    }
    else if (v == 1) {
        velocita = 2000;
        document.getElementById('normale').style.border = '2px solid black';
        document.getElementById('lenta').style.border = 'none';
        document.getElementById('veloce').style.border = 'none';
    }
    else {
        velocita = 200;
        document.getElementById('veloce').style.border = '2px solid black';
        document.getElementById('normale').style.border = 'none';
        document.getElementById('lenta').style.border = 'none';
    }
}

/* Aggiunge un onclick su tutte le coordinate */

/* La funzione onclick farà colpire all'utente la coordinata selezionata, disattivandola
per poi non poterla farla cliccare più, ed eseguendo un controllo se per caso hai colpito
o meno una parte della nave nemica */

/* inoltre attiverà la funzione per passare il turno al nemico */
for (let i = 1; i < 10; i++) {
    for (let j = 1; j < 10; j++) {
        document.getElementById(lettera[j] + i + '-nemica').addEventListener('click', function () {
            if (puntiUtente == 17 || puntiNemico == 17 || wait == 1) {
                console.log('wait (con 1 fa return)= ', wait);
                return;
            }
            if (fasePreparazione > 4) {
                let colpisciNave = document.getElementById(lettera[j] + i + '-nemica');
                if (!colpisciNave.classList.contains("colpo-sparato")) {
                    colpisciNave.className += " colpo-sparato";
                    colpisciNave.className += " cliccata";
                    document.getElementById('turnoNemico').style.opacity = '1';

                    setTimeout(function () {
                        document.getElementById('turnoNemico').style.opacity = '0';
                    }, velocita - 1000);

                    console.log('setto wait a 1');
                    wait = 1;

                    setTimeout(function () {
                        if (difficolta == 1 || difficolta == -1)
                            nemicoColpisciMigliore();
                        else
                            nemicoColpisci();
                    }, velocita);
                    if (colpisciNave.classList.contains('metti-nave-nemica-orizzontale')
                        || colpisciNave.classList.contains('metti-nave-nemica-verticale'))
                        puntiUtente++;
                    if (puntiUtente > 16) {
                        alert('hai vinto ! ');
                        mostraNavi();
                    }
                }
            }
        });
    }
}

let naviGiaColpite = [];
/* Variabili per far saltare automaticamente le coordinate che sono già state scelte dal computer*/
let x;
let y;

let AttaccaX = [0, 0, 0, 0];
let AttaccaY = [0, 0, 0, 0];
/*indice: 0 sopra, 1 sotto, 2 sinistra, 3 destra*/

/* """"""""""""""""AI""""""""""""" del computer, per colpire attorno alla coordinata dove ha
colpito effettivamente una nave */

let indiceAttacca = 0;
let colpitoAttacca = 0;
let successivoAttacca = 0;
/* """"""""""""""""AI""""""""""""" del computer, se colpisce due volte la nave nella coordinata 
scelta e nella successiva, capirà che dovrà continuare verso quella direzione, 
se manca poi il colpo, ritornerà nel punto dove l'aveva colpita all'inizio,
per cercare attorno se è una nave da 3/4/5 */

/* Nella funzione ci sono tanti controlli per non far entrare nulla in loop, per gestire il caso 
in cui il computer sceglie una coordinata già selezionata, e gestire i casi in cui siamo negli
angoli della tabella o se siamo sui bordi */
function nemicoColpisciMigliore() {
    if (successivoAttacca == 0) {
        for (indiceAttacca; indiceAttacca < 4; indiceAttacca++) {
            if (AttaccaX[indiceAttacca] != 0) {
                x = AttaccaX[indiceAttacca];
                y = AttaccaY[indiceAttacca];
                indiceAttacca++;
                colpitoAttacca = 1;
                console.log('--Nofor-- sto colpendo uno dei 4', lettera[x] + y);
                break;
            } else
                colpitoAttacca = 0;
        }
        if (colpitoAttacca == 0) {
            console.log('--Nofor-- indiceAttacca', indiceAttacca, 'quindi colpisco a caso');
            x = (Math.random() * 8 + 1).toFixed(0);
            y = (Math.random() * 8 + 1).toFixed(0);
        }
    }

    for (let n = 0; n < naviGiaColpite.length; n++) {
        if ((lettera[x] + y) == naviGiaColpite[n]) {
            n = -1;
            for (indiceAttacca; indiceAttacca < 4; indiceAttacca++) {
                if (AttaccaX[indiceAttacca] != 0) {
                    x = AttaccaX[indiceAttacca];
                    y = AttaccaY[indiceAttacca];
                    colpitoAttacca = 1;
                    console.log('--for-- sto colpendo uno dei 4', lettera[x] + y);
                    break;
                } else
                    colpitoAttacca = 0;
            }
            if (indiceAttacca == 4) {
                console.log('--for-- indiceAttacca', indiceAttacca, 'quindi colpisco a caso');
                x = (Math.random() * 8 + 1).toFixed(0);
                y = (Math.random() * 8 + 1).toFixed(0);
            } else
                indiceAttacca++;
        }
    }

    naviGiaColpite.push(lettera[x] + y);
    let colpisciNave = document.getElementById(lettera[x] + y);
    colpisciNave.className += ' colpo-sparato';

    if (colpisciNave.classList.contains('metti-nave-verticale')
        || colpisciNave.classList.contains('metti-nave-orizzontale')) {
        puntiNemico++;
        console.log('NEMICO GUADAGNA UN PUNTO');
        if (colpitoAttacca == 0) {
            console.log('colpitoAttacca = 0');
            AttaccaX[0] = x;
            AttaccaX[1] = x;
            AttaccaX[2] = x - 1;
            AttaccaX[3] = parseInt(x) + 1;
            AttaccaY[0] = y - 1;
            AttaccaY[1] = parseInt(y) + 1;
            AttaccaY[2] = y;
            AttaccaY[3] = y;
            if (x == 1)
                AttaccaX[2] = 0;
            if (y == 1)
                AttaccaX[0] = 0;
            if (x == 9)
                AttaccaX[3] = 0;
            if (y == 9)
                AttaccaX[1] = 0;


            indiceAttacca = 0;
        } else {
            console.log('colpitoAttacca = 1');
            successivoAttacca = 1;
            if (indiceAttacca - 1 == 0)
                y = y - 1;
            if (indiceAttacca - 1 == 1)
                y = parseInt(y) + 1;
            if (indiceAttacca - 1 == 2)
                x = x - 1;
            if (indiceAttacca - 1 == 3)
                x = parseInt(x) + 1;

            if (x == 0 || x == 10 || y == 0 || y == 10)
                successivoAttacca = 0;
            console.log('successivoAttacca = ', lettera[x] + y);
        }
        for (let n = 0; n < 4; n++) {
            console.log('AttacaX,AttaccaY', lettera[parseInt(AttaccaX[n])] + parseInt(AttaccaY[n]));
        }
    } else if (indiceAttacca == 4) {
        successivoAttacca = 0;
        for (let n = 0; n < 4; n++) {
            AttaccaX[n] = 0;
            AttaccaY[n] = 0;
        }
    } else
        successivoAttacca = 0;
    if (indiceAttacca == 4 && successivoAttacca == 0)
        indiceAttacca = 0;
    if (puntiNemico > 16) {
        alert('ha vinto il nemico');
        mostraNavi();
    }

    console.log('colpisco', (lettera[x]), (y))
    console.log('setto wait a 0');
    wait = 0;
}

/* Sceglierà semplicemente coordinate random, con un solo controllo sulle coordinate già scelte */
function nemicoColpisci() {
    x = (Math.random() * 8 + 1).toFixed(0);
    y = (Math.random() * 8 + 1).toFixed(0);

    for (let n = 0; n < naviGiaColpite.length; n++) {
        if ((lettera[x] + y) == naviGiaColpite[n]) {
            console.log('trovato un gia colpito', lettera[x] + y);


            x = (Math.random() * 8 + 1).toFixed(0);
            y = (Math.random() * 8 + 1).toFixed(0);


            n = -1;
        }
    }

    naviGiaColpite.push(lettera[x] + y);
    let colpisciNave = document.getElementById(lettera[x] + y);
    colpisciNave.className += ' colpo-sparato';

    if (colpisciNave.classList.contains('metti-nave-verticale')
        || colpisciNave.classList.contains('metti-nave-orizzontale')) {
        puntiNemico++;
        console.log('NEMICO GUADAGNA UN PUNTO');
    }
    if (puntiNemico > 16) {
        alert('ha vinto il nemico');
        mostraNavi();
    }

    console.log('colpisco', (lettera[x]), (y))
    console.log('setto wait a 0');
    wait = 0;
}

function mostraNavi() {
    for (let i = 1; i < 10; i++) {
        for (let j = 1; j < 10; j++) {
            document.getElementById(lettera[j] + i + '-nemica').className += ' mostra-navi';
        }
    }
}