//Dictionary containing all sections
var sections;

var current_section;
var current_question;

var question;

//Parse the JSON with the questions when the page is loaded
$(document).ready(function () {

    $.getJSON("./data/questions.json", function (json) { // show the JSON file content into console
        sections = json
        console.log(sections);
    });

    current_question = 3;
    current_section = 3;

    $("button").click(function () {
        console.log("Righetti sei un coglione")
    });

    $(".btn-first-choice").click(function () {
        pickQuestion();
        $("#first-choice").toggleClass("hide");
        $("#question-section").toggleClass("hide");
        // $("#question-section").toggleClass("scene_element scene_element--fadeinup");
        $("#question-section-body").toggleClass("hide");
        // $("#question-section-body").toggleClass("scene_element scene_element--fadeinup");
    });

    $("#Ok").click(function () {
        console.log("Clicked")
        $(".dropdown-toggle:first-child").text($(this).text());
        $(".dropdown-toggle:first-child").val($(this).text());
    });

    $(".form-check-input").click(function () {
        console.log($(this).closest('label').text())
    });

});

function dropdownClicked(button) {
    $(".dropdown-toggle:first-child").text($(button).text());
    $(".dropdown-toggle:first-child").val($(button).text());
}

var pickQuestion = function () {
    //Pick the current question
    console.log(sections["section" + current_section]["question" + current_question])
    question = sections["section" + current_section]["question" + current_question]
    loadQuestion();
}

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

    pickQuestion();

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
    if (question.boolean) {
        console.log("boolean")
    } else {

        var elem = ""
        elem += '<div class="row"><div class="col-sm-9"><h1>DOMANDA ' + (current_question + 1) + '</h1><br><h2>' + question.description + '</h2><br><h3>Classi</h3>'

        for (var index in question.classes) {
            console.log(index)
            elem += '<div class="form-check pt-3"><label class="form-check-label"><input type="radio" class="form-check-input" name="optradio">' + question.classes[index] + '</label></div>'
        }

        elem += '</div><div class="col-sm-3"><div class="row d-flex flex-row-reverse"><button type="button"class="btn btn-danger btn-block m-2 p-3">PESO5</button></div><div class="row d-flex flex-row-reverse"><button type="button"class="btn btn-danger btn-block m-2 p-3">PESO5</button></div><div class="row d-flex flex-row-reverse"><div class="dropdown m-2 btn-block"> <button class="btn btn-danger btn-block p-3 dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropdown-choice">Dropdown button</button><div class="dropdown-menu" aria-labelledby="dropdownMenuButton"><a class="dropdown-item" href="#" id="Ok">Zero</a><a class="dropdown-item" href="#">Very low</a><a class="dropdown-item" href="#">Low</a><a class="dropdown-item" href="#">Medium</a><a class="dropdown-item" href="#">High</a><a class="dropdown-item" href="#">Very High</a></div></div></div>'

        //Clear the html

        //Append the new question
        $("#question").append(elem)
    }
}

var calculateResult = function () {
    //QUALCUNO DOVRA' SCRIVERE QUESTA MERDA
}





function computeStandardDev(myDict) {
    var arr = [];

    for (var key in sections) {
        arr.append(sections[key].input);
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