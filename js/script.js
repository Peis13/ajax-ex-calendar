// Creare un calendario dinamico con le festività.
// Partiamo dal gennaio 2018 dando la possibilità di cambiare mese,
// gestendo il caso in cui l’API non possa ritornare festività.
// Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull’API).
// endpoint: https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0

$(document).ready(
  function() {

    // --------------- LOGICA --------------- //

    // Imposto una data a cui fare riferimento
    var dataObj = moment(
      {
        day: 1,
        month: 0,
        year: 2018
      }
    );
    stampaMese(dataObj);
    stampaFestivita(dataObj);

    // Click sul pulsante 'successivo'
    //  --> leggo il valore dell'attributo che ha il titolo (meseCorrente)
    //  --> lo trasformo in un oggetto moment così posso incrementare il mese di uno
    //  --> stampo mese e festività solo se l'anno corrente è il 2018 altrimenti mostro un alert
    $('#successivo').click(
      function() {
        var meseCorrente = $('#mese-corrente').attr('data-mese-corrente');
        var momentObj = moment(meseCorrente);
        momentObj.add(1, 'months'); // incremento il mese

        if (momentObj.year() == 2018) {
          stampaMese(momentObj);
          stampaFestivita(momentObj);
        } else {
          alert('Mi dispiace, puoi navigare solo nell\'anno 2018')
        }
      }
    );

    // Click sul pulsante 'precedente'
    //  --> leggo il valore dell'attributo che ha il titolo (meseCorrente)
    //  --> lo trasformo in un oggetto moment così posso decrementare il mese di uno
    //  --> stampo mese e festività solo se l'anno corrente è il 2018 altrimenti mostro un alert
    $('#precedente').click(
      function() {
        var meseCorrente = $('#mese-corrente').attr('data-mese-corrente');
        var momentObj = moment(meseCorrente);
        momentObj.subtract(1, 'months'); // decremento il mese

        if (momentObj.year() == 2018) {
          stampaMese(momentObj);
          stampaFestivita(momentObj);
        } else {
          alert('Mi dispiace, puoi navigare solo nell\'anno 2018')
        }
      }
    );
    
    // --------------- FINE LOGICA --------------- //

    // --------------- FUNZIONI --------------- //

    ////////// Stampa i giorni del mese
    //  --> momentObj: è l'oggetto moment che passo come argomento
    // return: niente
    function stampaMese(momentObj) {

      // resetto l'html della lista dei giorni così quando cambio il mese
      // non viene appeso, ma sostituito
      $('.giorni').html('');

      // cambio il nome del mese corrente
      // e l'attributo che mi servirà da riferimento per il cambio mese
      $('#mese-corrente').text(momentObj.format('MMMM YYYY'));
      $('#mese-corrente').attr('data-mese-corrente', momentObj.format('YYYY-MM-DD'));

      // prendo i giorni totali del mese che mi servono per il ciclo for
      var giorniMese = momentObj.daysInMonth();

      // preparo il template che modifico nel ciclo for
      var source = $("#giorno-template").html();
      var template = Handlebars.compile(source);

      // Faccio un ciclo for con limite massimo i giorni totali del mese
      //  --> per ogni ciclo creo un oggetto moment che rappresenta il giorno corrente,
      //  --> con le info di questo oggetto, creo un oggetto che poi andrò a stampare con handlebars
      //  --> infine incremento il giorno del mese
      for (var i = 1; i <= giorniMese; i++) {
        // var giorno = dataObj.format('D MMMM'); // TODO: verifica cosa farne

        var giornoCorrente = moment(
          {
            day: i,
            month: momentObj.month(),
            year: momentObj.year()
          }
        );

        var giornoHB = {
          giorno: giornoCorrente.format('DD MMMM'),
          giorno_corrente: giornoCorrente.format('YYYY-MM-DD')
        };

        var html = template(giornoHB);
        $('.giorni').append(html);

        // momentObj.add(1, 'd');
      }
    }

    ////////// Stampa le festività del mese
    //  --> momentObj: è l'oggetto moment che passo come argomento
    // return: niente
    function stampaFestivita(momentObj) {

      // Faccio una chiamata Ajax che ha come chiave 'data' dei valori passati come argomento
      // che andranno a completare l'endpoint d'indirizzamento al server
      $.ajax(
        {
          url: 'https://flynn.boolean.careers/exercises/api/holidays',
          method:'GET',
          data: {
            year: momentObj.year(),
            month: momentObj.month()
          },
          success: function(festivita) {
            var arrayFestivita = festivita.response;  // return: array di oggetti

            // Ciclo l'array che  mi ritorna dalla chiamata Ajax
            //  --> leggo in ogni indice dell'array (oggetto) la chiave 'date'
            //  --> vado a pescare il giorno della lista con attributo uguale alla chiave letta in precedenza
            //  --> aggiungo classe e nome della festività al giorno della lista corrispondente
            for (var i = 0; i < arrayFestivita.length; i++) {
              var giornoFestivo = arrayFestivita[i].date;
              var giornoCorrispondente = $('.giorno[data-giorno-corrente="'+ giornoFestivo +'"]');

              giornoCorrispondente.addClass('rosso');
              giornoCorrispondente.append(' - ' + arrayFestivita[i].name);
            }
          },
          error: function() {
            alert('Errore');
          }
        }
      );
    }

    // --------------- FINE FUNZIONI --------------- //

////////// FINE DOCUMENT READY
  }
);
