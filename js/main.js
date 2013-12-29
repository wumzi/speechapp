var recording = false;


var user = "demo";
var hashedPass = "8b1c1c1eae6c650485e77efbc336c5bfb84ffe0b0bea65610b721762";
var clientDB = "demo";

var mediaRec;


function main(){
    /* Decide quelle action lancer lorsque le bouton est togglé */
    var microphone = document.getElementById('microphone');
    if (!recording){
        try{
            microphone.className = "wobble animated";
            microphone.style.border = '5px solid #003173';
            
            startRecord();

            recording = true;
        }
        catch (e){
            console.log("Recording issue\n" + e);
        }
    }
    else{
        try{
            stopRecord();
            recording = false;
            //changeLogoBG('white');
            microphone.className = "";
            microphone.style.border = '5px solid white';
        }
        catch (e){
            console.log("Recording stop issue\n" + e);
        }
    }

}


function startRecord(){
    /* Lance un enregistrement */
    src = "sa-record.wav";
    mediaRec = new Media(src,
                function(){
                    alert("done !");
                },
                function (){
                    alert("error recording");
                }
            );
    mediaRec.startRecord();
}


function stopRecord(){
    /* Stopper et clore un enregistrement */
    mediaRec.stopRecord();

    var reader = new FileReader();
    reader.readAsBinaryString("/sdcard/sa-record.wav");
    audioBlob = reader.result;

    alert(audioBlob);

    preInteract(audioBlob, "wav");
}


function preInteract(audioBlob, blobType){
    var url = window.URL.createObjectURL(audioBlob);
    //document.getElementById("recording").innerHTML += '<audio controls src="' + url + '">Sound</audio>'; 

    //Envoie à la console une adresse de téléchargement de l'échantillon
    console.log(url);

    //Communique les data au serveur
    servInteract(audioBlob, blobType);

}


function servInteract(audioBlob, blobType){
    // Envoie le blob au serveur
    var formData = new FormData();
    formData.append('user', user);
    formData.append('hashedPass', hashedPass);
    formData.append('clientDB', clientDB);
    
    formData.append('action', 'recognize_spoken_word');

    formData.append('audioBlob', audioBlob);
    formData.append('audioType', blobType);

    var req = new XMLHttpRequest();
    req.open('POST', 'handler', false);
    /*req.onstatechange = function(){
        console.log('ez');
        console.log(req.readyStatus);
        if (req.readyStatus === 4){
            console.log('4');
            if (req.status == 200){
                console.log(200);
                wordResponse(req.responseXML);         
            }
        }
    }*/
    //req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(formData);
    resp = req.responseXML;
    wordResponse(resp);

}


function wordResponse(respXML){
    if (respXML.getElementsByTagName('respWord')){
        var responseWord = respXML.getElementsByTagName('respWord')[0].textContent;
    }
    else{
        var responseWord = "Error :'(";
    }
    var responseElement = document.getElementById('responseWord');
    console.log(responseWord);
    responseElement.innerHTML = responseWord;

}
