//Dictionary containing all sections
var sections;
var suggweights;
var current_section=1;
var current_question;
var numberOfQuestions;
var question;
var suggweight;
var dataStructure={};
var missinginput=false;


//Parse the JSON with the questions when the page is loaded
$(document).ready(function () {

    $.getJSON("./data/questions.json", function (json) { // show the JSON file content into console
        sections = json;
        console.log(sections);

        displayThumbnails();
    });

    $(".btn-first-choice").click(function () {

        var context = $(this).text();
        //alert(context);

        var path = "./data/suggested_weights_" + context.toLowerCase() + ".json";
        $.getJSON(path, function (json) { // show the JSON file content into console
            suggweights = json;
            console.log(suggweights);
            pickFirstQuestion();
        });
    });

});

var changeScenario = function () {
    $("#first-choice").toggleClass("hide");
    $("#question-section").toggleClass("hide");
    // $("#question-section").toggleClass("scene_element scene_element--fadeinup");
    $("#question-section-body").toggleClass("hide");
    $("#submit").toggleClass("hide");
    // $("#question-section-body").toggleClass("scene_element scene_element--fadeinup");
};

var pickFirstQuestion = function () {
    changeScenario();
    pickQuestion();
};

var displayThumbnails= function () {
    current_question = 1;
    numberOfQuestions=0
    section=sections["section" + current_section]
    thumbnails=""
    for (var question in section) {
        if (section.hasOwnProperty(question)) {
            ++numberOfQuestions;
            thumbnails+='<div class="col">'
                        +'<button type="button" class="btn btn-danger thumbnail" id="thumbnail'+numberOfQuestions+'" onclick="thumbnailChosen('+numberOfQuestions+')">Q'+numberOfQuestions+'</button>'
                      +'</div>'
        
            $("#thumbnails").empty()
            $("#thumbnails").append(thumbnails)
        }
    }
}

var pickQuestion = function () {
    //Pick the current question
    console.log(sections["section" + current_section]["question" + current_question]);
    question = sections["section" + current_section]["question" + current_question];
    suggweight = suggweights["section" + current_section]["question" + current_question];
    loadQuestion();
};

//Pick the next question
var loadNextQuestion = function () {
    current_question++;
    if (current_question > numberOfQuestions) {
        
        current_section++;
        displayThumbnails()
        if (current_section == 7) {
            calculateResult();
        }
    }

    pickQuestion();
};

/**
 * TODO:
 *
 * gestisci il caricamento dinamico dei pesi consigliati
 * inserisci html per domanda con risposta booleana
 */
var loadQuestion = function () {

    //Check if it is boolean
    if (question.boolean) {
        var elem = "";
        elem += '<div class="row">' +
                    '<div class="col-sm-9">'
                        +'<h1>Question ' + (current_question) + '</h1>'+'<br>'
                        +'<h2>'+ question.description + '</h2>'+'<br>'
                        +'<h3>'+ question.text+'</h3>'
                        +'<label><input type="radio" name="Y/N" value="1"/>Yes</label>'
                        +'<label><input type="radio" name="Y/N" value="0"/>No</label> '
                    +'</div>'
                    +'<div class="col-sm-3">'
                        +'<div class="row d-flex flex-row-reverse">'
                            +'<button type="button"class="btn btn-danger btn-block m-2 p-3">'+suggweight+'</button>'
                        +'</div>'
                    +'<select id="weight" class="btn-danger btn-block " >'
                        +'<option value="0">Zero</option>'
                        +'<option value="1">Low</option>'
                        +'<option value="2">Very Low</option>'
                        +'<option value="3">Medium</option>'
                        +'<option value="4">High</option>'
                        +'<option value="5">Very High</option>'
                        +'<option value="" selected disabled hidden>Weight</option>'
                    +'</select>'
                +'</div>'
    } else {

        var elem = "";
        elem += '<div class="row">' +
            '<div class="col-sm-9">' +
            '<h1>Question ' + (current_question) + '</h1><br>' +
            '<h2>' + question.description + '</h2><br>' +
            '<h3>' + question.text + '</h3>';

        // display the list of classes
        elem += '<ul>';
        for (var index in question.classes) {
            //console.log(index);
            elem += '<li>' + question.classes[index] + '<input type="text" id="input' + index + '" /></li>'
        }
        elem += '</ul>';

        elem += '</div>' +
            '<div class="col-sm-3">' +
            '<div class="row d-flex flex-row-reverse">' +
            '<button type="button"class="btn btn-danger btn-block m-2 p-3">' + suggweight + '</button>' +
            '</div>' +
            '<select id="weight" class="btn-danger btn-block " >' +
            '<option value="0">Zero</option>' +
            '<option value="1">Low</option>' +
            '<option value="2">Very Low</option>' +
            '<option value="3">Medium</option>' +
            '<option value="4">High</option>' +
            '<option value="5">Very High</option>' +
            '<option value="" selected disabled hidden>Weight</option>' +
            '</select>' +
            '</div>';
    }

    //Clear the html
    $("#question").empty();
    //Append the new question
    $("#question").append(elem)
};

var calculateResult = function () {
    //QUALCUNO DOVRA' SCRIVERE QUESTA MERDA
};


function evaluateVariable(arr) {
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
    
    
    var sectionIndex = "section" + current_section;
    var questionIndex = "question" + current_question;
    var value;

    // read classes
    if(!question.boolean){
        value = readMultipleInput();
    } else {
        value = readBooleanInput();
    }

    var weight = $("#weight").val();
    console.log(weight)

    // if it is the first question of the section
    if(!dataStructure.hasOwnProperty(sectionIndex)){
        dataStructure[sectionIndex] = {};
    }

    // create the question
    dataStructure[sectionIndex][questionIndex] = {};

    // fill the question
    dataStructure[sectionIndex][questionIndex]["data"] = value;
    dataStructure[sectionIndex][questionIndex]["weight"] = weight;
    if(!question.boolean){
        dataStructure[sectionIndex][questionIndex]["result"] = evaluateVariable(value) * weight;
    } else {
        dataStructure[sectionIndex][questionIndex]["result"] = value * weight;
    }

    console.log(dataStructure);
    
   console.log("Weight: "+ weight)
   console.log("Missing input: "+missinginput)
    if (weight!=null&&!missinginput){
        document.getElementById("thumbnail"+current_question).innerHTML = "Q"+current_question+ " W:"+$("#weight").val();
        loadNextQuestion();
        missinginput=false;
        weight=null;
    }
    else{
        alert("Missing weight or input class!")
        missinginput=false;
    }
    
});

function readBooleanInput() {
    var input;
    input = $("input[name='Y/N']:checked").val();
    if(input==undefined)
        missinginput=true;
    return input;
}
function readMultipleInput() {
    var inputs = [];
    i=0;
    for (var singleclass in question.classes) {
        if (question.classes.hasOwnProperty(singleclass)) {
            if($("#input" + i).val()==""){
                missinginput=true;
                break;
            }
            inputs.push($("#input" + i).val());
            i++;
        }
    }
    console.log(inputs)
    return inputs;
}


function thumbnailChosen (value) {
    current_question=value;
    pickQuestion();
}
