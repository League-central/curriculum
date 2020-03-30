var answer;
var qDiv;

function loadWTOQuestion(div, difficulty){
	document.body.style.backgroundColor = "lightblue";
	switch(difficulty){
		case 0:{
			loadBeginnerWTOQuestion(div);
			break;		
		}
		case 1:{
			loadIntermediateWTOQuestion(div);
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

function loadBeginnerWTOQuestion(div){
	qDiv = div;
	var output;
	var eqTo = (Math.floor(Math.random() * 10) % 2);

	var start = Math.floor(Math.random() * 2);
	var limit = Math.floor(Math.random() * 9) + 1;
	var printType = "println";
	var countUp = true;

	answer = "";
	for(var i = start; i < limit; i++){
		answer += i;
		if(i < limit - 1 || eqTo){
			answer += "\n";
		}
	}

	if(eqTo){
		answer += limit.toString();
	}

	div.innerHTML = "What is the output of the following for-loop?<br><br>";
	div.innerHTML += "for(int i = "+start+"; i "+(eqTo?"&lt=":"&lt")+" "+limit+"; i"+(countUp ? "++":"--")+"){<br>";
	div.innerHTML += "&nbsp&nbspSystem.out.println(i);<br>}<br><br>";
	div.innerHTML += "<textArea id='input' rows='10' cols='40'></textArea>";
	div.innerHTML += "<br><button onclick='checkBeginnerWTOQuestion()' id='chkAnsBut'>CHECK MY ANSWER</button>";	
}

function checkBeginnerWTOQuestion(){
	var correct;

	var ans = getChildById(qDiv, "input");
	var but = getChildById(qDiv, "chkAnsBut");

	if(answer.trim() === ans.value.trim()){
		document.body.style.backgroundColor = "lightgreen";
		correct = true;
	}else{
		document.body.style.backgroundColor = "pink";
		correct = false;
	}

	qDiv.removeChild(but);
	qDiv.removeChild(ans);
	qDiv.innerHTML += "<br>Your Answer: <pre>" + ans.value + "</pre>";
	qDiv.innerHTML += "<br>Correct Answer: <pre>" + answer + "</pre>";
	qDiv.innerHTML += "<br><br><button onclick='scoreQuestion("+correct+")'>CONTINUE</button>";
}

function loadIntermediateWTOQuestion(div){
	qDiv = div;
	var output;
	var eqTo = (Math.floor(Math.random() * 10) % 2);

	var start = Math.floor(Math.random() * 19) - 10;
	var limit = start;

	while(limit == start){
		limit = Math.floor(Math.random() * 19) - 10;
	}
	
	var println = (Math.floor(Math.random() * 10) % 2);
	var countUp = (start > limit) ? false : true;

	answer = "";
	if(countUp){
		for(var i = start; i < limit; i++){
			answer += i;
			if(println){
				answer += "\n";
			}
		}
		if(eqTo){
			answer += limit.toString();
		}
	}else{
		for(var i = start; i > limit; i--){
			answer += i;
			if(println){
				answer += "\n";
			}
		}
		if(eqTo){
			answer += limit.toString();
		}
	}

	div.innerHTML = "What is the output of the following for-loop?<br><br>";
	div.innerHTML += "for(int i = "+start+"; i "+(countUp?"&lt":">")+(eqTo?"=":"")+" "+limit+"; i"+(countUp ? "++":"--")+"){<br>";
	div.innerHTML += "&nbsp&nbspSystem.out.print"+(println?"ln":"")+"(i);<br>}<br><br>";
	div.innerHTML += "<textArea id='input' rows='10' cols='40'></textArea>";
	div.innerHTML += "<br><button onclick='checkIntermediateWTOQuestion()' id='chkAnsBut'>CHECK MY ANSWER</button>";
}

function checkIntermediateWTOQuestion(){
	var correct;

	var ans = getChildById(qDiv, "input");
	var but = getChildById(qDiv, "chkAnsBut");

	if(answer.trim() === ans.value.trim()){
		document.body.style.backgroundColor = "lightgreen";
		correct = true;
	}else{
		document.body.style.backgroundColor = "pink";
		correct = false;
	}

	qDiv.removeChild(but);
	qDiv.removeChild(ans);
	qDiv.innerHTML += "<br>Your Answer: <pre>" + ans.value + "</pre>";
	qDiv.innerHTML += "<br>Correct Answer: <pre>" + answer + "</pre>";
	qDiv.innerHTML += "<br><br><button onclick='scoreQuestion("+correct+")'>CONTINUE</button>";
}