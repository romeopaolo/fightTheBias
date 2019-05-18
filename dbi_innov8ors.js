//Dictionary containing all sections
var sections;

var current_section = 0;
var current_question = 0;

// var question = sections["section" + current_section]["question" + current_question]

//Parse the JSON with the questions when the page is loaded
$(document).ready(function () {
    // sections = JSON.parse("questions.json");

    $(".btn-first-choice").click(function () {
        $("#first-choice").toggleClass("hide");
    });

    $(".dropdown-menu .dropdown-item").click(function () {
        $(".btn.dropdown-toggle:first-child").text($(this).text());
        $(".btn.dropdown-toggle:first-child").val($(this).text());
    });

    $(".form-check-input").click(function () {
        console.log($(this).closest('label').text())
    });

});

//Pick the next question
var loadNextQuestion = function () {
    current_question++;

    if (current_question > question.numberOfQuestions) {
        current_section++;
        if (current_section == 7) {
            //DONE PORCODIO FAMMI VEDERE QUESTI CAZZO DI RISULTATI DI MERDA SCHIFOSO GESU
            calculateResult();
        }
    }

    //Pick the current question
    question = sections["section" + current_section]["question" + current_question]

    //Load the question into the HTML
    loadQuestion();
}

/**
 * TODO:
 * 
 * gestisci il caricamento dinamico dei pesi consigliati
 * inserisci html per domanda con risposta booleana
 */ 
var loadQuestion = function () {

    //Check if it is boolean

    //Create html block for the classes
    let classes;
    question.classes.array.forEach(element => {
        result.append(
            `
            <div class="form-check pt-3">
                <label class="form-check-label">
                    <input type="radio" class="form-check-input" name="optradio">${element}
                </label>
            </div>
            `
        )
    });

    //Clear the html
    $("#question").empty()

    //Append the new question
    $("#question").append(`
        <div class="row">
            <div class="col-sm-9">
                <h1>DOMANDA ${current_question + 1}</h1>
                <br>
                <h2>${question.description}</h2>
                <br>
                <h3>Classi</h3>
                ${classes}            
            </div>
            <div class="col-sm-3">
                <div class="row d-flex flex-row-reverse"><button type="button"
                        class="btn btn-danger btn-block m-2 p-3">PESO5</button></div>
                <div class="row d-flex flex-row-reverse"><button type="button"
                        class="btn btn-danger btn-block m-2 p-3">PESO5</button></div>
                <div class="row d-flex flex-row-reverse"><button type="button"
                        class="btn btn-danger btn-block m-2 p-3">PESO5</button></div>
            </div>
        </div>
        `)

}

var calculateResult = function () {
    //QUALCUNO DOVRA' SCRIVERE QUESTA MERDA
}





function computeStandardDev(myDict) {
    var arr = [];

    for ((key, value) in myDict) {
        arr.append("\(value)");
    }

    //average computation
    var k = 0;
    for (var i = 0; i <= arr.length - 1; i++) {
        k = arr[i] + k;
    }
    var lun = arr.length;
    var average = k / lun;

    //devsq computation
    var r = 0;
    for (var l = 0; l <= arr.length - 1; l++) {
        r = Math.pow((arr[l] - average), 2) + r;
    }

    //variance computation
    var variance = r / lun;

    //max variance computation
    var maxvar = Math.pow((100 - average), 2);

    //max standard deviation computation
    var maxdev = Math.sqrt(maxvar);

    //standard deviation compute
    var dev = Math.sqrt(variance);

    window.alert(d);
}

