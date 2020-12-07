const QUESTION_TYPES = [
    "RETURN_TYPE", "METHOD_NAME", "HOW_MANY_PARAMETERS"
];

const DATA_TYPES = [
    "void", "boolean", "int", "long", "byte", "char", "float", "short", "double", "Object", "String", "Robot", "Random"
];

const ACCESS_MODIFIERS = [
    "", "public", "private", "protected"
];

var canvas;
var g;
var questionDiv;

var currentQuestionType;
var currentReturnType;
var currentMethodName;
var currentParamCount;
var inputBox;
var inputButton;
var winningStreak = 0;
var questionDivWidth = 700;
var animationInterval;
var climberX;
var climberStartY;
var climberMoveDistance;
var climberTargetY;
var climberCurrentY;
var climberRotateAmt = 0;
var climberWidth;
var climberHeight;

var mountainImage;
var climberImage;

window.onload = function(){
    window.addEventListener("keydown", function(event){
        if(event.keyCode == 13){
            txt = document.getElementById("buttonID").innerHTML;
            if(txt == "Click Here to Continue"){
                loadNewQuestion()
            }else{
                checkAnswer();
            }
        }
    });

    window.addEventListener("resize", resizeWindow);

    mountainImage = document.getElementById("mountainImgID");
    climberImage = document.getElementById("climberImgID");

    canvas = document.getElementById("canvasID");
    questionDiv = document.getElementById("questionDivID");
    g = canvas.getContext('2d');

    document.body.style.fontFamily = "Georgia, serif";
    document.body.style.fontSize = "x-large";

    inputBox = document.createElement("input");
    inputBox.id = "inputID";

    inputButton = document.createElement("button");
    inputButton.id = "buttonID";
    inputButton.innerHTML = "Click Here to Check Your Answer"
    inputButton.onclick = checkAnswer;

    resizeWindow();

    loadNewQuestion();

    climberRotateAmt = 0;
    climberCurrentY = climberStartY;

    g.drawImage(mountainImage, 0, 0, canvas.width, canvas.height);
    g.drawImage(climberImage, climberX, climberCurrentY, climberWidth, climberHeight);
}

function generateRandomMethodString(){
    currentReturnType = getRandomEntryFromArray(DATA_TYPES);
    currentMethodName = getRandomEntryFromArray(METHOD_NAMES);
    currentParamCount = Math.floor(Math.random() * 6);
    
    let params = "";
    for(let i = 0; i < currentParamCount; i++){
        params += getRandomEntryFromArray(DATA_TYPES) + " " + getRandomEntryFromArray(PARAM_NAMES);
        if(i < currentParamCount - 1){
            params += ", ";
        }
    }

    let accMod = getRandomEntryFromArray(ACCESS_MODIFIERS);

    let ms = accMod + " " + currentReturnType + " " + currentMethodName + "(" + params + "){<br>";
    ms += "&nbsp&nbsp&nbsp&nbsp//pretend that all the necessarry code is here<br>}";
    return ms;
}

function checkAnswer(){
    inpt = document.getElementById("inputID");
    inpt.style.display = "none";    

    let ans = inpt.value;
    let correctAnswer;
    switch(currentQuestionType){
        case "RETURN_TYPE":{
            correctAnswer = currentReturnType;
            break;
        }
        case "METHOD_NAME":{
            correctAnswer = currentMethodName;
            break;
        }
        case "HOW_MANY_PARAMETERS":{
            correctAnswer = currentParamCount;
            break;
        }
    }

    if(ans.trim() == correctAnswer){
        document.body.style.backgroundColor = "#a0ffa0";
        winningStreak += 1;
        climberTargetY = climberCurrentY - climberMoveDistance;
        animationInterval = setInterval(animateClimberUpward, 1000/60);

    }else{
        document.body.style.backgroundColor = "#ffa0a0";
        winningStreak = 0;
        climberTargetY = climberStartY;
        animationInterval = setInterval(animateClimberDownward, 1000/60);
    }

    questionDiv.innerHTML += "<br><br><br>";
    questionDiv.innerHTML += "Your Answer:<br>";
    questionDiv.innerHTML += ans + "<br><br>";
    questionDiv.innerHTML += "Correct Answer:<br>";
    questionDiv.innerHTML += correctAnswer + "<br>";

    inptBt = document.getElementById("buttonID");
    inptBt.innerHTML = "Click Here to Continue";
    inptBt.onclick = loadNewQuestion;
}

function getRandomEntryFromArray(arr){
    let i = Math.floor(Math.random() * arr.length);
    return arr[i];
}

function loadNewQuestion(){
    inputBox.style.display = "block";

    document.body.style.backgroundColor = "#a0a0ff";
    currentQuestionType = getRandomEntryFromArray(QUESTION_TYPES);
    let qText = "";
    switch(currentQuestionType){
        case "RETURN_TYPE":{
            qText += "What is the return type of the following method?";
            break;
        }
        case "METHOD_NAME":{
            qText += "What is the name of the following method?";
            break;
        }
        case "HOW_MANY_PARAMETERS":{
            qText += "How many parameters does the following method have?<br>"
            qText += "(answer in numerical form: 1, 2, 3, etc...)";
            break;
        }
    }
    qText += "<br><br><br>" + generateRandomMethodString();

    questionDiv.innerHTML = qText;
    questionDiv.innerHTML += "<br><br><br>"
    questionDiv.appendChild(inputBox);
    questionDiv.innerHTML += "<br><br><br>"
    questionDiv.appendChild(inputButton);
}

function resizeWindow(event){
    questionDiv.style.position = "absolute";
    questionDiv.style.border = "solid";
    questionDiv.style.left = 0;
    questionDiv.style.top = 0;
    questionDiv.style.width = questionDivWidth;
    questionDiv.style.height = window.innerHeight * 0.95;

    canvas.style.position = "absolute";
    canvas.style.border = "solid";
    canvas.style.left = questionDivWidth + 10;
    canvas.style.top = 0;
    canvas.style.width = window.innerWidth - questionDivWidth - 20;
    canvas.style.height = window.innerHeight * 0.95;

    climberX = canvas.width * 0.5;
    climberStartY = canvas.height - 10;
    climberMoveDistance = canvas.height * 0.1;
    climberWidth = canvas.width * 0.1;
    climberHeight = canvas.height * 0.1;
}

function animateClimberUpward(){
    if(climberCurrentY - climberTargetY > 0.1){
        climberCurrentY -= 0.5;
    }else{
        clearInterval(animationInterval);
        if(winningStreak >= 10){
            alert("Congratulations! You've mounted the mountain of methods!!!")
        }
    }
    g.drawImage(mountainImage, 0, 0, canvas.width, canvas.height);
    g.drawImage(climberImage, climberX, climberCurrentY, climberWidth, climberHeight);
}

function animateClimberDownward(){
    if(climberCurrentY - climberTargetY < 0.1){
        climberCurrentY += 0.5;
    }else{
        clearInterval(animationInterval);
        climberRotateAmt = 0;
    }

    g.drawImage(mountainImage, 0, 0, canvas.width, canvas.height);

    g.save();
    g.translate(climberX + climberWidth/2, climberCurrentY + climberHeight/2);
    g.rotate(climberRotateAmt);
    g.translate(-climberX - climberWidth/2, -climberCurrentY - climberHeight/2);
    g.drawImage(climberImage, climberX, climberCurrentY, climberWidth, climberHeight);
    g.restore();

    climberRotateAmt += 0.1;
}
    