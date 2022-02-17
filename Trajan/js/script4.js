
var theme = document.getElementById("audio1");
var theme2 = document.getElementById("audio2");
var body = document.getElementById("page-top");



body.onclick = function() {
  theme.play();
  theme2.play();

}

var myAudio = new Audio('img/theme.mp3');
myAudio.play();
