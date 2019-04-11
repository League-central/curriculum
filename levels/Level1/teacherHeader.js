function teacherHeader() {
var links;

links = document.getElementById("teacherLinks");

links.innerHTML += "<span>";
links.innerHTML += "<a href=\"http://www.jointheleague.org\"><img class=\"footer\" src=\"https://league-level0.github.io/league.jpg\" alt=\"league-logo\"></a>";
links.innerHTML += "</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>";
links.innerHTML += "<a href=\"http://jointheleague.github.io\"><img class=\"footer\" src=\"https://league-level0.github.io/teacher.png\" alt=\"Teacher Resources\"</a>";
links.innerHTML += "</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>";
links.innerHTML += "<a href=\"https://jtl.pike13.com\"><img class=\"footer\" src=\"https://league-level0.github.io/pike13.png\" alt=\"Legaue Hub\"></a>";
links.innerHTML += "<a href=\"mailto:curriculum@jointheleague.org\"><img class=\"footer\" src=\"https://league-level0.github.io/suggestions.jpg\" alt=\"Recipe Suggestions\"</a>";  
links.innerHTML += "</span>";
}
