//Dictionary containing all sections
var sections;
var suggweights = "";
var current_section;
var current_question;

var question;
var suggweight;

//Parse the JSON with the questions when the page is loaded
$(document).ready(function () {

    $.getJSON("./data/questions.json", function (json) { // show the JSON file content into console
        sections = json
        console.log(sections);
    });

    current_question = 1;
    current_section = 1;

    $("button").click(function () {
        console.log("Righetti coglione")
    });

    $(".btn-first-choice").click(function () {

        var context = $(this).text();
        alert(context);

        var path = "./data/suggested_weights_" + context + ".json";
        $.getJSON(path, function (json) { // show the JSON file content into console
            suggweights = json;
            console.log(suggweights);
        });

        pickQuestion();
        $("#first-choice").toggleClass("hide");
        $("#question-section").toggleClass("hide");
        // $("#question-section").toggleClass("scene_element scene_element--fadeinup");
        $("#question-section-body").toggleClass("hide");
        $("#submit").toggleClass("hide");
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
/*
function dropdownClicked(button) {
    $(".dropdown-toggle:first-child").text($(button).text());
    $(".dropdown-toggle:first-child").val($(button).text());
}*/

var pickQuestion = function () {
    //Pick the current question
    console.log(sections["section" + current_section]["question" + current_question])
    question = sections["section" + current_section]["question" + current_question]
    suggweight = suggweights["section" + current_section]["question" + current_question]
    loadQuestion();
};

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
        elem += '<div class="row"><div class="col-sm-9"><h1>Question ' + (current_question) + '</h1><br><h2>' + question.description + '</h2><br><h3>' + question.text + '</h3>'

        elem += '<ul>'
        for (var index in question.classes) {
            console.log(index)
            elem += '<li>' + question.classes[index] + '<input type="text" id="input' + index + '" /></li>'
        }
        elem += '</ul>'

        elem += '</div><div class="col-sm-3"><div class="row d-flex flex-row-reverse"><button type="button"class="btn btn-danger btn-block m-2 p-3">INPUT</button></div><div class="row d-flex flex-row-reverse"><button type="button"class="btn btn-danger btn-block m-2 p-3">' + suggweight + '</button></div><select id="weight" class="btn-danger btn-block " ><option value="0">Zero</option><option value="1">Low</option><option value="2">Very Low</option><option value="3">Medium</option><option value="4">High</option><option value="5">Very High</option><option value="" selected disabled hidden>Weight</option></select></div>'

        //Clear the html

        //Append the new question
        $("#question").append(elem)
    }
}

var calculateResult = function () {
    //QUALCUNO DOVRA' SCRIVERE QUESTA MERDA
}


function evaluateVariable(myDict) {
    var arr = [];

    for (var key in sections) {
        arr.append(sections[key].input);
    }

    let n = arr.length;

    //average computation
    var sum = 0;
    for (var i = 0; i < n; i++) {
        sum = arr[i] + sum;
    }
    var average = sum / n;

    //computation of the real standard deviation
    var r = 0;
    for (var l = 0; l <= arr.length - 1; l++) {
        r = Math.pow((arr[l] - average), 2) + r;
    }

    var variance = r / n;

    var dev = Math.sqrt(variance);

    //computation of the maximum standard deviation
    var avg = 100 / n;

    var max_r = Math.pow((100 - avg), 2);
    max_r = Math.pow(avg, 2) * (n - 1) + max_r;

    var max_var = max_r / n;

    var max_dev = Math.sqrt(max_var);

    return (1 - dev / max_dev)
}


$("#submit").click(function () {
    //var value = $("#input0").val()
    alert($("#input0").val());
    //alert($("#weight").val());
    loadNextQuestion();
});