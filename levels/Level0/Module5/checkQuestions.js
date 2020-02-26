
function submitClick(){
  var ans = [
	"Tacos",
	"Cat in the Hat",
	"Frankenstein Frankenstein",
	"book",
	"5",
	"3",
	"FOUR",
	"CLICK\nCLICK",
	"1\n4",
	"0\n1\n2",
	"XY",
	"CAB",
	"ACB",
	"01234",
	"5\n4\n3\n2\n1\n0",
	"horse\nhorse\nhorse\nhorse\nhorse\nhorse",
	"5\n4\n3\n2\n1\n0\ndynomite",
	"0, 2, 4, 6, 8, 10, 12, 14, 16, 18,",
	"count5 count4 count3 count2 count1 count0",
	"0, 7, 14, 21,"
];
	
var usrAns = [];
  
	for(var i = 0; i < 20; i++){
		usrAns[i] = document.getElementById("answer" + (i + 1));
		if(usrAns[i].value.trim() == ans[i]){
      usrAns[i].style.backgroundColor="lightgreen";
    }else{
      usrAns[i].style.backgroundColor="pink";
    }
	}
}
