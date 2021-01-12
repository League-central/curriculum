function addHeader() {
    var links;

    links = document.getElementById("header");

    links.innerHTML += "<span>";
    links.innerHTML += "<a href=\"http://www.jointheleague.org\"><img class=\"footer\" src=\"https://league-level0.github.io/img/league.jpg\" alt=\"league-logo\"></a>";
    links.innerHTML += "</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>";
    links.innerHTML += "<a href=\"http://jointheleague.github.io\"><img class=\"footer\" src=\"https://league-level0.github.io/img/teacher.png\" alt=\"Teacher Resources\"</a>";
    links.innerHTML += "</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>";
    links.innerHTML += "<a href=\"https://jtl.pike13.com\"><img class=\"footer\" src=\"https://league-level0.github.io/img/pike13.png\" alt=\"Legaue Hub\"></a>";
    links.innerHTML += "<a href=\"mailto:curriculum@jointheleague.org\"><img class=\"footer\" src=\"https://league-level0.github.io/img/suggestions.jpg\" alt=\"Recipe Suggestions\"</a>";  
    links.innerHTML += "</span>";
}

function addFooter() {

    var footer = document.getElementById("footer");

    footer.innerHTML += "<a href=\"http://www.jointheleague.org\"><img class=\"footer\" src=\"https://league-level0.github.io/img/league.jpg\" alt=\"league-logo\" align=\"center\"></a>";

    footer.innerHTML += "<span style=\"position:absolute;bottom:20px;font-weight: bold;\">Copyright <a href=\"http://www.jointheleague.org\">The League of Amazing Programmers</a> 2013-2018</span>";

    //footer.innerHTML += "References:";

    //footer.innerHTML += "<a href=\"https://docs.oracle.com/javase/8/docs/api/\"><img class=\"footer\" src=\"https://league-level0.github.io/java.png\" alt=\"Java API\"  align=\"center\"</a>";

    //footer.innerHTML += "<a href=\"https://processing.org/reference\"><img class=\"footer\" src=\"https://league-level0.github.io/p3logo.jpeg\" alt=\"Processing Reference\"  align=\"center\"></a>";

}

function addRecipeHeader(){
    
        
    var links;

    links = document.getElementById("header");
    
    links.innerHTML += "<span>";
     links.innerHTML += "<a style='font-size:3em;color: #fa591a;text-decoration: none;cursor: pointer;padding:.5em;' onclick=' window.history.back();'>&#171;</a>"
    
}

function addRecipeFooter(){
    var footer = document.getElementById("footer");

    footer.innerHTML += "<a href=\"http://www.jointheleague.org\"><img class=\"footer\" src=\"https://league-level0.github.io/img/league.jpg\" alt=\"league-logo\" align=\"center\"></a>";

    footer.innerHTML += "<span style=\"position:absolute;bottom:20px;font-weight: bold;\">Copyright <a href=\"http://www.jointheleague.org\">The League of Amazing Programmers</a> 2013-2018</span>";

    //footer.innerHTML += "References:";

    //footer.innerHTML += "<a href=\"https://docs.oracle.com/javase/8/docs/api/\"><img class=\"footer\" src=\"https://league-level0.github.io/java.png\" alt=\"Java API\"  align=\"center\"</a>";

    //footer.innerHTML += "<a href=\"https://processing.org/reference\"><img class=\"footer\" src=\"https://league-level0.github.io/p3logo.jpeg\" alt=\"Processing Reference\"  align=\"center\"></a>";
}

function copyDivToClipboard() {
            var range = document.getSelection().getRangeAt(0);
            range.selectNode(document.getElementByClassName("code")[0]);
            window.getSelection().addRange(range);
            document.execCommand("copy")
        }
