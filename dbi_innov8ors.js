//Dictionary containing all sections
var sections;
var suggweights;
var current_section = 1;
var current_question;
var current_section_name;
var numberOfQuestions;
var question;
var suggweight;
var suggweightname = "";
var dataStructure = {};
var missinginput = false;
var context;
var sectionIndex;


//Parse the JSON with the questions when the page is loaded
$(document).ready(function () {

    $.getJSON("./data/questions.json", function (json) { // show the JSON file content into console
        sections = json;
        console.log(sections);

        
        current_section_name = displayCurrentSection(1);
    });

    $(".btn-first-choice").click(function () {
        $('#1').off('click');
        $('#2').off('click');
        $('#3').off('click');
        $('#4').off('click');
        $('#5').off('click');
        $('#6').off('click');

        context = $(this).text();
        displaySectionsPage();
        var path = "./data/suggested_weights_" + context.toLowerCase() + ".json";
        $.getJSON(path, function (json) { // show the JSON file content into console
            suggweights = json;
            console.log(suggweights)
            $("#intermediateintro").empty();
            //$("#intermediateintro").append('<div class="row">')

            for (var j in suggweights){
                console.log(j+"PORCA")
                sect='<div class="row sections"><div class="col-sm-8"><b>'+displayCurrentSection(j.substr(7))+'</b><br> Description - Suggested weight: '+switchcaseOnWeights(suggweights[j]["weight"])+'</div>'
                + '<div class="col-sm-4">'
                    + '<select id='+j+' class="btn btn-block sectionweight">'
                        + '<option value="0">Zero</option>'
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
            $("#intermediateintro").append('<button type="button" class="btn btn-sq btn-second-choice " id="btn-second-choice" onclick="startquestionnaire()"><b>Start the questionnaire!</b></button>');
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
    var weightsection1 = $("#section1").val();
    console.log(weightsection1)
    var weightsection2 = $("#section2").val();
    var weightsection3 = $("#section3").val();
    var weightsection4 = $("#section4").val();
    var weightsection5 = $("#section5").val();
    var weightsection6 = $("#section6").val();
    if(weightsection1&&weightsection2&&weightsection3&&weightsection4&&weightsection5&&weightsection6){
        displayThumbnails();
        pickFirstQuestion();
        $('#logo').off('click');
    }
    else{
        alertMX("KEEP CALM: You have to choose a weight for each section if you want to proceed!")
    }
    
};

function displaySectionsPage(){
    $("#first-choice").toggleClass("hide");
    $("#intermediate").toggleClass("hide");
    $("#question-section").toggleClass("hide");
    $(".leftbox").toggleClass("hide");
    $("#logo").toggleClass("hide");
    
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

var pickQuestion = function () {
    //Pick the current question
    console.log(sections["section" + current_section]["question" + current_question]);
    question = sections["section" + current_section]["question" + current_question];
    suggweight = suggweights["section" + current_section]["question" + current_question];

    suggweightname = switchcaseOnWeights(suggweight);

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
                + '<button type="button" class="btn thumbnail '+context.toLowerCase()+'" id="thumbnail' + numberOfQuestions + '" onclick="thumbnailChosen(' + numberOfQuestions + ')">Q' + numberOfQuestions + '</button>'
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
    // check if to change section
    //dataStructure[sectionIndex].size = computeSize(dataStructure[sectionIndex])-1;

    if (current_question <= numberOfQuestions&&computeSize(dataStructure[sectionIndex])!=numberOfQuestions){
        pickQuestion();
    }


    else if ( computeSize(dataStructure[sectionIndex])==numberOfQuestions) {

        // TODO: display this result
        // evaluation of the section result
        
        dataStructure[sectionIndex]["result"] = evaluateSection(sectionIndex);

        console.log("Section result: " + evaluateSection(sectionIndex));


        current_section++;
        current_section_name = displayCurrentSection(current_section);

        $("nav a").removeClass("active");
        $('#'+current_section).addClass("active");

        displayThumbnails();
        if (current_section > sections.length) {
            dataStructure["finalResult"] = calculateFinalResult();
        }

        pickQuestion();
        
    }

    else if ((current_question > numberOfQuestions) && (computeSize(dataStructure[sectionIndex])!=numberOfQuestions)){
        alertMX("KEEP CALM: You must answer all the questions in this section before leaving it!");
        current_questi
    }
    
    
};

function computeSize(obj) {
    var localsize = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) localsize++;
    }
    return localsize;
};




/**
 * TODO:
 */
var loadQuestion = function () {

    var sectiondiv="";
    current_section_name = displayCurrentSection(current_section);
    sectiondiv+='<div><b>'+current_section_name+'</b></div>';
    //Check if it is boolean
    if (question.boolean) {
        var elem = "";
        elem += '<div class="row">' 
                    +'<div class="col-sm-9">'
                        + '<h1><b>Question #' + (current_question) + '</b></h1>' + '<br>'
                        + '<h2>' + question.text + '</h2><br>'
                        + '<div class="radio-toolbar">'
                                + '<input type="radio" class="inputboolean '+context.toLowerCase()+'" name="Y/N" value="1"/>'
                                + '<label>Yes</label>'
                                + '<br/><input type="radio" class="inputboolean '+context.toLowerCase()+'" name="Y/N" value="-1"/>'
                                + '<label>No</label>'
                        + '</div><br><br>'
                        + '<h6><i><b>Question explanation:</b><br> ' + question.description + '</i></h6>' + '<br>'
                    + '</div>'
                    + '<div class="col-sm-3">'
                        + '<div class="row d-flex flex-row-reverse">'
                            + '<button type="button"class="btn btn-block suggweight '+context.toLowerCase()+' m-2 p-3"><i>Suggested Weight:</i> <br> <b>' + suggweightname + '</b></button>'
                        + '</div>'
                        + '<select id="weight" class="btn btn-block weight '+context.toLowerCase()+'" >'
                            + '<option value="0">Zero</option>'
                            + '<option value="1">Very Low</option>'
                            + '<option value="2">Low</option>'
                            + '<option value="3">Medium</option>'
                            + '<option value="4">High</option>'
                            + '<option value="5">Very High</option>'
                            + '<option value="" selected disabled hidden>Choose Your Weight</option>'
                        + '</select>'
                    + '</div>'
                + '</div>'
    } else {

        var elem = "";
        elem += '<div class="row">' +
            '<div class="col-sm-9">'
            + '<h1><b> Question #' + (current_question) + '</b></h1>' + '<br>'
            
            + '<h2>' + question.text + '</h2><br>';

        // display the list of classes
        elem += '<ul>';
        for (var index in question.classes) {
            //console.log(index);
            elem += '<li>' + question.classes[index] + '<input type="text" class="inputbox '+context.toLowerCase()+'" id="input' + index + '" /></li>'
        }
        elem += '</ul><br><br>'+ '<h6><i><b>Question explanation:</b><br> ' + question.description + '</i></h6>' + '<br>';

        elem += '</div>' +
            '<div class="col-sm-3">' +
            '<div class="row d-flex flex-row-reverse">' +
            '<button type="button"class="btn btn-block suggweight '+context.toLowerCase()+' m-2 p-3 "><i>Suggested Weight:</i> <br> <b>' + suggweightname + '</b></button>' +
            '</div>' +
            '<select id="weight" class="btn btn-block weight '+context.toLowerCase()+'" >' +
            '<option value="0">Zero</option>' +
            '<option value="1">Low</option>' +
            '<option value="2">Very Low</option>' +
            '<option value="3">Medium</option>' +
            '<option value="4">High</option>' +
            '<option value="5">Very High</option>' +
            '<option value="" selected disabled hidden>Choose Your Weight</option>' +
            '</select>' +
            '</div>'+
            '</div>'
    }

    //Clear the html
    $("#question").empty();
    //Append the new question
    $("#question").append(elem)

    $("#section").empty();
    //Append the new question
    $("#section").append(sectiondiv)
};

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

    console.log(secData);

    // collect data
    // TODO: non entra qui
    for (var i = 0; i < secData.length; i++) {
        if (secData["question" + i].hasOwnProperty("result") && secData["question" + i].hasOwnProperty("weight")) {
            res = res + parseInt(secData["question" + i]["result"]);
            weights = weights + parseInt(secData["question" + i]["weight"])
        }
        console.log("temporary res: " + res);
        console.log("temporary weights: " + weights);
    }

    // evaluate
    var sec_w = 1;
    if (secData.hasOwnProperty("weight")) {
        sec_w = parseInt(secData["weight"]);
    }

    console.log("result: " + (res/weights));
    return res / weights * sec_w
}

/**
 * Evaluate the overall quality
 * @returns {number} the probability of bias. The lower the better
 */
function calculateFinalResult() {
    var cum_res = 0;
    var cum_weights = 0;

    for (var i = 0; i < sections.length; i++) {
        if (dataStructure["section" + i].hasOwnProperty("result") && dataStructure["section" + i].hasOwnProperty("weight")) {
            cum_res = cum_res + parseInt(dataStructure["section" + i]["result"]);
            cum_weights = cum_weights + parseInt(dataStructure["section" + i]["weights"]);
        } else {
            console.log("Weight not present for the current section");
        }
    }

    return (1 - cum_res / cum_weights)
}

$("nav a").click(function() {
    $("nav a").removeClass("active");
    $(this).addClass("active");
    current_section=this.id;
    current_question=1;
    pickQuestion();
    displayThumbnails();
});

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
    //console.log(weight);

    // if it is the first question of the section
    if (!dataStructure.hasOwnProperty(sectionIndex)) {
        dataStructure[sectionIndex] = {};
    }

    //moved to line 326


    console.log(dataStructure);

    console.log("Missing input: " + missinginput);
    if (weight != null && !missinginput) {
        

          // create the question
        dataStructure[sectionIndex][questionIndex] = {};

        // fill the question
        dataStructure[sectionIndex][questionIndex]["data"] = value;
        dataStructure[sectionIndex][questionIndex]["weight"] = weight;
        if (!question.boolean) {
            dataStructure[sectionIndex][questionIndex]["result"] = evaluateVariable(value) * weight;
        } else {
            dataStructure[sectionIndex][questionIndex]["result"] = value * weight; // TODO: check
        }


        document.getElementById("thumbnail" + current_question).innerHTML = "Q" + current_question + " ~ " + switchcaseOnWeights($("#weight").val());
        loadNextQuestion();
        missinginput = false;
        weight = null;
    }
    else {
        alertMX("KEEP CALM: Missing weight or input class!");
        missinginput = false;
    }

});

function readBooleanInput() {
    var input;
    input = $("input[name='Y/N']:checked").val();

    if (input == undefined)
        missinginput = true;
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
    //console.log(inputs)
    return inputs;
}


function thumbnailChosen(value) {
    current_question = value;
    pickQuestion();
}

function switchcaseOnWeights(value) {
    switch (value * 1) {
        case 0:
            return "Zero";
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

$("#logo").click(function(){
    $("#first-choice").toggleClass("hide");
    $(".leftbox").toggleClass("hide");
    $("#logo").toggleClass("hide");
    $("#question-section").toggleClass("hide");
    $("#intermediate").toggleClass("hide");

})

$("<style type='text/css'>#boxMX{display:none;background: #333;padding: 10px;border: 2px solid #ddd;float: left;font-size: 1.2em;position: fixed;top: 50%; left: 50%;z-index: 99999;box-shadow: 0px 0px 20px #999; -moz-box-shadow: 0px 0px 20px #999; -webkit-box-shadow: 0px 0px 20px #999; border-radius:6px 6px 6px 6px; -moz-border-radius: 6px; -webkit-border-radius: 6px; font:13px Arial, Helvetica, sans-serif; padding:6px 6px 4px;width:300px; color: white;}</style>").appendTo("head");

function alertMX(t){
    $( "body" ).append( $( "<div id='boxMX' align='center'><p class='msgMX'></p><p>Press<br><br><b>OK</b><br><br>to continue.</p></div>" ) );
    $('.msgMX').text(t); var popMargTop = ($('#boxMX').height() + 24) / 2, popMargLeft = ($('#boxMX').width() + 24) / 2; 
    $('#boxMX').css({ 'margin-top' : -popMargTop,'margin-left' : -popMargLeft}).fadeIn(600);
    $("#boxMX").click(function(){
        $(this).remove(); 
    });  
};


