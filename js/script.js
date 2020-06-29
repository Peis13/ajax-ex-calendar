// Creare un calendario dinamico con le festività.
// Partiamo dal gennaio 2018 dando la possibilità di cambiare mese,
// gestendo il caso in cui l’API non possa ritornare festività.
// Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull’API).
// endpoint: https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0

$(document).ready(
  function() {

    $.ajax(
      {
        url: 'https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0',
        method:'GET',
        success: function(festivita) {
          var arrayFestivita = festivita.response;  // return: array di oggetti

          // Creo due array di appoggio per date e nomi festività ajax
          var arrayNomiFestivita = [];
          var arrayDateFestivita = [];

          // Ciclo la risposta ajax arrayFestivita per leggere le sue chiavi
          // ogni chiave la inserisco nell'apposito array
          for (var j = 0; j < arrayFestivita.length; j++) {

            var nomeFestivita = arrayFestivita[j]['name'];
            var dataFestivita = arrayFestivita[j]['date'];

            arrayNomiFestivita.push(nomeFestivita);
            arrayDateFestivita.push(dataFestivita);
          }

          // Una volta estrapolate date e festività, le accantono per il momento
          // Imposto anno e mese a cui fare riferimento
          // per andare a prendere i giorni totali del mese
          var data = moment('2018-01');
          var giorniMese = data.daysInMonth();

          // Faccio un ciclo for con limite massimo i giorni totali del mese
          //  --> per ogni giorno imposto il formato della data,
          //  --> lo metto in un oggetto che poi andrò a stampare
          //  --> infine incremento il giorno del mese
          for (var i = 1; i <= giorniMese; i++) {
            var giorno = data.format('D MMMM'); // 01 January

            // Converto la data del mese
            // nel formato della dataFestivita in cui mi ritorna la chiamata ajax
            // per poter fare un confronto
            var formatoDataAjax = data.format('YYYY-MM-DD');

            // Vedo se la data in formato Ajax è inclusa nell'arrayDateFestivita creato in precedenza
            // se vero:
            //  --> ricavo l'indice dell'arrayDateFestivita con cui ho la corrispondeza
            //  --> il nomeFestivita che andrò a stampare
            //      diventa il nome allo stesso indice della data nell'arrayNomiFestivita
            //  --> il colore della chiave 'classe' diventa rosso
            // altrimenti 'nomeFestivita' e 'classe' rimarranno vuote
            var colore;
            if (arrayDateFestivita.includes(formatoDataAjax)) {

              var indiceData = arrayDateFestivita.indexOf(formatoDataAjax);
              nomeFestivita = ' - ' + arrayNomiFestivita[indiceData];
              colore = 'rosso';

            } else {
              nomeFestivita = '';
              colore = '';
            }

            // Creo un oggetto che mi serve per la stampa handlebars
            var objGiorno = {
              giorno: giorno,
              nome: nomeFestivita,
              classe: colore
            };
            console.log(objGiorno);
            stampaGiorno(objGiorno);

            // Incremento il giorno di uno
            data.add(1, 'days');
          }
        },
        error: function() {
          alert('Errore');
        }
      }
    );

    // --------------- FUNZIONI --------------- //
    function stampaGiorno(obj) {
      var source = $("#giorno-template").html();
      var template = Handlebars.compile(source);

      var html = template(obj);
      // console.log(html);
      $('.giorni').append(html);
    }
    // --------------- FINE FUNZIONI --------------- //

////////// FINE DOCUMENT READY
  }
);
