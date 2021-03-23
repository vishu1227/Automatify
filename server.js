const express=require('express');
const app=express();
const fs=require('fs');
const multer=require('multer');
const path=require('path');
// const translate=require('google-translate-api');
// const {TesseractWorker}=require('tesseract.js')
const {createWorker}=require('tesseract.js')
const translate = require("translate"); // Old school


app.use('/libraries',express.static(path.join(__dirname, 'libraries')))

// const worker = new TesseractWorker(); 
const worker = createWorker({
    logger: m => console.log(m)
});  

const storage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
});

const upload=multer({storage:storage}).single('avatar')

app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render('index');
})

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        fs.readFile(`./uploads/${req.file.originalname}`,(err,data)=>{

            if(err){ return console.log(err); }
            
            (async () => {
                console.log('Yes i was called!');
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(data,'eng',{tessjs_create_pdf:'1'});
                // console.log(text);
                // img_txt=text;
                await worker.terminate();
                return text;
              })().then((img_txt)=>{
                  console.log('Text in this img is:\n');
                  console.log(img_txt)
                  res.send(img_txt);
                //   res.redirect('/download')
              });              
        })
    })
})

app.get('/download',(req,res)=>{
    console.log('Yes in download section!');
    const file=`${__dirname}/tesseract.js-ocr-result.pdf`
    res.download(file)
})

const port=5000 || process.env.PORT

app.listen(port,()=>{
    console.log('Listning at: ',port)
})
