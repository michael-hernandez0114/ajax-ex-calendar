$(document).ready(function () {

    var htmlGiorno = $('#calendar-template').html();
    var templateGiorno = Handlebars.compile(htmlGiorno);
    var annoEValido;
    var errorMessage;

    // Stampare il mese di Gennaio 2018
    // Tramite click stampare il mese successivo

    var dataIniziale = moment('2018-01-01');
    stampaGiorniMese(dataIniziale); // Inizializzazione Calendario
    stampaFestivi(dataIniziale.month());

    $('.mese-succ').click(function () {
        var dateCopy = dataIniziale.clone();
        //console.log('dataIniziale mese has: ' + dataIniziale.month());
        //console.log('dataIniziale anno has: ' + dataIniziale.year());
        //console.log('dateCopy mese has: ' + dateCopy.month());
        //console.log('dateCopy anno has: ' + dateCopy.year());

        dateCopy.add(1, 'month');
        annoValido(dateCopy.month(),dateCopy.year());

        if (annoEValido) {
            dataIniziale.add(1, 'month');
            stampaGiorniMese(dataIniziale);
            stampaFestivi(dataIniziale.month());
        }
        else {
            alert(errorMessage);
        }

        //console.log('after add dataIniziale mese has: ' + dataIniziale.month());
        //console.log('after add dataIniziale anno has: ' + dataIniziale.year());


    });

    $('.mese-prec').click(function () {
        var dateCopy = dataIniziale.clone();

        dateCopy.subtract(1, 'month');
        annoValido(dateCopy.month(),dateCopy.year());

        if (annoEValido) {
            dataIniziale.subtract(1, 'month');
            //console.log('dataIniziale mese has: ' + dataIniziale.month());
            //console.log('dataIniziale anno has: ' + dataIniziale.year());
            stampaGiorniMese(dataIniziale);
            stampaFestivi(dataIniziale.month());
        }
        else {
            alert(errorMessage);
        }


    });

    function annoValido(mese, anno) {

        $.ajax({
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            data: {
                year: anno,
                month: mese
            },
            async: false,
            success: function (data) {
                //console.log("success has: " + data.success);
                //console.log("error has: " + data.error);
                annoEValido = data.success;
                errorMessage = data.error;
                }
        });

    }

    function stampaFestivi(mese) {
        $.ajax({
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            data: {
                year: 2018,
                month: mese
            },
            success: function (data) {
                var giorniFestivi = data.response;
                for (var i = 0; i < giorniFestivi.length; i++) {
                    var giornoFestivo = giorniFestivi[i];
                    var nomeFestivo = giornoFestivo.name;
                    var dataFestivo = giornoFestivo.date;
                    $('#calendar li[data-day="' + dataFestivo + '"]').addClass('festivo').append(' - ' + nomeFestivo);
                }
            }
        });
    }

    function stampaGiorniMese(meseDaStampare) {
        $('#calendar').empty();
        var standardDay = meseDaStampare.clone();
        var giorniMese = meseDaStampare.daysInMonth();
        var nomeMese = meseDaStampare.format('MMMM');
        $('#nome-mese').text(nomeMese); // Aggiorniamo il nome del mese in top calendar
        for (var i = 1; i <= giorniMese; i++) {
            // $('#calendar').append('<li>' + i + ' ' + nomeMese + '</li>');
            var giornoDaInserire = {
                day: i + ' ' + nomeMese,
                dataDay: standardDay.format('YYYY-MM-DD')
            }
            var templateFinale = templateGiorno(giornoDaInserire); // Stiamo popolando il template con i dati dell'oggetto
            $('#calendar').append(templateFinale);
            standardDay.add(1, 'day');
        }
    }

});
