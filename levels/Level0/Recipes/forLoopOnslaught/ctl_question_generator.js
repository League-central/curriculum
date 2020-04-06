var answer;
var answer2;
var qDiv;

function loadCTLQuestion(div, difficulty){
	document.body.style.backgroundColor = "white";
	switch(difficulty){
		case 0:{
			loadBeginnerCTLQuestion(div);
			break;		
		}
		case 1:{
			loadIntermediateCTLQuestion(div);
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

function loadBeginnerCTLQuestion(div){
	qDiv = div;
	var eqTo = (Math.floor(Math.random() * 10) % 2);
	var start = Math.floor(Math.random() * 2);
	var limit = Math.floor(Math.random() * 9) + 1;
	var countUp = true;
	answer = limit;
		
	div.innerHTML = "Complete the for loop to produce the following output:<br>";
	if(countUp){
		for(var i = start; i < limit; i++){
			div.innerHTML += "" + i + "<br>";
		}
		if(eqTo){
			div.innerHTML += "" + limit;
		}
	}else{
		for(var i = limit; i > start; i--){
			div.innerHTML += "" + i + "<br>";
		}
		if(eqTo){
			div.innerHTML += "" + start;
		}
	}
	div.innerHTML += "<br><br>for(int i = "+start+"; i "+(eqTo?"&lt=":"&lt")+" <input type='text' size='3' id='input'></input>; i"+(countUp ? "++":"--")+"){<br>&nbsp&nbsp";
	div.innerHTML += "System.out.println(i);<br>}";

	div.innerHTML += "<br><button onclick='checkBeginnerCTLQuestion()' id='chkAnsBut'>CHECK MY ANSWER</button>";	
}

function checkBeginnerCTLQuestion(){
	var correct;

	var ans = getChildById(qDiv, "input");
	var but = getChildById(qDiv, "chkAnsBut");

	if(answer == ans.value){
		document.body.style.backgroundColor = "lightgreen";
		correct = true;
	}else{
		document.body.style.backgroundColor = "pink";
		correct = false;
	}

	qDiv.removeChild(but);
	qDiv.innerHTML += "<br>Your Answer: " + ans.value;
	qDiv.innerHTML += "<br>Correct Answer: " + answer;
	qDiv.innerHTML += "<br><br><button onclick='scoreQuestion("+correct+")'>CONTINUE</button>"; 
}

function loadIntermediateCTLQuestion(div){
	qDiv = div;
	var eqTo = (Math.floor(Math.random() * 10) % 2);
	var start = Math.floor(Math.random() * 199) - 100;
	var limit = start;
	while (limit == start){
		limit = Math.floor(Math.random() * 199) - 100;
	}
	var countUp = start > limit ? false : true;
	
	var logStr = countUp ? "<" : ">";
	logStr += eqTo ? "=" : "";

	answer = start;
	answer2 = limit;
		
	div.innerHTML = "Complete the for loop to produce the following output:<br>";
	if(countUp){
		for(var i = start; i < limit; i++){
			div.innerHTML += "" + i + "<br>";
		}
		if(eqTo){
			div.innerHTML += "" + limit;
		}
	}else{
		for(var i = start; i > limit; i--){
			div.innerHTML += "" + i + "<br>";
		}
		if(eqTo){
			div.innerHTML += "" + limit;
		}
	}
	div.innerHTML += "<br><br>for(int i = <input type='text' size='3' id='input'></input>; i "+logStr+" <input type='text' size='3' id='input2'></input>; i"+(countUp ? "++":"--")+"){<br>&nbsp&nbsp";
	div.innerHTML += "System.out.println(i);<br>}";

	div.innerHTML += "<br><button onclick='checkIntermediateCTLQuestion()' id='chkAnsBut'>CHECK MY ANSWER</button>";
}

function checkIntermediateCTLQuestion(){
	var correct;

	var ans = getChildById(qDiv, "input");
	var ans2 = getChildById(qDiv, "input2");
	var but = getChildById(qDiv, "chkAnsBut");

	if(answer == ans.value && answer2 == ans2.value){
		document.body.style.backgroundColor = "lightgreen";
		correct = true;
	}else{
		document.body.style.backgroundColor = "pink";
		correct = false;
	}

	qDiv.removeChild(but);
	qDiv.innerHTML += "<br>Your Answer: " + ans.value + ", " + ans2.value;
	qDiv.innerHTML += "<br>Correct Answer: " + answer + ", " + answer2;
	qDiv.innerHTML += "<br><br><button onclick='scoreQuestion("+correct+")'>CONTINUE</button>"; 
}