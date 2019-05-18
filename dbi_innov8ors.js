//Dictionary containing all sections
var sections;

var current_section = 0;
var current_question = 0;

var question;

//Parse the JSON with the questions when the page is loaded
$(document).ready(function () {
<<<<<<< HEAD

    $.getJSON("./data/questions.json", function(json) {
        console.log(json); // show the JSON file content into console
        sections = json
    });
    
    pickQuestion();
=======
    var json = "{ \"section1\": { \"question1\": { \"text\": \"Is there an Ethics Commitee that approved your AI project?\", \"description\": \"d1\", \"boolean\": true }, \"question2\": { \"text\": \"Does your AI project promote well-being, preserve dignity, or sustain the planet?\", \"description\": \"d1\", \"boolean\": true }, \"question3\": { \"text\": \"Does your AI project preserve the personal privacy and the security of the data?\", \"description\": \"d1\", \"boolean\": true }, \"question4\": { \"text\": \"Does your AI project still give the individuals the right to make decisions for themselves ?\", \"description\": \"d1\", \"boolean\": true }, \"question5\": { \"text\": \"Does your AI project promote justice and seek to eliminate discriminations?\", \"description\": \"d1\", \"boolean\": true }, \"question6\": { \"text\": \"Have you already faced the problem of Bias in similar AI projects?\", \"description\": \"d1\", \"boolean\": true } }, \"section2\": { \"question1\": { \"text\": \"Hetereogenity of gender \", \"description\": \"d1\", \"boolean\": false, \"classes\": [ \"Number of males\", \"Number of females\" ] }, \"question2\": { \"text\": \"Hetereogenity of area of origin (on the basis of the scope: international)\", \"description\": \"d1\", \"boolean\": false, \"classes\": [ \"Europe\", \"America\", \"Asia\", \"Australia\", \"Africa\" ] }, \"question3\": { \"text\": \"Hetereogenity of age\", \"description\": \"d1\", \"boolean\": false, \"classes\": [ \"Age < 30\", \"30 <= Age < 40\", \"Age >= 40\" ] }, \"question4\": { \"text\": \"Hetereogenity of years of experience\", \"description\": \"d1\", \"boolean\": false, \"classes\": [ \"Years < 2\", \"2 <= Years < 10\", \"Years >= 10\" ] }, \"question5\": { \"text\": \"Heterogeneity of background education\", \"description\": \"d1\", \"boolean\": true, \"classes\": [ \"Informaticians\", \"Mathematicians\", \"Context experts\" ] }, \"question6\": { \"text\": \"Heterogeneity of study title\", \"description\": \"d1\", \"boolean\": true, \"classes\": [ \"Bachelor\", \"Master\", \"PhD\" ] }, \"question7\": { \"text\": \"Is it a democratic and cooperative team, in which everyone's opinion is considered?\", \"description\": \"d1\", \"boolean\": true }, \"question8\": { \"text\": \"Are the team's responsibilities appropriately distributed among the members?\", \"description\": \"d1\", \"boolean\": true }, \"question9\": { \"text\": \"Have the team members already collaborated in the past?\", \"description\": \"d1\", \"boolean\": true, \"reverse\": true } }, \"section3\": { \"question1\": { \"text\": \"Hetereogenity of gender \", \"description\": \"d1\", \"boolean\": false, \"classes\": [ \"Number of males\", \"Number of females\" ] }, \"question2\": { \"text\": \"Hetereogenity of area of origin (on the basis of the scope: international)\", \"description\": \"d1\", \"boolean\": false, \"classes\": [ \"Europe\", \"America\", \"Asia\", \"Australia\", \"Africa\" ] }, \"question3\": { \"text\": \"Hetereogenity of height\", \"description\": \"d1\", \"boolean\": false, \"classes\": [ \"Height <= 165\", \"165cm < Height <= 175\", \"175cm < Height <= 185\", \"Height > 185\" ] }, \"question4\": { \"text\": \"Hetereogenity of weight\", \"description\": \"d1\", \"boolean\": false, \"classes\": [ \"Weight <= 50kg\", \"50kg < Weight <= 65kg\", \"65kg < Weight <= 80kg\", \"80kg < Weight <= 95kg\", \"Weight > 90kg\" ] }, \"question5\": { \"text\": \"Hetereogenity of age\", \"description\": \"d1\", \"boolean\": false, \"classes\": [ \"Age <= 30\", \"30 < Age < 60\", \"Age >= 60\" ] }, \"question6\": { \"text\": \"Hetereogenity of hair color\", \"description\": \"d1\", \"boolean\": false, \"classes\": [ \"Dark (Black, Brown\", \"Blonde\", \"Red\", \"Other\" ] }, \"question7\": { \"text\": \"Have you considered the several input categories available in your context (including minorities etc)?\", \"description\": \"d1\", \"boolean\": true }, \"question8\": { \"text\": \"Have you considered the several features of each input category?\", \"description\": \"d1\", \"boolean\": true } }, \"section4\": { \"question1\": { \"text\": \"The collected data come from a relative recent period of time (max: 10 years)?\", \"description\": \"d1\", \"boolean\": true }, \"question2\": { \"text\": \"Do you have different sources of data collection?\", \"description\": \"d1\", \"boolean\": true }, \"question3\": { \"text\": \"Are your sources reliable?\", \"description\": \"d1\", \"boolean\": true }, \"question4\": { \"text\": \"Have you used questionnaires that could be affected by Bias to collect data?\", \"description\": \"d1\", \"boolean\": true, \"reverse\": true }, \"question5\": { \"text\": \"Do you have a data cleaning phase in your data gathering process?\", \"description\": \"d1\", \"boolean\": true }, \"question6\": { \"text\": \"Do you use analytic tools to evaluate the quality of your data?\", \"description\": \"d1\", \"boolean\": true }, \"question7\": { \"text\": \"In case of observations that need a tag, were they already tagged at collection time?\", \"description\": \"d1\", \"boolean\": true }, \"question8\": { \"text\": \"In case they were not, is the team responsible for tagging the observations well balanced?\", \"description\": \"d1\", \"boolean\": true } }, \"section5\": { \"question1\": { \"text\": \"Is the Dataset size significative with respect to the population of study size? \", \"description\": \"d1\", \"boolean\": true }, \"question2\": { \"text\": \"Is the Dataset size significative with respect to its context?\", \"description\": \"d1\", \"boolean\": true } }, \"section6\": { \"question1\": { \"text\": \"Is the data gathering phase transparent?\", \"description\": \"d1\", \"boolean\": true }, \"question2\": { \"text\": \"Is the algorithmic phase transparent?\", \"description\": \"d1\", \"boolean\": true }, \"question3\": { \"text\": \"Are you sure on the weights assigned to the features?\", \"description\": \"d1\", \"boolean\": true }, \"question4\": { \"text\": \"Are you sure that the code is not embedded with biased considerations of the scientists?\", \"description\": \"d1\", \"boolean\": true, \"reverse\": true }, \"question5\": { \"text\": \"Is the alghoritm considering just reliable/significative features?\", \"description\": \"d1\", \"boolean\": true }, \"question6\": { \"text\": \"Is the output represented through an appropriate level of detail?\", \"description\": \"d1\", \"boolean\": true }, \"question7\": { \"text\": \"Do you think your developing team will be able to interpret the output and detect any presence of bias?\", \"description\": \"d1\", \"boolean\": true }, \"question8\": { \"text\": \"Do you think is it easy to trace the error/bias evaluating the output?\", \"description\": \"d1\", \"boolean\": true } } }"
    
    question = sections["section" + current_section]["question" + current_question]
>>>>>>> Fix

    $(".btn-first-choice").click(function () {
        $("#first-choice").toggleClass("hide");
        $("#question-section").toggleClass("hide");
        $("#question-section").toggleClass("scene_element scene_element--fadeinup");
        $("#question-section-body").toggleClass("hide");
        $("#question-section-body").toggleClass("scene_element scene_element--fadeinup");
    });

    $(".dropdown-menu .dropdown-item").click(function () {
        $(".btn.dropdown-toggle:first-child").text($(this).text());
        $(".btn.dropdown-toggle:first-child").val($(this).text());
    });

    $(".form-check-input").click(function () {
        console.log($(this).closest('label').text())
    });
<<<<<<< HEAD

    loadQuestion();

=======
    loadQuestion();
>>>>>>> Fix
});

var pickQuestion = function () {
    //Pick the current question
    question = sections["section" + current_section]["question" + current_question]
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