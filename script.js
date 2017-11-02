// SDK Needs to create video and canvas nodes in the DOM in order to function
// Here we are adding those nodes a predefined div.
var generated = false;

var divRoot = $("#affdex_elements")[0];
var width = 680;
var height = 480;
var emotionData = {}
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
//Construct a CameraDetector and specify the image width / height and face detector mode.
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

//Enable detection of all Expressions, Emotions and Emojis classifiers.
detector.detectAllEmotions();
detector.detectAllExpressions();
detector.detectAllEmojis();

//Add a callback to notify when the detector is initialized and ready for runing.
detector.addEventListener("onInitializeSuccess", function() {
    log('#logs', "The detector reports initialized");
    //Display canvas instead of video feed because we want to draw the feature points on it
    $("#face_video_canvas").css("display", "block");
    $("#face_video").css("display", "none");
});

function log(node_name, msg) {
    $(node_name).append("<span>" + msg + "</span><br />")
}

//function executes when Start button is pushed.
function onStart() {
    if (detector && !detector.isRunning) {
        $("#logs").html("");
        detector.start();
    }
    log('#logs', "Clicked the start button");
}

//function executes when the Stop button is pushed.
function onStop() {
    log('#logs', "Clicked the stop button");
    if (detector && detector.isRunning) {
        detector.removeEventListener();
        detector.stop();
    }
};

//function executes when the Reset button is pushed.
function onReset() {
    log('#logs', "Clicked the reset button");
    if (detector && detector.isRunning) {
        detector.reset();

        $('#results').html("");
    }
};

//Add a callback to notify when camera access is allowed
detector.addEventListener("onWebcamConnectSuccess", function() {
    log('#logs', "Webcam access allowed");
    console.log("Webcam access allowed");
});

//Add a callback to notify when camera access is denied
detector.addEventListener("onWebcamConnectFailure", function() {
    log('#logs', "webcam denied");
    console.log("Webcam access denied");
});

//Add a callback to notify when detector is stopped
detector.addEventListener("onStopSuccess", function() {
    log('#logs', "The detector reports stopped");
    $("#results").html("");
});

//Add a callback to receive the results from processing an image.
//The faces object contains the list of the faces detected in an image.
//Faces object contains probabilities for all the different expressions, emotions and appearance metrics
detector.addEventListener("onImageResultsSuccess", function(faces, image,
    timestamp) {
    $('#results').html("");
    log('#results', "Number of faces found: " + faces.length);
    if (faces.length > 0) {
        // Gets gender, age, facial features
        log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));

        emotionData = JSON.parse(JSON.stringify(faces[0].emotions,
            function(key, val) {
                return val.toFixed ? Number(val.toFixed(0)) : val;
            }));

        log('#results', "Emotions: " + JSON.stringify(faces[0].emotions,
            function(key, val) {
                return val.toFixed ? Number(val.toFixed(0)) : val;
            }));
        /*log('#results', "Expressions: " + JSON.stringify(faces[0].expressions,
            function(key, val) {
                return val.toFixed ? Number(val.toFixed(0)) : val;
            }));*/

        // Return an emoji of face
        /*log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
        drawFeaturePoints(image, faces[0].featurePoints);*/
    }
});

//Draw the detected facial feature points on the image
/*function drawFeaturePoints(img, featurePoints) {
    var contxt = $('#face_video_canvas')[0].getContext('2d');

    var hRatio = contxt.canvas.width / img.width;
    var vRatio = contxt.canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);

    contxt.strokeStyle = "#FFFFFF";
    for (var id in featurePoints) {
        contxt.beginPath();
        contxt.arc(featurePoints[id].x,
            featurePoints[id].y, 2, 0, 2 * Math.PI);
        contxt.stroke();

    }
}*/

function generateGif() {
    if (generated){
        removePrevious();
    }

    giphyData = {}
    maxVal = -1
    maxEmotion = findMaxEmotion();
    console.log("Max Emotion: " + maxEmotion);
    var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=" + maxEmotion + "&api_key=0MVjiemZMnv3N9Oh55IpB8SeYSf1ugLd&limit=1");
    xhr.done(function(data) {
        giphyEmbedUrl = data.data[0].embed_url;
    });
    $("#gifDiv").html("<div style='width:50%;height:0;padding-bottom:20%;position:relative;'><iframe src='" + giphyEmbedUrl + "' width='100%' height='100%' style='position:absolute' frameBorder='0' class='giphy-embed' allowFullScreen></iframe></div>")

    generated = true;
}


//joy , sadness, disgust , anger, surprise

function generateMeme() {

    maxEmotion = getRandomEmotion(); //findMaxEmotion();

    if (generated){
        removePrevious();
    }

    var img = new Image();
    var div = document.getElementById('gifDiv');

    img.onload = function() {
      div.appendChild(img);
    };

    var random;
    if (maxEmotion == "joy"){
        random = getRandomHappyImage();
        img.src = 'Memes/Happy/'+random;
    }

    else if (maxEmotion == "sadness"){
        random = getRandomSadImage();
        img.src = 'Memes/Sad/'+random;
    }

    else if (maxEmotion == "anger"){
        random = getRandomAngerImage();
        img.src = 'Memes/Anger/'+random;
    }

    else if (maxEmotion == "disgust"){
        random = getRandomDigustImage();
        img.src = 'Memes/Disgust/'+random;
    }

    else{
        random = getRandomSurpriseImage();
        img.src = 'Memes/Surprise/'+random;
    }

    generated = true;
}


function generateQuotes() {
    //have javascript to log in now
    if (generated){
        removePrevious();
    }
    console.log("Generating Quotes");
    generated = true;
}

function getRandomEmotion(){
  var images = ["joy", "sadness", "surprise", "disgust", "anger" ];
  return images[Math.floor(Math.random() * images.length)];
}

function getRandomHappyImage() {
  var images = ["happy1.png","happy2.png","happy3.jpg", "happy4.jpg", "happy5.jpg", "happy6.jpg", "happy7.jpg", "happy8.jpg", "happy9.jpg", "happy10.jpg" ];
  return images[Math.floor(Math.random() * images.length)];
}

function getRandomSadImage() {
  var images = ["sad1.jpg","sad2.jpg","sad3.jpg", "sad4.jpg", "sad5.jpg", "sad6.jpg", "sad7.jpg", "sad8.jpg", "sad9.jpg", "sad10.jpg" ];
  return images[Math.floor(Math.random() * images.length)];
}

function getRandomAngerImage() {
  var images = ["AngerMeme1.jpg","AngerMeme2.jpg","AngerMeme3.jpg", "AngerMeme4.jpeg", "AngerMeme5.jpg", "AngerMeme6.jpg", "AngerMeme7.jpg", "AngerMeme8.jpg", "AngerMeme9.jpeg", "AngerMeme10.jpeg" ];
  return images[Math.floor(Math.random() * images.length)];
}

function getRandomDigustImage() {
  var images = ["DisgustMeme1.jpg","DisgustMeme2.jpeg","DisgustMeme3.jpg", "DisgustMeme4.jpeg", "DisgustMeme5.jpg", "DisgustMeme6.jpg", "DisgustMeme7.jpg", "DisgustMeme8.jpeg", "DisgustMeme9.jpg", "DisgustMeme10.jpeg"];
  return images[Math.floor(Math.random() * images.length)];
}

function getRandomSurpriseImage() {
  var images = ["SurpriseMeme1.jpg","SurpriseMeme2.gif","SurpriseMeme3.jpg", "SurpriseMeme4.jpeg", "SurpriseMeme5.jpg", "SurpriseMeme6.jpg", "SurpriseMeme7.jpg", "SurpriseMeme8.jpeg", "SurpriseMeme9.jpg", "SurpriseMeme10.jpg"];
  return images[Math.floor(Math.random() * images.length)];
}

function removePrevious(){
    var remove = document.getElementById('gifDiv');
    remove.removeChild(remove.childNodes[0]);
}

function findMaxEmotion(){
    emotionData["engagement"] = 0;
    emotionData["valence"] = 0;
    for (var key in emotionData) {
        if (emotionData.hasOwnProperty(key)) {
            /*                console.log(emotionData[key]);
             */

            var val = emotionData[key];
            if (val > maxVal) {
                maxEmotion = key;
                maxVal = val;


            }
        }
    }
    return maxEmotion;
}
