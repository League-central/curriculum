var questionDiv;	
var buttonDiv;
var resultsDiv;
var input;

var hmtEnabled = true;
var wtoEnabled = true;
var ctlEnabled = true;
var enduranceModeEnabled = true;

var difficulty;

var totalQuestions = -1;

var currentQuestion;
var correctQuestions;

var enabledQuestionTypes = [];

const WTO_Q = 0;
const HMT_Q = 1;
const CTL_Q = 2;

const endMdInfoText = "\tWhen checked, you must get this number correct in a row (consecutively) to complete the exercise.";

window.onload = function(){
	questionDiv = document.getElementById("questionDiv");
	buttonDiv = document.getElementById("buttonDiv");
	resultsDiv = document.getElementById("resultsDiv");
	loadStartScreen();	
    copyright();
};

function loadStartScreen(){
	document.body.style.backgroundColor = "white";
	input = document.createElement("input");
	input.type = "text";
	input.id = "input";
	questionDiv.innerHTML = "<br>Enter how many questions you want. (1 - 999)<br><br>"
	questionDiv.appendChild(input);
	questionDiv.innerHTML += "&nbsp;&nbsp;&nbsp;<label id='enduranceMode'><input type='checkbox' id='endMdCB' checked></input> endurance mode<span id=endMdSpan>"+endMdInfoText+"</span></label><br>";
	questionDiv.innerHTML += "<br><button style='background-color:lightgreen' onclick='initializeActivity("+0+");'>BEGINNER</button><br>";
	questionDiv.innerHTML += "<button style='background-color:yellow' onclick='initializeActivity("+1+");' >INTERMEDIATE</button><br>";
	questionDiv.innerHTML += "<button style='background-color:pink' onclick='initializeActivity("+2+");' disabled>ADVANCED</button><br>";
	questionDiv.innerHTML += "<button style='background-color:lightblue' onclick='initializeActivity("+3+");' disabled>EXPERT</button><br><br>";
	questionDiv.innerHTML += "<label><input type='checkbox' id='hmtCB' checked></input>include \"how many times\" questions</label><br>";
	questionDiv.innerHTML += "<label><input type='checkbox' id='wtoCB' checked></input>include \"what's the output\" questions</label><br>"
	questionDiv.innerHTML += "<label><input type='checkbox' id='ctlCB' checked></input>include \"complete the loop\" questions</label><br>";

}

function loadQuestion(){
	var rand = Math.floor(Math.random() * enabledQuestionTypes.length);
	switch(enabledQuestionTypes[rand]){
		case WTO_Q: loadWTOQuestion(questionDiv, difficulty); break;
		case CTL_Q: loadCTLQuestion(questionDiv, difficulty); break;
		case HMT_Q: loadHMTQuestion(questionDiv, difficulty); break;
	}
	currentQuestion++;
}

function scoreActivity(){
	if(enduranceModeEnabled){
		questionDiv.innerHTML = "You got " + correctQuestions + " in a row!";
	}else{
		questionDiv.innerHTML = "You got " + correctQuestions + " out of " + totalQuestions + " correct.";
	}

	questionDiv.innerHTML += "<br><button onclick='location.reload()'>RESTART?</button>";
}

function scoreQuestion(correct){
	if(correct && enduranceModeEnabled){
		correctQuestions++;
		if(correctQuestions == totalQuestions){
			scoreActivity();
			return;
		}
	}else if(correct){
		correctQuestions++;
	}else if(enduranceModeEnabled){
		correctQuestions = 0;
		loadQuestion();
		return;
	}

	if(currentQuestion == totalQuestions){
		scoreActivity();
		return;
	}else{
		loadQuestion();
	}
}

function initializeActivity(dif){
	difficulty = dif;
	var n;
	var v = questionDiv.getElementsByTagName("input");
	for(var i = 0; i < v.length; i++){
		if(v[i].id == "input"){
			n = v[i].value;
		}else if(v[i].id == "endMdCB"){
			if(!v[i].checked){
				enduranceModeEnabled = false;
			}
		}else if(v[i].id == "hmtCB"){
			if(!v[i].checked){
				hmtEnabled = false;
			}else{
				enabledQuestionTypes.push(HMT_Q);
			}
		}else if(v[i].id == "wtoCB"){
			if(!v[i].checked){
				wtoEnabled = false;
			}else{
				enabledQuestionTypes.push(WTO_Q);
			}
		}else if(v[i].id == "ctlCB"){
			if(!v[i].checked){
				ctlEnabled = false;
			}else{
				enabledQuestionTypes.push(CTL_Q);
			}
		}
	}

	if(n <= 0 || n > 999){
		alert("Invalid input. Enter a number between 1 - 999.")
		return;
	}else{
		totalQuestions = n;
		currentQuestion = 0;
		correctQuestions = 0;
	}

	loadQuestion();	
}