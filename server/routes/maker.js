var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
const GameMakerConfig = require(path.join(__dirname, '../../config/GameMakerConfig'));
console.log(typeof GameMakerConfig);
console.log(GameMakerConfig.outPath);
router.post('/createComic', function(req, res, next) {
    // res.send('respond with a resource', req.body);
    const body = req.body;
    // {"dirPath":"E:workcomic_maker_work_space","fileName":"111"}
    const dirPath = body.dirPath;
    const fileName = body.fileName;
    const filePath = path.join(dirPath, fileName);
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
    }
    res.status(200).send({
        code: 0,
        success: true,
        data: {
            dirPath,
            fileName
        }
    })


});

router.get('/getFileList', function(req, res, next) {
    // {"dirPath":"E:workcomic_maker_work_space","fileName":"111"}
    console.log(GameMakerConfig);
    
    const outPath = GameMakerConfig.outPath;
    console.log(outPath);
    let fileList = [];
    let error = null;
    try {
        // 根据路径获取文件列表
        fileList = fs.readdirSync(outPath);
        console.log(fileList);
        fileList = fileList.map(item => {
            return {
                name: item,
                path: path.join(outPath, item)
            }
        })
        
    } catch (e) {
        console.log(e)
        error = e
    }

    res.status(200).send({
        code: 0,
        success: true,
        data: {
            fileList
        },
        error
    })


});

router.post('/readComic', function(req, res, next) {
    const filePath = req.body.filePath;
    console.log(filePath);
    let readFileResult = null
    let json = null;
    let error = null;
    try {
        // 根据路径获取文件列表
        readFileResult = fs.readFileSync(filePath);
        console.log(readFileResult);
        // 转换为json
        json = JSON.parse(readFileResult.toString());
        console.log(json);
        
    } catch (e) {
        console.log(e)
        error = e
    }

    res.status(200).send({
        code: 0,
        success: true,
        data: {
            filePath,
            json
        },
        error
    })


});

router.post('/save', function(req, res, next) {
    const body = req.body;
    // {"dirPath":"E:workcomic_maker_work_space","fileName":"111"}
    const filePath = body.filePath;
    const json = JSON.stringify(body.json, null, "\t");
    console.log('save', filePath);
    // if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, body.json);
    // }
    res.status(200).send({
        code: 0,
        success: true,
        data: null
    })



});



module.exports = router;
