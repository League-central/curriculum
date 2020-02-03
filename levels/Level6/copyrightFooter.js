document.write("Copyright ");

var alink = document.createElement("a");
alink.href = "http://www.jointheleague.org";
alink.text = "League of Amazing Programmers";
document.getElementsByTagName("body")[0].appendChild(alink);

document.write(" 2013-2018");