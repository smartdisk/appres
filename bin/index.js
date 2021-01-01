#!/usr/bin/env node

const pkg = require('../package.json');
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const boxen = require("boxen");
const needle = require('needle');
const sharp = require('sharp');
const mkdirp = require('mkdirp');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { rejects } = require("assert");
const argv = yargs(hideBin(process.argv)).argv;

const jsonFile = "appres.json";

// let HOST = "http://127.0.0.1:5001/appres-org/us-central1/api";
let HOST = "https://us-central1-appres-org.cloudfunctions.net/api";
let PKEY = argv.pkey ? argv.pkey : "YOUR_PKEY";
let AKEY = argv.akey ? argv.akey : "YOUR_AKEY";
let LANG = argv.lang ? argv.lang : null;



const boxenOptions = {
 padding: 1,
 margin: 1,
 borderStyle: "round",
 borderColor: "green",
 backgroundColor: "#555555"
};


const _sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

const _hello = async() => {
    for(let i=0;i<1000;i++) {
        process.stdout.write("\r"+chalk.blue("hello") + ": " + i);
        await _sleep(1);
    }
    process.stdout.write("\n");
}

const _helper = () => {
    let helperMsg = chalk.white.bold("Hello AppRes!!!");
    let helperBox = boxen( helperMsg, boxenOptions );
    console.log(helperBox);
}

const _getcwd = () => {
    return process.cwd();
}

const _forcedir = (dir) => {
    let dirok = true;
    if(!fs.existsSync(dir)) {
        dirok = false;
        try {
            mkdirp.sync(dir);
            dirok = true;
        } catch(err) {
            console.log(chalk.red(err));
        }
    }
    return dirok;    
}
const _forcefiledir = (filepath) => {
    let dir = path.dirname(filepath);
    return _forcedir(dir);
}

// ['', 'ldpi', 'mdpi', 'tvdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
const _scale = (tag) => {
    if(tag) tag = tag.toLowerCase();
    switch(tag) {
        case 'ldpi':
            return 0.75;
        case 'mdpi':
            return 1.0;
        case 'tvdpi':
            return 1.33;
        case 'hdpi':
            return 1.5;
        case '@2x':
        case 'xhdpi':
            return 2.0;
        case '@3x':
            case 'xxhdpi':
            return 3.0;
        case 'xxxhdpi':
            return 4.0;
    }
    return 1.0;
}
const _fit = (tag) => {
    if(tag) tag = tag.toLowerCase();
    switch(tag) {
        case 'contain':
            return sharp.fit.contain;
        case 'cover':
            return sharp.fit.cover;
        case 'fill':
            return sharp.fit.fill;
        case 'inside':
            return sharp.fit.inside;
        case 'outside':
            return sharp.fit.outside;
    }
    return sharp.fit.contain;
}
const _rgba = (r, g, b, a) => {
    return { r: r, g: g, b: b, alpha: a };
}
const _rgb = (r, g, b) => {
    return _rgba(r, g, b, 1.0);
}
const _hex2rgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}
const _rgb2hex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const _color = (tag, ext) => {
    if(tag) tag = tag.toLowerCase();
    if(ext) ext = ext.toLowerCase();
    switch(tag) {

        case 'lightred':
            return { r: 255, g: 0, b: 0, alpha: 1.0 };
        case 'lightgreen':
            return { r: 0, g: 255, b: 0, alpha: 1.0 };
        case 'lightblue':
            return { r: 0, g: 0, b: 255, alpha: 1.0 };

        case 'darkred':
            return { r: 100, g: 0, b: 0, alpha: 1.0 };
        case 'darkgreen':
            return { r: 0, g: 100, b: 0, alpha: 1.0 };
        case 'darkblue':
            return { r: 0, g: 0, b: 100, alpha: 1.0 };

        case 'white': 
            return _rgb(255, 255, 255);
        case 'black':	
            return _rgb(0, 0, 0);

        case 'silver':	
            return _hex2rgb('#d6d6d6');

        case 'lightgray':	
            return _rgb(172, 172, 172);
        case 'gray':	
            return _rgb(128, 128, 128);
        case 'darkgray':	
            return _rgb(66, 66, 66);

        case 'red':	
            return _rgb(172, 0, 0);

        case 'maroon':	
            return _rgb(128, 0, 0);

        case 'lightyellow':	
            return _rgb(255, 255, 0);
        case 'yellow':	
            return _rgb(192, 192, 0);
        case 'darkyellow':	
            return _rgb(100, 100, 0);

        case 'olive':	
            return _rgb(128, 128, 0);
        case 'lime':
            return _rgb(0, 255, 0);

        case 'green':
            return _rgb(0, 172, 0);

        case 'aqua':	
            return _rgb(0, 255, 255);
        case 'teal':	
            return _rgb(0, 128, 128);

        case 'blue':	
            return _rgb(0, 0, 172);

        case 'navy':	
            return _rgb(0, 0, 66);
        case 'fuchsia':	
            return _rgb(255, 0, 255);
        case 'purple':	
            return _rgb(128, 0, 128);
    }
    if(ext=='.png' || ext=='.gif')
        return { r: 0, g: 0, b: 0, alpha: 0.0 };
    return { r: 255, g: 255, b: 255, alpha: 1.0 };    
}
const _flatten = (tag, ext) => {
    let flatten = _color(tag, ext);
    return flatten;
}

const _newsize = (width, height, _scale, _width, _height) => {
    let __width = _scale ? width * _scale : width;
    let __height = _scale ? height * _scale : height;

    if(_width=='auto' && _height && _height!='auto') {
        let ah = _height / height;
        _width = width * ah;
    }
    if(_height=='auto' && _width && _width!='auto') {
        let aw = _width / width;
        _height = height * aw;
    }

    if(_width=='auto') {
        __width = _scale ? width * _scale : width;
    } else 
    if(_width) {
        __width = _scale ? _width * _scale : _width;
    }

    if(_height=='auto') {
        __height = _scale ? height * _scale : height;
    } else 
    if(_height) {
        __height = _scale ? _height * _scale : _height;
    }

    __width = Math.round(__width);
    __height = Math.round(__height);

    return {width: __width, height: __height};
}


const _saveicon = (_icon, _file, _scale, _width, _height) => {
    return new Promise((resolve, reject) => {
        let _fileext = path.extname(_file);
        sharp(_icon).metadata().then(({width, height}) => {
            let newsize = _newsize(width, height, _scale, _width, _height);
            newsize.fit = _fit(argv.fit);
            newsize.background = _color(argv.bgc || argv.background, _fileext);
            
            let flatten = _flatten(argv.bgc || argv.background, _fileext) || {r:0, g:0, b:0};                                    
            let _sharp = sharp(_icon);
            if(flatten.alpha==null || flatten.alpha!=0) {
                _sharp = _sharp.flatten({background: flatten});
            }
            _sharp.resize(newsize).toFile(_file, (err, info) => {
                if(err) reject(err);
                    else resolve(info);
            });
        });    
    });
}

const _writeicon = (_icon, _savefilepath, _scale, _width, _height, _subdir, _dirname, _savefile) => {
    return new Promise((resolve, reject) => {
        if(_forcefiledir(_savefilepath)) {
            _saveicon(_icon, _savefilepath, _scale, _width, _height).then((res, err) => {
                if(res) {
                    resolve(res);
                } 
                if(err) {
                    reject(err);
                }
            });
        } else {
            reject("Error: Cannot make directory.");
        }
    });
}

const _load = (resolve) => {
    let json = null;
    fs.readFile(jsonFile, (err, data) => {
        if(err) {
            json = {};
        } 

        try {
            json = JSON.parse(data);
        } catch (e) {
            json = {};
        }

        if(argv.host!=null) {
            json.host = argv.host;
        } else
        if(json.host==null) {
            json.host = HOST;
        }

        if(argv.pkey!=null) {
            json.pkey = argv.pkey;
        } else
        if(json.pkey==null) {
            json.pkey = PKEY;
        }

        if(argv.akey!=null) {
            json.akey = argv.akey;
        } else
        if(json.akey==null) {
            json.akey = AKEY;
        }

        if(argv.lang!=null) {
            json.lang = argv.lang;
        }

        resolve(json);
    });
}

const _init = async(json) => {
    fs.writeFile(jsonFile, JSON.stringify(json, null, 2), (err) => {
        if(err) {
            console.log(chalk.red(err));
        } else {
            console.log(chalk.blueBright("Initialize %s"), chalk.greenBright(jsonFile));
        }
    });
}

const _icon = async() => {
    if(argv.file) {
        let data = {
            pkey: PKEY,
            akey: AKEY,
            cmd: argv._[0],
            file: argv.file
        };

        needle.post(HOST, data, function(err, res) {
            if(!err) {
                if(res.body.r) {
                    console.log(JSON.stringify(res.body));
                } else {
                    // success
                    let savefile = argv.file;
                    if(argv.save && argv.save!==true) {
                        savefile = argv.save;
                        argv.save = true;
                    }
                    else
                    if(argv.s && argv.a && argv.v && argv.e) {
                        argv.save = true;
                    }

                    let subdir = null;
                    let dir = _getcwd();
                    if(argv.dir && argv.dir!==true) {
                        subdir = argv.dir;
                        argv.save = true;
                        if(path.isAbsolute(argv.dir)) {
                            dir = argv.dir;
                        } else {
                            dir = path.join(dir, argv.dir);
                        }
                    }

                    let size = ((argv.size!==true) && argv.size) || 'auto';
                    let width = ((argv.width!==true) && argv.width) || size;
                    let height = ((argv.height!==true) && argv.height) || size;

                    if(argv.target==null) {
                        if(argv.save===true && savefile) {                        
                            let dirname = null;
                            let savefilepath = path.join(dir, savefile);
                            let scale = 1;
                            _writeicon(res.body, savefilepath, scale, width, height, subdir, dirname, savefile).then((res, err) => {
                                if(res) {
                                    console.log(chalk.blueBright("Save : %s"), 
                                        chalk.greenBright(
                                            dirname ? (subdir==null ? path.join(dirname, savefile) : path.join(subdir, dirname, savefile)) : (subdir==null ? path.join(savefile) : path.join(subdir, savefile))
                                        )
                                    );
                                } 
                                if(err) {
                                    console.log(chalk.red(err));
                                }
                            });
                        } else {
                            console.log(res.body);
                        }    
                    } else {
                        if(fs.existsSync(argv.target + ".json")){
                                                        
                        } else 
                        if(argv.target=="android" || argv.target=="ios") {
                            // android type : "drawable", "mipmap"
                            let type = (argv.type!==true ? argv.type : null) || "mipmap";
                            let dpis = ['', 'ldpi', 'mdpi', 'tvdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
                            if(argv.target=='ios') {
                                type = argv.type || null;
                                dpis = ['', '@2x', '@3x'];
                            }
                            for(let dpi in dpis){
                                let dpitag = dpis[dpi];                                
                                let dirname = type;
                                if(dpitag!='' && argv.target=="android") {
                                    if(type) {
                                        dirname = type + "-" + dpitag;
                                    } else {
                                        dirname = dpitag;
                                    }
                                }
                                let _savefile = savefile;
                                let savefilepath;
                                if(dirname) {
                                    savefilepath = path.join(dir, dirname, _savefile);
                                } else {
                                    savefilepath = path.join(dir, _savefile);
                                }
                                if(dpitag!='' && argv.target=='ios') {
                                    let fileext = path.extname(savefilepath);
                                    savefilepath = savefilepath.replace(/\.[^/.]+$/, "") + dpitag;
                                    if(fileext!=null && fileext!="") {
                                        savefilepath = savefilepath + fileext;
                                        _savefile = path.join(path.dirname(_savefile), path.basename(savefilepath));
                                    }
                                }

                                let scale = _scale(dpitag);
                                _writeicon(res.body, savefilepath, scale, width, height, subdir, dirname, _savefile).then((res, err) => {
                                    if(res) {
                                        console.log(chalk.blueBright("Save : %s"), 
                                            chalk.greenBright(
                                                dirname ? (subdir==null ? path.join(dirname, _savefile) : path.join(subdir, dirname, _savefile)) : (subdir==null ? path.join(_savefile) : path.join(subdir, _savefile))
                                            )
                                        );
                                    } 
                                    if(err) {
                                        console.log(chalk.red(err));
                                    }
                                });
                            }
                        }
                    }

                }
            } else {
                console.log(chalk.red(JSON.stringify(err)));
            }
        });
    }
}

const _string = async() => {
    if(argv.key) {
        let data = {
            pkey: PKEY,
            akey: AKEY,
            lang: LANG,
            cmd: 'string',
            key: argv.key,
        };
        needle.post(HOST, data, function(err, res) {
            if(err) {
                console.log(chalk.red(JSON.stringify(err)));
            } else {
                if(res.body.r=="s" && res.body.d) {
                    // Success
                    console.log(JSON.stringify(res.body.d));
                } else {
                    console.log(chalk.red(JSON.stringify(res.body)));
                }
            }
        });
    }
}

const _setenv = (json) => {
    HOST = json.host;
    PKEY = json.pkey;
    AKEY = json.akey;
    LANG = json.lang;
}

const _main = async() => {
    switch(argv._[0]) {
        case 'init':
            _load((json) => {
                _init(json);
            });
            break;
        case 'version':
            console.log(pkg.version);
            break;
        case 'icon':
            _load((json) => {
                _setenv(json);
                _icon();
            });
            break;
        case 'string':
            _load((json) => {
                _setenv(json);
                _string();
            });
            break;
    }
}

if(argv._.length>0) {
    _main();
} else {
    switch(argv.func) {
        case "help":
            _helper();
            break;
        case "hello":
            _hello();
            break;
    }    
}


