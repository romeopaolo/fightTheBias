//Dictionary containing all sections
var sections;
var suggweights;
var current_section = 1;
var current_question;
var current_section_name;
var numberOfQuestions;
var numberOfSections;
var question;
var suggweight;
var suggweightname = "";
var dataStructure = {};
var missinginput = false;
var context;
var sectionIndex;
var results;
var intermediate;

//Parse the JSON with the questions when the page is loaded
$(document).ready(function () {
    $.getJSON("./data/questions.json", function (json) { // show the JSON file content into console
        sections = json;
        current_section_name = displayCurrentSection(1);

        // count sections TODO: put in a better place
        var stop = false;
        numberOfSections = 0;
        while (!stop) {
            if (sections.hasOwnProperty("section" + (numberOfSections + 1))) {
                numberOfSections++;
            } else {
                stop = true;
            }
        }
    });

    $(".btn-first-choice").click(function () {
        //TODO: disable sections
        //$('nav a').off('click');
        intermediate = true;
        $("#0").addClass("active");
        $('nav a').on('click', function () {
            if (intermediate == true) {
                $("#intermediate").toggleClass("hide");
                $("#question-section-body").toggleClass("hide");
                $("#section").toggleClass("hide");
                $(".btn-circle").toggleClass("hide");
                displayThumbnails();
            }
            intermediate = false;
            $("nav a").removeClass("active");
            $(this).addClass("active");
            if (results == true) {
                $("#question-section-body").toggleClass("hide");
                $("#section").toggleClass("hide");
                $("#thumbnails").toggleClass("hide");
                $("#results").toggleClass("hide");
                $(".btn-circle").toggleClass("hide");
                results = false;
            }
            current_section = this.id;
            current_question = 1;
            
            pickQuestion();
            displayThumbnails();
            $("#thumbnail1").css('color', '#737373');
            $("#thumbnail1").css('border-color', '#737373');
            for (var t = current_question; t <= numberOfQuestions; t++) {
                if (!isNaN(getWeightFromDataStructure(current_section, t))) {
                    document.getElementById("thumbnail" + t).innerHTML = "Q" + t + " ~ " + switchcaseOnWeights(getWeightFromDataStructure(current_section, t));
                }
            }
        });
        $('#0').off('click');
        $('#0').on('click', function () {

            if (results == true) {
                $("#question-section-body").toggleClass("hide");
                $("#results").toggleClass("hide");
                $(".btn-circle").toggleClass("hide");
                $("#section").toggleClass("hide");
                $("#thumbnails").toggleClass("hide");
                results = false;
            }

            if (intermediate == false) {
                $("nav a").removeClass("active");
                $(this).addClass("active");
                intermediate = true;
                $("#intermediate").toggleClass("hide");
                $("#question-section-body").toggleClass("hide");
                $("#section").toggleClass("hide");
                $("#thumbnails").empty();
                $("#thumbnails").append('<h1>Introduction:</h1>');
                $(".btn-circle").toggleClass("hide");
            }
        });
        $("#7").off('click');
        $("#7").on('click', function () {
            alertMX("You must complete at least one section to consult the results!")
        });
        context = $(this).text();
        displaySectionsPage();
        var path = "./data/suggested_weights_" + context.toLowerCase() + ".json";
        $.getJSON(path, function (json) { // show the JSON file content into console
            suggweights = json;
            $("#intermediateintro").empty();
            //$("#intermediateintro").append('<div class="row">')
            var subtitle = '<div id="subtitle"><b>Assign a weight to each section:</b></div>'
            $("#intermediateintro").append(subtitle);
            for (var j in suggweights) {
                sect = '<div class="row sections"><div class="col-sm-9"><b>' + displayCurrentSection(j.substr(7)) + '</b><br> ' + suggweights[j]["description"] + ' <i>Suggested weight: <b>' + switchcaseOnWeights(suggweights[j]["weight"]) + '</b></i></div>'
                    + '<div class="col-sm-3">'
                    + '<select id=' + j + ' class="btn btn-block sectionweight">'
                    + '<option value="0">Not Relevant</option>'
                    + '<option value="1">Very Low</option>'
                    + '<option value="2">Low</option>'
                    + '<option value="3">Medium</option>'
                    + '<option value="4">High</option>'
                    + '<option value="5">Very High</option>'
                    + '<option value="" selected disabled hidden>Choose Your Weight</option>'
                    + '</select>'
                    + '</div></div>'
                $("#intermediateintro").append(sect);
            }
            //$("#intermediateintro").append('</div>');
            $("#intermediateintro").append('<button type="button" class="btn btn-sq btn-second-choice " id="btn-second-choice" onclick="startquestionnaire()"><b>Save your weights and go to questions</b></button>');
        });

        /*
        context = $(this).text();
        //alert(context);
        displayThumbnails();
        var path = "./data/suggested_weights_" + context.toLowerCase() + ".json";
        $.getJSON(path, function (json) { // show the JSON file content into console
            suggweights = json;
            //console.log(suggweights);
            pickFirstQuestion();
        });
        */
    });


});

function startquestionnaire() {
    intermediate = false;

    $("#0").removeClass("active");
    $("#1").addClass("active");
    /*$('nav a').on('click', function () {
        $("nav a").removeClass("active");
        $(this).addClass("active");
        if (results == true) {
            $("#question-section-body").toggleClass("hide");
            $("#section").toggleClass("hide");
            $("#thumbnails").toggleClass("hide");
            $("#results").toggleClass("hide");
            $(".btn-circle").toggleClass("hide");
            results = false;
        }
        current_section = this.id;
        current_question = 1;
        pickQuestion();
        displayThumbnails();
        $("#thumbnail1").css('color', '#737373');
        $("#thumbnail1").css('border-color', '#737373');
        for (var t = current_question; t <= numberOfQuestions; t++) {
            if (!isNaN(getWeightFromDataStructure(current_section, t))) {
                document.getElementById("thumbnail" + t).innerHTML = "Q" + t + " ~ " + switchcaseOnWeights(getWeightFromDataStructure(current_section, t));
            }
        }
    });*/
    /*$("#7").off('click');
    $("#7").on('click', function () {
        alertMX("KEEP CALM: You must complete at least one section to consult the results!")
    });*/

    for (let i = 1; i <= numberOfSections; i++) {
        if (!dataStructure.hasOwnProperty("section" + i)) {
            dataStructure["section" + i] = {};
        }

        let newWeight = parseInt($("#section" + i).val());
        if (dataStructure["section" + i].hasOwnProperty("weight")) {
            if (dataStructure["section" + i].hasOwnProperty("value")) {
                let oldWeight = dataStructure["section" + i]["weight"];
                let oldResult = dataStructure["section" + i]["result"];
                dataStructure["section" + i]["result"] = oldResult / oldWeight * newWeight;
            }
            dataStructure["section" + i]["weight"] = newWeight;
        } else {
            dataStructure["section" + i]["weight"] = newWeight;
        }
    }

    if (checkSectionWeights()) {
        displayThumbnails();
        pickFirstQuestion();
        //$('#logo').off('click');
    }
    else {
        alertMX("You must choose a weight for each section before proceeding!")
    }
}

function checkSectionWeights() {
    let flag = true;

    for (let i = 1; i <= numberOfSections && flag; i++) {
        if (isNaN(dataStructure["section" + i]["weight"])) {
            flag = false;
        }
    }

    return flag;
}

function displaySectionsPage() {
    $("#first-choice").toggleClass("hide");
    $("#intermediate").toggleClass("hide");
    $("#question-section").toggleClass("hide");
    $(".leftbox").toggleClass("hide");
    $("#logo").toggleClass("hide");
    $("#thumbnails").empty();
    $("#thumbnails").append('<h1>Introduction:</h1>');
    $("#thumbnails").css('color', 'white')
    $("#thumbnails").css('margin-left', '0px')
    //$("#result").toggleClass("hide");

    //showIntroduction();
    //showIntermediateResults();
    //goAhead();
}

var pickFirstQuestion = function () {
    changeScenario();
    pickQuestion();
};

var changeScenario = function () {
    $("#intermediate").toggleClass("hide");
    //$("#first-choice").toggleClass("hide");
    //$("#question-section").toggleClass("hide");
    //$("#logo").toggleClass("hide");
    //$(".leftbox").toggleClass("hide");
    $("#section").toggleClass("hide");
    // $("#question-section").toggleClass("scene_element scene_element--fadeinup");
    $("#question-section-body").toggleClass("hide");
    $("#submit").toggleClass("hide");
    // $("#question-section-body").toggleClass("scene_element scene_element--fadeinup");
};

//Pick the current question
var pickQuestion = function () {
    $(".btn.thumbnail").css('color', 'white');
    $(".btn.thumbnail").css('border-color', 'white');
    $("#thumbnail" + current_question).css('color', '#737373');
    $("#thumbnail" + current_question).css('border-color', '#737373');
    if (current_section <= numberOfSections) {
        question = sections["section" + current_section]["question" + current_question];
        suggweight = suggweights["section" + current_section]["question" + current_question];
        suggweightname = switchcaseOnWeights(suggweight);
    }

    loadQuestion();
};

var displayThumbnails = function () {
    current_question = 1;
    numberOfQuestions = 0;
    section = sections["section" + current_section];
    thumbnails = "";
    for (var question in section) {
        if (section.hasOwnProperty(question)) {
            ++numberOfQuestions;
            thumbnails += '<div class="col">'
                + '<button type="button" class="btn thumbnail ' + context.toLowerCase() + '" id="thumbnail' + numberOfQuestions + '" onclick="thumbnailChosen(' + numberOfQuestions + ')">Q' + numberOfQuestions + '</button>'
                + '</div>';

            $("#thumbnails").empty();
            $("#thumbnails").append(thumbnails);
        }
    }
};

//Pick the next question
var loadNextQuestion = function () {
    current_question++;
    sectionIndex = "section" + current_section;

    // count the answers you have for the current section
    let numberOfAnswers = countAnswers(dataStructure[sectionIndex]);

    //
    if (numberOfAnswers === numberOfQuestions) {
        // if the previous question was the last of the current section
        if (current_question > numberOfQuestions) {

            // evaluate of the section result
            let val = evaluateSection(sectionIndex);
            dataStructure[sectionIndex]["value"] = val;

            if (dataStructure[sectionIndex].hasOwnProperty("weight")) {
                dataStructure[sectionIndex]["result"] = val * dataStructure[sectionIndex]["weight"];
            }

            // update the section
            current_section++;
            current_section_name = displayCurrentSection(current_section);
            if (getCompleteSections().length > 0) {
                $('#7').off('click');
                $('#7').on('click', function () {
                    if (intermediate == true) {
                        $("#intermediate").toggleClass("hide");
                        $("#question-section-body").toggleClass("hide");
                        $("#section").toggleClass("hide");
                        intermediate = false;
                    }
                    $("nav a").removeClass("active");
                    $(this).addClass("active");
                    current_section = this.id;
                    loadResults()
                });
            }

            $("nav a").removeClass("active");
            $('#' + current_section).addClass("active");
            displayThumbnails();

            // if this is the last section
            if (current_section > numberOfSections) {
                // show results
                loadResults();
                $('#7').off('click');

                $("#7").on('click', function () {
                    if (intermediate == true) {
                        $("#intermediate").toggleClass("hide");
                        $("#question-section-body").toggleClass("hide");
                        $("#section").toggleClass("hide");
                        intermediate = false;
                    }
                    $("nav a").removeClass("active");
                    $(this).addClass("active");
                    current_section = this.id;
                    loadResults();

                });
            } else {
                // load the first question of the new section
                pickQuestion();
            }
        } else {
            // update the result of the section
            let val = evaluateSection(sectionIndex);
            dataStructure[sectionIndex]["value"] = val;

            if (dataStructure[sectionIndex].hasOwnProperty("weight")) {
                dataStructure[sectionIndex]["result"] = val * dataStructure[sectionIndex]["weight"];
            }

            // load the next question of the current section
            pickQuestion();
        }
    } else {
        // if the previous question was the last of the current section
        if (current_question > numberOfQuestions) {
            // show an alert, you must provide all the answers to go to the next section. Stay in the current question
            alertMX("You must answer all the questions in this section before leaving it. Be sure you submitted all the previous answers.");
            current_question--;
        } else {
            // load the next question
            pickQuestion()
        }
    }
};

// compute the number of questions of the current section that received a complete answer
function countAnswers(sec) {
    let count = 0;
    let key;
    // iterate over the attributes of the section
    for (key  in sec) {
        // if it is a question
        if (key.includes("question")) {
            // and it has been answered
            if (sec[key].hasOwnProperty("result")) {
                // increase the size
                count++;
            }
        }
    }
    return count;
}


/**
 * TODO:
 */
var loadQuestion = function () {

    var sectiondiv = "";
    current_section_name = displayCurrentSection(current_section);
    sectiondiv += '<div><h2><b>' + current_section_name + '</b></h2></div>';
    //Check if it is boolean
    if (question.boolean) {
        var elem = "";
        elem += '<div class="row">'
            + '<div class="col-xs-12 col-md-9">'
            + '<h1><b>Question #' + (current_question) + '</b></h1>' + '<br>'
            + '<h2>' + question.text + '</h2><br>'
            + '<div class="radio-toolbar">'
            + '<input type="radio" class="inputboolean ' + context.toLowerCase() + '" name="Y/N" value="1"/>'
            + '<label>Yes</label>'
            + '<br/><input type="radio" class="inputboolean ' + context.toLowerCase() + '" name="Y/N" value="0"/>'
            + '<label>No</label>'
            + '</div><br><br>'
            + '<h6><i><b>Question explanation:</b><br> ' + question.description + '</i></h6>' + '<br>'
            + '</div>'
            + '<div class="col-xs-12 col-md-3">'
            + '<div class="row d-flex flex-row-reverse">'
            + '<button type="button"class="btn btn-block suggweight ' + context.toLowerCase() + ' m-2 p-3"><i>Suggested Weight:</i> <br> <b>' + suggweightname + '</b></button>'
            + '</div>'
            + '<select id="weight" class="btn btn-block weight ' + context.toLowerCase() + '" >'
            + '<option value="" selected disabled hidden>Choose Your Weight</option>'
            + '<option value="0">Not Relevant</option>'
            + '<option value="1">Very Low</option>'
            + '<option value="2">Low</option>'
            + '<option value="3">Medium</option>'
            + '<option value="4">High</option>'
            + '<option value="5">Very High</option>'
            + '</select>'
            + '</div>'
            + '</div>'
    } else {

        var elem = "";
        elem += '<div class="row">' +
            '<div class="col-xs-12 col-md-9">'
            + '<h1><b> Question #' + (current_question) + '</b></h1>' + '<br>'

            + '<h2>' + question.text + '</h2><br>';

        // display the list of classes
        elem += '<ul>';
        for (var index in question.classes) {
            //console.log(index);
            elem += '<li>' + question.classes[index] + '<input type="text" class="inputbox ' + context.toLowerCase() + '" id="input' + index + '" /></li>'
        }
        elem += '</ul><br><br>' + '<h6><i><b>Question explanation:</b><br> ' + question.description + '</i></h6>' + '<br>';

        elem += '</div>' +
            '<div class="col-xs-12 col-md-3">' +
            '<div class="row d-flex flex-row-reverse">' +
            '<button type="button"class="btn btn-block suggweight ' + context.toLowerCase() + ' m-2 p-3 "><i>Suggested Weight:</i> <br> <b>' + suggweightname + '</b></button>' +
            '</div>' +
            '<select id="weight" class="btn btn-block weight ' + context.toLowerCase() + '" >' +
            '<option value="0">Not Relevant</option>' +
            '<option value="1">Low</option>' +
            '<option value="2">Very Low</option>' +
            '<option value="3">Medium</option>' +
            '<option value="4">High</option>' +
            '<option value="5">Very High</option>' +
            '<option value="" selected disabled hidden>Choose Your Weight</option>' +
            '</select>' +
            '</div>' +
            '</div>'
    }

    //Clear the html
    $("#question").empty();
    //Append the new question
    $("#question").append(elem);

    $("#section").empty();
    //Append the new question
    $("#section").append(sectiondiv);

    if (!isNaN(getWeightFromDataStructure(current_section, current_question))) {
        let count = parseInt(getWeightFromDataStructure(current_section, current_question)) + 1;
        document.getElementById("weight").getElementsByTagName('option')[count].selected = 'selected';
        document.getElementById("thumbnail" + current_question).innerHTML = "Q" + current_question + " ~ " + switchcaseOnWeights($("#weight").val());
    }

    if (!isNaN(getDataFromDataStructure(current_section, current_question)) && question.boolean) {
        $('input[name="Y/N"][value=' + getDataFromDataStructure(current_section, current_question) + ']').prop('checked', true)
    } else {
        for (var j = 0; j < getDataFromDataStructure(current_section, current_question).length; j++) {
            $("#input" + j).val(getDataFromDataStructure(current_section, current_question)[j])
        }
    }
};

function loadResults() {
    $("#resultspanel").empty();
    if (results != true) {
        $("#question-section-body").toggleClass("hide");
        $("#section").toggleClass("hide");
        $("#thumbnails").toggleClass("hide");
        $("#results").toggleClass("hide");
        $(".btn-circle").toggleClass("hide");
        results = true;
    }


    var elem = "";

    dataStructure["finalResult"] = calculateFinalResult();

    // display the final result
    if (dataStructure.hasOwnProperty("finalResult")) {
        let overallQuality = (parseFloat(dataStructure["finalResult"]) * 100).toFixed(2);
        elem += '<div class="row">' +
            '<div class="col-sm-12">' +
            '   <h2><b> Overall Results</b></h2><br><hr>' +
            '   <h3><i>The overall quality is: ' + overallQuality + '%</i></h3><br>' +
            '</div></div>';
    } else {
        console.log("An error occurred in the final result");
    }

    // display the graphs
    elem +=
        // Overall result
        '<div class="row">' +
        '   <div class="col-sm-6">' +
        '       <h4 id="firstbar">Results of the sections:</h4><br>' +
        '       <div class="bar-container" id="sectionsBar"></div>' +
        '   </div>' +
        // Weights
        '   <div class="col-sm-6">' +
        '       <h4 id="firstdonut">Weights of the sections:</h4><br>' +
        '       <div class="donut-container" id="sectionsDonut"></div>' +
        '   </div><hr>' + // TODO: metterei una linea (<hr>) tra le sezioni, ma non si vede
        '</div>';

    // open row div
    elem += '<h3 id="impact"><i>Impact of the questions in each section:</i></h3><br><hr>'
        + '<div class="row">';

    // insert one div for each section graph
    let index;
    let filledSections = getCompleteSections();
    for (index in filledSections) {
        if (dataStructure["section" + filledSections[index]].hasOwnProperty("result")) {
            let quality = (parseFloat(dataStructure["section" + filledSections[index]]["value"]) * 100).toFixed(2);
            elem +=
                '   <div class="col-sm-4">' +
                '       <h3 id="sectionquality">Quality of section ' + filledSections[index] + ': ' + quality + '%</h3>' +
                '       <h4 id="otherdonut">Weights of the questions:</h4>' +
                '       <div class="donut-container" id="section' + filledSections[index] + 'Donut"></div>' +
                '   </div>';
        }
    }

    // close row div
    elem += '</div>';

    // load the results
    $("#resultspanel").append(elem);

    // render graphs
    showBarGraph("sectionsBar", extractOverallData());
    showDonutGraph("sectionsDonut", extractOverallWeights());

    for (index in filledSections) {
        if (dataStructure["section" + filledSections[index]].hasOwnProperty("result")) {
            showDonutGraph('section' + filledSections[index] + 'Donut', getSectionWeightsForDonut(filledSections[index]));
        }
    }
}

function evaluateVariable(arr) {
    let n = arr.length;

    //average computation
    var sum = 0;
    for (var i = 0; i < n; i++) {
        sum = parseInt(arr[i]) + sum;
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

    return (1 - (dev / max_dev))
}

/**
 * Evaluate the quality of the section. To transform into a probability of bias, divide by the weight of the section and subtract from 1.
 * @param secName
 * @returns {number} a measure of the quality of the section. The higher the better.
 */
function evaluateSection(secName) {
    var res = 0;
    var weights = 0;
    var secData = dataStructure[secName];

    // collect data
    for (var i = 1; i <= numberOfQuestions; i++) {
        if (secData["question" + i].hasOwnProperty("result") && secData["question" + i].hasOwnProperty("weight")) {
            res = res + parseInt(secData["question" + i]["result"]);
            weights = weights + parseInt(secData["question" + i]["weight"])
        }
    }

    // evaluate
    return res / weights
}

/**
 * Evaluate the overall quality
 * @returns {number} the probability of positively facing bias. The higher the better
 */
function calculateFinalResult() {
    var cum_res = 0;
    var cum_weights = 0;

    let i;
    let index;
    let filledSections = getCompleteSections();
    for (index in filledSections) {
        i = filledSections[index];
        if (dataStructure.hasOwnProperty("section" + i) && dataStructure["section" + i].hasOwnProperty("result") && dataStructure["section" + i].hasOwnProperty("weight")) {
            cum_res = cum_res + parseInt(dataStructure["section" + i]["result"]);
            cum_weights = cum_weights + parseInt(dataStructure["section" + i]["weight"]);
        } else {
            console.log("Section, weight or result not present");
        }
    }
    return (cum_res / cum_weights)
}

/*$("nav a").click(function () {
    $("nav a").removeClass("active");
    $(this).addClass("active");
    current_section = this.id;
    current_question = 1;
    pickQuestion();
    displayThumbnails();
    for (var t = current_question; t <= numberOfQuestions; t++) {
        if (!isNaN(getWeightFromDataStructure(current_section, t))) {
            document.getElementById("thumbnail" + t).innerHTML = "Q" + t + " ~ " + switchcaseOnWeights(getWeightFromDataStructure(current_section, t));
        }
    }
});*/

$("#submit").click(function () {

    var sectionIndex = "section" + current_section;
    var questionIndex = "question" + current_question;
    var value;

    // read classes
    if (!question.boolean) {
        value = readMultipleInput();
    } else {
        value = readBooleanInput();
    }

    var weight = $("#weight").val();

    // if it is the first question of the section
    if (!dataStructure.hasOwnProperty(sectionIndex)) {
        dataStructure[sectionIndex] = {};
    }

    //moved to line 326

    //console.log("Missing input: " + missinginput);
    if (weight != null && !missinginput) {


        // create the question
        dataStructure[sectionIndex][questionIndex] = {};

        // fill the question
        dataStructure[sectionIndex][questionIndex]["data"] = value;
        dataStructure[sectionIndex][questionIndex]["weight"] = weight;
        if (!question.boolean) {
            dataStructure[sectionIndex][questionIndex]["result"] = evaluateVariable(value) * weight;
        } else {
            dataStructure[sectionIndex][questionIndex]["result"] = value * weight;
        }

        document.getElementById("thumbnail" + current_question).innerHTML = "Q" + current_question + " ~ " + switchcaseOnWeights($("#weight").val());
        loadNextQuestion();
        missinginput = false;
        weight = null;
    }
    else {
        alertMX("Missing weight or input class!");
        missinginput = false;
    }

});

function readBooleanInput() {
    var input;
    input = $("input[name='Y/N']:checked").val();

    if (input == undefined) {
        missinginput = true;
    } else {
        // check to detect the questions with reverse meaning
        if (sections.hasOwnProperty("section" + current_section)) {
            if (sections["section" + current_section].hasOwnProperty("question" + current_question)) {
                if (sections["section" + current_section]["question" + current_question].hasOwnProperty("reverse")) {
                    if (parseInt(input) === 1) {
                        input = 0;
                    } else if (parseInt(input) === 0) {
                        input = 1;
                    }
                }
            }
        }
    }

    return input;
}

function readMultipleInput() {
    var inputs = [];
    i = 0;
    for (var singleclass in question.classes) {
        if (question.classes.hasOwnProperty(singleclass)) {
            if ($("#input" + i).val() == "") {
                missinginput = true;
                break;
            }
            inputs.push($("#input" + i).val());
            i++;
        }
    }
    return inputs;
}


function thumbnailChosen(value) {
    current_question = value;
    pickQuestion();
}

function switchcaseOnWeights(value) {
    switch (value * 1) {
        case 0:
            return "Not Relevant";
        case 1:
            return "Very Low";
        case 2:
            return "Low";
        case 3:
            return "Medium";
        case 4:
            return "High";
        case 5:
            return "Very High";
        default:
            console.log("Problem with sugg. weights")
    }
}

function displayCurrentSection(value) {
    switch (value * 1) {
        case 1:
            return "Preliminary Questions";
        case 2:
            return "Team Organization";
        case 3:
            return "Data Gathering";
        case 4:
            return "Data Quality";
        case 5:
            return "Dataset Dimension";
        case 6:
            return "General Evaluation";
        case 7:
            return "Results";
        default:
            console.log("Problem with sections")
    }
}

$("#logo").click(function () {
    swal("Are you sure you want to go back to the choice of the context? You will lose your data.", {
        buttons: {
            home: {
                text: "Home"
            },
            stay: {
                text: "Stay"
            },
        },
    }).then((value) => {
        switch (value) {
            case "home":
                if(intermediate==true){
                    $("#first-choice").toggleClass("hide");
                    $(".leftbox").toggleClass("hide");
                    $("#logo").toggleClass("hide");
                    $("#question-section").toggleClass("hide");
                    $("#intermediate").toggleClass("hide");
                    $("#0").removeClass("active");
                    intermediate=false;
                }
                else if(results==true){
                    $("#first-choice").toggleClass("hide");
                    $(".leftbox").toggleClass("hide");
                    $("#logo").toggleClass("hide");
                    $("#question-section").toggleClass("hide");
                    $("#thumbnails").toggleClass("hide");
                    $("#results").toggleClass("hide");
                    $("#7").removeClass("active");
                    results=false;
                }
                else{
                    $("#first-choice").toggleClass("hide");
                    $(".leftbox").toggleClass("hide");
                    $("#logo").toggleClass("hide");
                    $("#question-section-body").toggleClass("hide");
                    $("#question-section").toggleClass("hide");
                    $("#section").toggleClass("hide");
                    $(".btn-circle").toggleClass("hide");
                    $("nav a").removeClass("active");
                }
                // reset the data structure
                dataStructure = {};
                break;
            case "stay":
                break;
            default:
        }
    });
    /*
        if (confirm('Are you sure you want to go back to the choice of the context? You will lose your data.')) {
            $("#first-choice").toggleClass("hide");
            $(".leftbox").toggleClass("hide");
            $("#logo").toggleClass("hide");
            $("#question-section").toggleClass("hide");
            $("#intermediate").toggleClass("hide");

            // reset the data structure
            dataStructure = {};
        } else {
            // Do nothing!
        }
        */
});

$("<style type='text/css'>#boxMX{display:none;background: #333;padding: 10px;border: 2px solid #ddd;float: left;font-size: 1.2em;position: fixed;top: 50%; left: 50%;z-index: 99999;box-shadow: 0px 0px 20px #999; -moz-box-shadow: 0px 0px 20px #999; -webkit-box-shadow: 0px 0px 20px #999; border-radius:6px 6px 6px 6px; -moz-border-radius: 6px; -webkit-border-radius: 6px; font:13px Arial, Helvetica, sans-serif; padding:6px 6px 4px;width:300px; color: white;}</style>").appendTo("head");

function alertMX(t) {
    swal(t, {
        buttons: {
            confirm: true
        }
    });

    /*
    $("body").append($("<div id='boxMX' align='center'><p class='msgMX'></p><p>Press<br><br><<b>OK</b><br><br>to continue.</p></div>"));
    $('.msgMX').text(t);
    var popMargTop = ($('#boxMX').height() + 24) / 2, popMargLeft = ($('#boxMX').width() + 24) / 2;
    $('#boxMX').css({'margin-top': -popMargTop, 'margin-left': -popMargLeft}).fadeIn(600);
    $("#boxMX").click(function () {
        $(this).remove();
    });
    */
}

// show charts
function showBarGraph(divName, data) {
    // container
    const bar_container = d3.select('#' + divName);

    // chart
    const barChart = britecharts.bar();

    // configuration
    barChart
        .margin({left: 60})
        .isHorizontal(false)
        .height(200)
        .width(400)
        .isAnimated(true)
        .xAxisLabel("Sections")
        .yAxisLabel("Quality")
        //.yAxisLabelOffset()
        //.xTicks(3)
        //.enableLabels(true)
        //.numberFormat('%')
        .loadingState("Collecting data...")
        .hasPercentage(true)
        .labelsMargin(10)
        .colorSchema(["#d0c4df", '#77a6b6', '#b3d89c', '#9dc3c2', '#daf7dc', '#efd09e', '#f1ffc4', '#f7c4a5', '#d8e4ff']);

    // fill with data and show
    bar_container.datum(data).call(barChart);

    // responsiveness
    const redrawChart = () => {
        const newBarContainerWidth = bar_container.node() ? bar_container.node().getBoundingClientRect().width : false;

        // Setting the new width on the chart
        if (barChart.width > newBarContainerWidth) {
            barChart.width(newBarContainerWidth);
            // Rendering the chart again
            bar_container.call(barChart);
        }
    };
    const throttledRedraw = _.throttle(redrawChart, 200);

    window.addEventListener("resize", throttledRedraw);
}

function showDonutGraph(divName, data) {
    // containers
    const donut_container = d3.select('#' + divName);

    // chart
    const donutChart = britecharts.donut();

    // configuration
    donutChart
        .margin({left: 10})
        .height(300)
        .width(300)
        .externalRadius(100)
        .internalRadius(20)
        .isAnimated(true)
        .colorSchema(["#d0c4df", '#77a6b6', '#b3d89c', '#9dc3c2', '#daf7dc', '#efd09e', '#f1ffc4', '#f7c4a5', '#d8e4ff']);

    // fill with data and show
    donut_container.datum(data).call(donutChart);

    // responsiveness
    const redrawChart = () => {
        const newDonutContainerWidth = donut_container.node() ? donut_container.node().getBoundingClientRect().width : false;

        // Setting the new width on the chart
        if (donutChart.width > newDonutContainerWidth) {
            donutChart.width(newDonutContainerWidth);
            // Rendering the chart again
            donut_container.call(donutChart);
        }
    };
    const throttledRedraw = _.throttle(redrawChart, 200);

    window.addEventListener("resize", throttledRedraw);
}

// Collect the result of each section
function extractOverallData() {
    var data = [];

    for (var i = 1; i <= numberOfSections; i++) {
        if (!(getOverallResultForBar(i) === -1)) {
            data.push(getOverallResultForBar(i));
        }
    }
    return data;
}

// TODO: change "result" to "value" to prevent the multiplication for the weight
// Get the result of a section in the proper way to fill a bar graph
function getOverallResultForBar(section) {
    let obj = {};
    if (dataStructure.hasOwnProperty("section" + section)) {
        if (dataStructure["section" + section].hasOwnProperty("value")) {
            obj["name"] = "S" + section;
            obj["value"] = parseFloat(dataStructure["section" + section]["value"]).toFixed(4);
            return obj;
        }
    }
    console.log("Result not present");
    return -1
}

// Collect the weight of each section
function extractOverallWeights() {
    var data = [];

    for (var i = 1; i <= numberOfSections; i++) {
        if (!(getOverallWeightsForDonut(i) === -1)) {
            data.push(getOverallWeightsForDonut(i));
        }
    }

    return data;
}

// Get the weight of a section in the proper way to fill a donut graph
function getOverallWeightsForDonut(section) {
    let obj = {};
    if (dataStructure.hasOwnProperty("section" + section)) {
        if (dataStructure["section" + section].hasOwnProperty("result") && dataStructure["section" + section].hasOwnProperty("weight")) {
            obj["quantity"] = dataStructure["section" + section]["weight"];
            obj["name"] = "S" + section;
            return obj;
        }
    }
    console.log("Result not present");
    return -1
}

// to access the data structure
function getDataFromDataStructure(section, question) {
    if (dataStructure.hasOwnProperty("section" + section)) {
        if (dataStructure["section" + section].hasOwnProperty("question" + question)) {
            if (dataStructure["section" + section]["question" + question].hasOwnProperty("data")) {
                return dataStructure["section" + section]["question" + question]["data"]
            }
        }
    }
    console.log("Input not present");
    return NaN
}

function getWeightFromDataStructure(section, question) {
    if (dataStructure.hasOwnProperty("section" + section)) {
        if (dataStructure["section" + section].hasOwnProperty("question" + question)) {
            if (dataStructure["section" + section]["question" + question].hasOwnProperty("weight")) {
                return dataStructure["section" + section]["question" + question]["weight"]
            }
        }
    }
    console.log("Weight not present");
    return NaN
}

// TODO: delete if not useful
function getResultFromDataStructure(section, question) {
    if (dataStructure.hasOwnProperty("section" + section)) {
        if (dataStructure["section" + section].hasOwnProperty("question" + question)) {
            if (dataStructure["section" + section]["question" + question].hasOwnProperty("result")) {
                return dataStructure["section" + section]["question" + question]["result"]
            }
        }
    }
    console.log("Result not present");
    return NaN
}

// Collect the weights of all the questions of a section to fill a donut graph
function getSectionWeightsForDonut(section) {
    let arr = [];
    let flag = true;
    let i = 1;

    if (dataStructure.hasOwnProperty("section" + section)) {
        while (flag) {
            if (dataStructure["section" + section].hasOwnProperty("question" + i)) { // TODO: check the condition
                arr.push({
                    "quantity": dataStructure["section" + section]["question" + i]["weight"],
                    "name": ("Q" + i)
                });
                i += 1;
            } else {
                flag = false;
                return arr;
            }
        }
    }
    console.log("Section not present");
    return -1
}

function getCompleteSections() {
    let arr = [];
    let key;
    // iterate over the attributes of the section
    for (key in dataStructure) {
        // if it is a question
        if (key.includes("section")) {
            // and it has been answered
            if (dataStructure[key].hasOwnProperty("result")) {
                // increase the size
                arr.push(key.substring("section".length));
            }
        }
    }
    return arr;
}

/*
function downloadData() {
    const fs = require('fs');
    var jsonObj = JSON.parse(dataStructure);
    console.log(jsonObj);
    var jsonContent = JSON.stringify(jsonObj);
    console.log(jsonContent);
    fs.writeFile("fightTheBias.json", jsonContent, 'utf8', function (err) {
        if(err) {
            console.log("An error occurred while downloading the file.");
            return console.log(err);
        }
    });

    console.log("Download completed")
}
*/