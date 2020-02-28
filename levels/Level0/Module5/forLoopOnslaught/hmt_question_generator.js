var answer;
var qDiv;

function loadHMTQuestion(div, difficulty){
	document.body.style.backgroundColor = "white";
	switch(difficulty){
		case 0:{
			loadBeginnerHMTQuestion(div);
			break;		
		}
		case 1:{
			loadIntermediateHMTQuestion(div);
			break;		
		}
		case 2:{
			break;		
		}
		case 3:{
			break;		
		}
	}
}

function loadBeginnerHMTQuestion(div){
	qDiv = div;
	var eqTo = (Math.floor(Math.random() * 10) % 2 == 0);

	var start = Math.floor(Math.random() * 2);
	var limit = Math.floor(Math.random() * 99) + 1;
	answer = eqTo ? ((limit - start) + 1) : (limit - start);
	var countUp = true;
	
	div.innerHTML = "How many times will the following for-loop execute its code?<br><br>";
	div.innerHTML += "for(int i = "+start+"; i "+(eqTo?"&lt=":"&lt")+" "+limit+"; i"+(countUp ? "++":"--")+"){<br>&nbsp&nbsp&nbsp//code<br>}<br>";
	div.innerHTML += "<input type='text' id='input'></input>";
	div.innerHTML += "<br><button onclick='checkBeginnerHMTQuestion()' id='chkAnsBut'>CHECK MY ANSWER</button>";
}

function checkBeginnerHMTQuestion(){
	var correct;

	var ans = getChildById(qDiv, "input");
	var but = getChildById(qDiv, "chkAnsBut");
	if(answer == parseInt(ans.value)){
		document.body.style.backgroundColor = "lightgreen";
		correct = true;
	}else{
		document.body.style.backgroundColor = "pink";
		correct = false;
	}

	qDiv.removeChild(but);
	qDiv.removeChild(ans);
	qDiv.innerHTML += "<br>Your Answer: " + ans.value;
	qDiv.innerHTML += "<br>Correct Answer: " + answer;
	qDiv.innerHTML += "<br><br><button onclick='scoreQuestion("+correct+")'>CONTINUE</button>";
}

function loadIntermediateHMTQuestion(div){
	qDiv = div;
	
	var logicOper = Math.floor(Math.random() * 6);
	var start = Math.floor(Math.random() * 99) - 50;
	var limit = Math.floor(Math.random() * 99) - 50;
	var countUp = (Math.floor(Math.random() * 10) % 2 == 0);
	var logStr;

	switch(logicOper){
		case 0:{
			logStr = "&lt";
			if(start >= limit){
				answer = 0;
			}else if(countUp){
				answer = limit - start;
			}else{
				answer = "";
			}
			break;
		}		
		case 1:{
			logStr = "&lt=";
			if(start > limit){
				answer = 0;
			}else if(countUp){
				answer = (limit - start) + 1;
			}else{
				answer = "";
			}
			break;
		}
		case 2:{
			logStr = "==";
			if(start == limit){
				answer = 1;
			}else{
				answer = 0;
			}
			break;
		}
		case 3:{
			logStr = ">=";
			if(start < limit){
				answer = 0;
			}else if(!countUp){
				answer = (start - limit) + 1;
			}else{
				answer = "";
			}
			break;
		}
		case 4:{
			logStr = ">";
			if(start <= limit){
				answer = 0;
			}else if(!countUp){
				answer = (start - limit);
			}else{
				answer = "";
			}
			break;
		}
		case 5:{
			logStr = "!=";
			if(start == limit){
				answer = 0;
			}else if(start > limit && !countUp){
				answer = start - limit;
			}else if(start < limit && countUp){
				answer = limit - start;
			}else{
				answer = "";
			}
			break;
		}
	}
	
	div.innerHTML = "How many times will the following for-loop execute its code?";
	div.innerHTML += "<br>Leave the box blank if it is an infinite loop.<br><br>";
	div.innerHTML += "for(int i = "+start+"; i "+logStr+" "+limit+"; i"+(countUp ? "++":"--")+"){<br>&nbsp&nbsp&nbsp//code<br>}<br>";
	div.innerHTML += "<input type='text' id='input'></input>";
	div.innerHTML += "<br><button onclick='checkIntermediateHMTQuestion()' id='chkAnsBut'>CHECK MY ANSWER</button>";
}

function checkIntermediateHMTQuestion(){
	var correct;

	var ans = getChildById(qDiv, "input");
	var but = getChildById(qDiv, "chkAnsBut");	

	if(answer === "" && ans.value === ""){
		document.body.style.backgroundColor = "lightgreen";
		correct = true;
	}	
	else if(parseInt(answer) == parseInt(ans.value)){
		document.body.style.backgroundColor = "lightgreen";
		correct = true;
	}else{
		document.body.style.backgroundColor = "pink";
		correct = false;
	}

	qDiv.removeChild(but);
	qDiv.removeChild(ans);
	qDiv.innerHTML += "<br>Your Answer: " + ans.value;
	qDiv.innerHTML += "<br>Correct Answer: " + answer;
	qDiv.innerHTML += "<br><br><button onclick='scoreQuestion("+correct+")'>CONTINUE</button>";
}
