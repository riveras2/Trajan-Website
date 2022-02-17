

addEventListener('keyup',function(){
 if (event.keyCode === 13) {
    document.getElementById("flame").style.visibility = "visible";
    document.getElementById("glow").style.visibility = "visible";
    document.getElementById("container").style.opacity = ".15";
    document.getElementById("info").style.opacity = ".15";
    document.getElementById("boo").style.visibility = "hidden";
    document.getElementById("flashlight").style.visibility = "hidden";
    document.getElementById("jump").style.visibility = "visible";
    var audio4 = new Audio("img/boo.mp3");
    var audio5 = new Audio("img/jumpscare.mp3");
    audio4.play();
    audio5.play();
    audio5.volume = 0.08;


    pageRedirect();
  }

;});

window.onkeydown = function(e) {
    return !(e.keyCode == 32);
};

var count = 0;
addEventListener('keyup', function() {
  if (event.keyCode === 32 && count < 3) {
    count++;
    var audio = new Audio("img/recording.mp3");
    var audio2 = new Audio("img/recording2.mp3");
    var audio3 = new Audio("img/recording3.mp3");

    var sounds = [
      audio,
      audio2,
      audio3
    ];


    var soundFile = sounds[Math.floor(Math.random()*sounds.length)];
    soundFile.play();
    soundFile.volume = Math.random();
  }

});


function pageRedirect(){
 var delay = 1800; // time in milliseconds

 // Display message

 setTimeout(function(){
  window.location = "sinOpenning.html";
 },delay);

}
