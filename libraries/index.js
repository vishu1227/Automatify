// function setup()
// {
//     noCanvas();
//     let lang=navigator.language || 'en-US';
//     let SpeechRec=new p5.SpeechRec(lang,gotSpeech);
    
//     let continous=true;
//     let interm=true;

//     SpeechRec.start(continous,interm);

//     function gotSpeech(){
//         if(SpeechRec.resultValue)
//         {
//             createP(SpeechRec.resultString);
//         }
//     }
// }

document.getElementById('translateB').onclick=async()=>{

    const text=document.getElementById('lang1').value;
    const src=document.querySelector('#from').value.toLowerCase();
    const tar=document.querySelector('#to').value.toLowerCase();

    const res = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        body: JSON.stringify(
            {
                q: text,
                source: src,
                target: tar
            }
        ),
        headers: { "Content-Type": "application/json" }
    });
    document.getElementById('trans_txt').innerHTML=(await res.json()).translatedText;
}

var loadFile=function(event){
    var output=document.getElementById('input_img');
    
    output.style.height='50vh'
    output.style.width='50vw'

    output.src=URL.createObjectURL(event.target.files[0]);
    output.onload=function()
    {
        URL.revokeObjectURL(output.src);
    }
}

document.getElementById('convert').onclick=async()=>{
    console.log('Yes in convert function!');

    let data=await fetch('/upload');
    let jData=await data.json();

    console.log(jData);
}


function sppechRecognize()
{
    let lang=navigator.language || 'en-US';
    let SpeechRec=new p5.SpeechRec(lang,gotSpeech);
    
    let continous=true;
    let interm=true;

    SpeechRec.start(continous,interm);

    function gotSpeech(){
        if(SpeechRec.resultValue)
        {
            document.getElementById('trans_sppech').innerHTML=SpeechRec.resultString;
        }
    }
}