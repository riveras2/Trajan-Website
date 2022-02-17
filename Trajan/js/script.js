var flashlight = document.getElementById('flashlight');

flashlight.onmousemove = function(event) {
  this.style.backgroundPosition = (event.clientX-200) + 'px ' + (event.clientY-200) + 'px';

};
