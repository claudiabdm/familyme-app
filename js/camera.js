 // Grab elements, create settings, etc.
 var video = document.getElementById('video');

 // Get access to the camera!
 if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
   // Not adding `{ audio: true }` since we only want video now
   navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
     //video.src = window.URL.createObjectURL(stream);
     video.srcObject = stream;
     video.play();
   });
 }

 // Elements for taking the snapshot
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');
var snapBtn = document.getElementById('snap');

// Trigger photo take
snapBtn.addEventListener('click', function(e) {
  if(snapBtn.innerText === 'Take photo') {
    canvas.className = 'video__canvas video__canvas--show';
    video.className = 'video__camera video__camera--hide';
    context.drawImage(video, 0, 0, 426, 320);
    snapBtn.textContent = 'Retake photo';
  } else if (snapBtn.innerText === 'Retake photo') {
    canvas.className = 'video__canvas video__canvas';
    video.className = 'video__camera video__camera';
    snapBtn.textContent = 'Take photo';
  }
});