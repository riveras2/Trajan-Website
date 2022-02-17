'use strict';

var app = {

  chars: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'],

  init: function () {
    app.container = document.createElement('div');
    app.container.className = 'animation-container';
    document.body.appendChild(app.container);
    window.setInterval(app.add, 100);
  },

  add: function () {
    var element = document.createElement('span');
    app.container.appendChild(element);
    app.animate(element);
  },

  animate: function (element) {
    var character = app.chars[Math.floor(Math.random() * app.chars.length)];
    var duration = Math.floor(Math.random() * 15) + 1;
    var offset = Math.floor(Math.random() * (50 - duration * 2)) + 3;
    var size = 10 + (15 - duration);
    element.style.cssText = 'right:'+offset+'vw; font-size:'+size+'px;animation-duration:'+duration+'s';
    element.innerHTML = character;
    window.setTimeout(app.remove, duration * 1000, element);
  },

  remove: function (element) {
    element.parentNode.removeChild(element);
  },

};

document.addEventListener('DOMContentLoaded', app.init);




//images to hide under cards
var pics = [
	'img/ace-hearts.png' ,
	'img/king-clubs.png' ,
	'img/king-spades.png' ,
	'img/card.png'
]

var indices = [0, 1, 2];

var images = document.getElementsByTagName('img');

var counter = document.getElementById('counter');

var count = 0;

var btn = document.querySelector('.btn');

var overlay = document.querySelector('.reveal')

//shuffle the array numbers randomly
function shuffleIds(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

//user clicks on a card to turn it over.
function turnCards() {

	shuffleIds(indices);
	var i = 0
	var src = '';
	for (i = 0; i < indices.length; i++) {

		this.setAttribute('src' , pics[indices[i]]);
		images[i].removeEventListener('click' , turnCards);

	}
	src = this.getAttribute('src');
	if (src === 'img/king-spades.png' || src === 'img/king-clubs.png' ) {
		count ++

		showCards();
    document.getElementById('page-top').style.filter = "blur(2px)";
    if (count === 2) {
      document.getElementById('page-top').style.filter = "blur(4px)";
    }
    if (count === 3) {
      document.getElementById("page-top").innerHTML = "You're Mine Now";
      document.getElementById('page-top').style.background = "black";
      pageRedirect();
    }

  }
      if (src === 'img/ace-hearts.png') {
        pageRedirect2();
  }


	indices.pop(i);
	updateCounter();

}


function updateCounter() {
	    if (count === 1) {
			counter.innerHTML = count + ' time';
		} else {
			counter.innerHTML = count + ' times';
		}
}

function showCards() {



}
function pageRedirect2(){
 var delay = 2000; // time in milliseconds

 // Display message

 setTimeout(function(){
  window.location = "win.html";
 },delay);

}

//user clicks "Try Again" button to reset the card images and unshuffle the indices array.
function tryAgain() {
  event.preventDefault();
	for (var i = 0; i < images.length; i++) {
		images[i].setAttribute('src' , pics[3]);
		images[i].addEventListener('click' , turnCards);

	}
	indices = [0, 1, 2];
}

//bind functions to cards and Try Again button
for (var i = 0; i < images.length; i++) {
	images[i].addEventListener('click' , turnCards);

}

//bind function to "Try Again" button
btn.addEventListener('click' , tryAgain);

function pageRedirect(){
 var delay = 1800; // time in milliseconds

 // Display message

 setTimeout(function(){
  window.location = "fail.html";
 },delay);

}
