
//var divRoot = $("#affdex_elements")[0];
var divRoot = document.getElementById("affdex_elements");
var width = 640;
var height = 480;
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);
detector.detectAllEmotions();
detector.detectAllExpressions();
detector.detectAllEmojis();
detector.detectAllAppearance();


detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
        console.log("face success here");
      });

detector.addEventListener("onWebcamConnectFailure", function() {
        console.log("Webcam access denied");
      });

function onStart() {
	if (detector && !detector.isRunning) {
		console.log("Detector Started");
		detector.start();
     }     
 }


function generateMeme() {
	//have javascript to log in now
	console.log("Generating Meme");
}

function generateQuotes() {
	//have javascript to log in now
	console.log("Generating Quotes");
}

