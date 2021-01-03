#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const filesize = require("filesize");
const needle = require('needle');
const mkdirp = require('mkdirp');
const jimp = require('jimp');
const open = require('open');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const pkg = require('../package.json');

const jsonFile = "appres.json";
const quiet = argv.quiet===true;

//let HOST = "http://127.0.0.1:5001/appres-org/us-central1/api";
let HOST = "https://us-central1-appres-org.cloudfunctions.net/api";
let PKEY = argv.pkey ? argv.pkey : "YOUR_PKEY";
let AKEY = argv.akey ? argv.akey : "YOUR_AKEY";
let LANG = argv.lang ? argv.lang : null;

const _version = () => {
    if(!quiet) console.log(pkg.version);
}

const _welcome = () => {
    let welcomeMsg = chalk.white.bold("Welcome to App Resource !!!") + 
        "\n" + 
        chalk.green("v" + pkg.version) +
        "\n" + 
        chalk.cyan("This package use with the appres.org");
    if(!quiet) console.log(welcomeMsg);
}
const _first = () => {
    let msg = "Are you trying to test? First, Initialize the test key using the following command.";
    if(!quiet) console.log(chalk.greenBright(msg));

    msg = "$ appres init --pkey ry7EdO2TLLVr9JkSqqe2 --akey 8b938bec-42ad-4dcf-848f-713dea09fbb7";
    if(!quiet) console.log(chalk.greenBright(msg));

    msg = "Or, Your project key can be create for free at appres.org.";
    if(!quiet) console.log(chalk.whiteBright(msg));
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
            if(!quiet) console.log(chalk.red(err));
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

function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}
function isString(s) {
    return (typeof s === 'string' || s instanceof String);
}
function isObject(s) {
    return (typeof s === 'object' || s instanceof Object);
}
function isNumber(value) {
    if (typeof value !== 'number') {
      return false
    }
    if (value !== Number(value)) {
      return false
    }
    if (value === Infinity || value === !Infinity) {
      return false
    }
    return true
}
function fillChar(str, width, ch) {
    if(ch==null) ch = '0';
    return str.length >= width ? str:new Array(width-str.length+1).join(ch)+str; //남는 길이만큼 ch 으로 채움
}

const _rgba = (r, g, b, alpha) => {
    return { r: r, g: g, b: b, alpha: alpha };
}
const _rgb = (r, g, b) => {
    return _rgba(r, g, b, 1.0);
}
const _shex2rgb = (hex) => {
    var result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
    return result ? {
      r: parseInt(""+result[1]+result[1], 16),
      g: parseInt(""+result[2]+result[2], 16),
      b: parseInt(""+result[3]+result[3], 16)
    } : null;
}
const _shex2rgba = (hex) => {
    var result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
    return result ? {
      r: parseInt(""+result[1]+result[1], 16),
      g: parseInt(""+result[2]+result[2], 16),
      b: parseInt(""+result[3]+result[3], 16),
      a: parseInt(""+result[4]+result[4], 16)
    } : null;
}
const _hex2rgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}
const _hex2rgba = (hex) => {    
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: parseInt(result[4], 16)
    } : null;
}
const _rgb2hex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const _rgba2val = (r, g, b, a) => {
    if(a==null) a = 0xFF;
    else
    if(isFloat(a)) {
        a = Math.round(a*255) || 0x00;
    }
    if(a<0) a = 0;
    if(a>0xFF) a = 0xFF;
    return r*0x1000000 + g*0x10000 + b*0x100 + a;
}
//_color("#RGB")
//_color("#RGB", 0.5)
//_color("#RRGGBB")
//_color("#RRGGBB", 0.5)
//_color("#RRGGBBAA")
//_color(0xFF00FF7F)
//_color(0xFF00FF, 0.5)
//_color(255,0,255,127)
//_color(255,0,255)  => a set to 255
const _color = (r, g, b, a) => {
    if(r==null) return null;

    let color = r;
    if(isString(color)) {
        switch(color.toLowerCase()) {

            case 'lightred':
                return _color({ r: 255, g: 0, b: 0, alpha: 1.0 });
            case 'lightgreen':
                return _color({ r: 0, g: 255, b: 0, alpha: 1.0 });
            case 'lightblue':
                return _color({ r: 0, g: 0, b: 255, alpha: 1.0 });
    
            case 'darkred':
                return _color({ r: 100, g: 0, b: 0, alpha: 1.0 });
            case 'darkgreen':
                return _color({ r: 0, g: 100, b: 0, alpha: 1.0 });
            case 'darkblue':
                return _color({ r: 0, g: 0, b: 100, alpha: 1.0 });
    
            case 'white': 
                return _color(255, 255, 255);
            case 'black':	
                return _color(0, 0, 0);
    
            case 'silver':	
                return _color('#d6d6d6');
    
            case 'lightgray':	
                return _color(172, 172, 172);
            case 'gray':	
                return _color(128, 128, 128);
            case 'darkgray':	
                return _color(66, 66, 66);
    
            case 'red':	
                return _color(172, 0, 0);
    
            case 'maroon':	
                return _color(128, 0, 0);
    
            case 'lightyellow':	
                return _color(255, 255, 0);
            case 'yellow':	
                return _color(192, 192, 0);
            case 'darkyellow':	
                return _color(100, 100, 0);
    
            case 'olive':	
                return _color(128, 128, 0);
            case 'lime':
                return _color(0, 255, 0);
    
            case 'green':
                return _color(0, 172, 0);
    
            case 'aqua':	
                return _color(0, 255, 255);
            case 'teal':	
                return _color(0, 128, 128);
    
            case 'blue':	
                return _color(0, 0, 172);
    
            case 'navy':	
                return _color(0, 0, 66);
            case 'fuchsia':	
                return _color(255, 0, 255);
            case 'purple':	
                return _color(128, 0, 128);
        }    
    }

    if(r instanceof Object || isString(r)) {   // json r.g.b with alpha
        if(r.toString().charAt(0)=='#') {
            if(g==null) {
                if(r.length==4) {
                    let c = _shex2rgb(r);
                    if(g!=null) {
                        c.a = g;
                    }
                    return _rgba2val(c.r, c.g, c.b, c.a);
                }
                if(r.length==5) {
                    let c = _shex2rgba(r);
                    return _rgba2val(c.r, c.g, c.b, c.a);
                }
                if(r.length==7) {
                    let c = _hex2rgb(r);
                    if(g!=null) {
                        c.a = g;
                    }
                    return _rgba2val(c.r, c.g, c.b, c.a);
                }
                if(r.length==9) {
                    let c = _hex2rgba(r);
                    return _rgba2val(c.r, c.g, c.b, c.a);
                }
            }
        } else {
            r = r.r || 0;    
            g = r.g || 0;
            b = r.b || 0;
            a = r.a || r.alpha || 0xFF;
        }
    }
    else
    if(r!=null && g==null) {    // 0xRRGGBBAA
        return r;
    }
    else
    if(r!=null && g!=null && b==null) {    // 0xRRGGBB, alpha
        if(isFloat(g)) {
            a = Math.round(g*255) || 0x00;
        }
        if(a>0xFF) a = 0xFF;
        if(a<0) a = 0;
        return r*0x100 + a;
    }
    return _rgba2val(r, g, b, a);
}

const _console_proc = (msg) => {
    if(!quiet) console.log(chalk.cyan(" > " + msg));
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
        jimp.read(_icon).then((jimp, err) => {
            if(jimp) {
                let width = jimp.getWidth();
                let height = jimp.getHeight();
                let newsize = _newsize(width, height, _scale, _width, _height);
                let background = _color(argv.background);
                let overlay = _color(argv.overlay);

                if(overlay && overlay!==true) {
                    if(jimp.hasAlpha()) {
                        let _overlay = fillChar(overlay.toString(16), 8);
                        _console_proc("overlay: 0x" + _overlay);
                        overlay = _hex2rgba("#" + _overlay);
                        if(overlay!=null) {
                            jimp.scan(0, 0, jimp.bitmap.width, jimp.bitmap.height, (x, y, idx) => {
                                if(jimp.bitmap.data[idx+3]!==0) {
                                    jimp.bitmap.data[idx] = overlay.r;
                                    jimp.bitmap.data[idx+1] = overlay.g;
                                    jimp.bitmap.data[idx+2] = overlay.b;
                                    jimp.bitmap.data[idx+3] = overlay.a;                            
                                }
                            });    
                        } else {
                            _console_proc("overlay: " + chalk.red("Was canceled. Color is invalid."));
                        }
                    } else {
                        _console_proc("overlay: " + chalk.red("Was canceled. No alpha channel."));
                    }
                }
                
                if(background!=null) {
                    let _background = fillChar(background.toString(16), 8);
                    _console_proc("background: 0x" + _background);
                    if(jimp.hasAlpha()) {
                        if(_hex2rgba("#" + _background)!=null) {
                            jimp = jimp.background(background);
                        } else {
                            _console_proc("background: " + chalk.red("Was canceled. Color is invalid."));
                        }
                    } else {
                        _console_proc("background: " + chalk.red("Was canceled. No alpha channel."));
                    }
                }
                if(argv.crop) {
                    _console_proc("crop");
                    jimp = jimp.autocrop();
                }
                if(argv.flip || argv.mirror) {
                    if(!quiet) {
                        if(argv.flip===true) _console_proc("flip");
                        if(argv.mirror===true) _console_proc("mirror");
                    }
                    jimp = jimp.flip(argv.mirror===true, argv.flip===true);
                }
                if(argv.grayscale) {
                    _console_proc("grayscale");
                    jimp = jimp.grayscale();
                }
                if(argv.sepia) {
                    _console_proc("sepia");
                    jimp = jimp.sepia();
                }

                if(argv.contrast) {
                    argv.contrast = argv.contrast===true ? 0.2 : 1.0 * argv.contrast;
                    if(argv.contrast>=-1.0 && argv.contrast<=1.0) {
                        _console_proc("contrast: " + argv.contrast);
                        jimp = jimp.contrast(argv.contrast);
                    }
                }
                if(argv.brightness) {
                    argv.brightness = argv.brightness===true ? 0.2 : 1.0 * argv.brightness;
                    if(argv.brightness>=-1.0 && argv.brightness<=1.0) {
                        _console_proc("brightness: " + argv.brightness);
                        jimp = jimp.brightness(argv.brightness);
                    }
                }
                
                if(argv.invert) {
                    _console_proc("invert");
                    jimp = jimp.invert();
                }
                if(argv.blur) {
                    argv.blur = argv.blur===true ? 5 : 1 * argv.blur;
                    if(argv.blur>0) {
                        _console_proc("blur: " + argv.blur);
                        jimp = jimp.blur(argv.blur);    
                    }
                }
                if(argv.gaussian) {
                    argv.gaussian = argv.gaussian===true ? 1 : 1 * argv.gaussian;
                    if(argv.gaussian>0) {
                        _console_proc("gaussian: " + argv.gaussian);
                        jimp = jimp.gaussian(argv.gaussian);    
                    }
                }
                if(argv.opacity) {
                    argv.opacity = argv.opacity===true ? 0.5 : 1.0 * argv.opacity;
                    if(argv.opacity>=0 && argv.opacity<1.0) {
                        _console_proc("opacity: " + argv.opacity);
                        jimp = jimp.opacity(argv.opacity);    
                    }
                }
                if(argv.rotate && argv.rotate!==true && argv.rotate!=0) {
                    _console_proc("rotate: " + argv.rotate);
                    jimp = jimp.rotate(argv.rotate);
                }

                if((width!=newsize.width || height!=newsize.height) && newsize.width>0 && newsize.height>0) {
                    _console_proc("resize: " + newsize.width + "," + newsize.height);
                    jimp = jimp.contain(newsize.width, newsize.height);
                }

                if(argv.scale) {
                    if(argv.scale===true) argv.scale = 1.0;
                    else argv.scale *= 1.0;

                    if(argv.scale>0) {
                        _console_proc("scale: " + argv.scale);
                        jimp = jimp.scale(argv.scale);
                    }
                }

                jimp.writeAsync(_file).then((res, err) => {
                    if(res) {
                        resolve(res);
                    }
                    if(err) {
                        reject(err);
                    }
                });
            }
            if(err) {
                reject(err);
            }
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


const _iconSaveProc = (icon, dir, subdir, savefile, width, height, target, type, dpis, dpi) => {
    if(dpis.length<=dpi) return;

    let dpitag = dpis[dpi];                                
    let dirname = type;
    if(dpitag!='' && target=="android") {
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
    if(dpitag!='' && target=='ios') {
        let fileext = path.extname(savefilepath);
        savefilepath = savefilepath.replace(/\.[^/.]+$/, "") + dpitag;
        if(fileext!=null && fileext!="") {
            savefilepath = savefilepath + fileext;
            _savefile = path.join(path.dirname(_savefile), path.basename(savefilepath));
        }
    }

    if(!quiet) console.log(chalk.cyanBright("Save") + " : %s", 
        chalk.greenBright(
            dirname ? (subdir==null ? path.join(dirname, _savefile) : path.join(subdir, dirname, _savefile)) : (subdir==null ? path.join(_savefile) : path.join(subdir, _savefile))
        ));

    let scale = _scale(dpitag);
    _writeicon(icon, savefilepath, scale, width, height, subdir, dirname, _savefile).then((res, err) => {
        if(res) {
            if(argv.open) {
                if(argv.open===true) {
                    if(!quiet) console.log(chalk.cyanBright("Open it."));
                    open(savefilepath);
                } else {
                    if(!quiet) console.log(chalk.cyanBright("Open it as " + argv.open));
                    open(savefilepath, {app: argv.open});
                }
            }
            if(!quiet) console.log(chalk.cyanBright("OK!"));
            setTimeout(()=>{
                _iconSaveProc(icon, dir, subdir, savefile, width, height, target, type, dpis, dpi+1);            
            },1);    
        }
        if(err) {
            if(!quiet) console.log(chalk.red(err));
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
            if(!quiet) console.log(chalk.red(err));
        } else {
            if(!quiet) console.log(chalk.blueBright("Initialize %s"), chalk.greenBright(jsonFile));
        }
    });
}


const _icon = async() => {
    if(PKEY=="YOUR_PKEY" || AKEY=="YOUR_AKEY") {
        let msg = "You haven't initialize an access key yet.";
        if(!quiet) console.log(chalk.redBright(msg));
        if(!quiet) console.log("\n");
        _first();
        return;
    }

    let data = {
        pkey: PKEY,
        akey: AKEY,
        cmd: argv._[0]
    };
    if(argv.find && argv.find!==true) {
        data.find = argv.find;
        if(!quiet) console.log(chalk.cyanBright("Find") + " : " + chalk.greenBright(data.find));
    }
    else
    if(argv.file && argv.file!==true) {
        data.file = argv.file;
        if(!quiet) console.log(chalk.cyanBright("Fatch") + " : " + chalk.greenBright(data.file));
        needle.post(HOST, data, function(err, res) {
            if(!err) {
                if(res.body.r) {
                    if(!quiet) {
                        if(res.body.r=="e") {
                            console.log(chalk.redBright("Invalid command."));
                        } else {
                            console.log(chalk.red(JSON.stringify(res.body)));
                        }
                    }
                } else {
                    // success
                    let savefile = argv.file;
                    if(argv.save && argv.save!==true) {
                        savefile = argv.save;
                        argv.save = true;
                    }
                    else
                    if(argv.s===true && argv.a===true && argv.v===true && argv.e===true) {
                        argv.save = true;
                    }

                    if(argv.open) {
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
                            if(!quiet) console.log(chalk.cyanBright("Save") + " : %s",
                                chalk.greenBright(
                                    dirname ? (subdir==null ? path.join(dirname, savefile) : path.join(subdir, dirname, savefile)) : (subdir==null ? path.join(savefile) : path.join(subdir, savefile))
                                ));
                            _writeicon(res.body, savefilepath, scale, width, height, subdir, dirname, savefile).then((res, err) => {
                                if(res) {
                                    if(argv.open) {
                                        if(argv.open===true) {
                                            if(!quiet) console.log(chalk.cyanBright("Open it."));
                                            open(savefilepath);
                                        } else {
                                            if(!quiet) console.log(chalk.cyanBright("Open it as " + argv.open));
                                            open(savefilepath, {app: argv.open});
                                        }
                                    }
                                    if(!quiet) console.log(chalk.cyanBright("OK!"));
                                } 
                                if(err) {
                                    if(!quiet) console.log(chalk.red(err));
                                }
                            });
                        } else {
                            if(!quiet) {
                                console.log(res.body);
                                console.log(chalk.greenBright(filesize(res.body.length)) + chalk.green(" (" + res.body.length + ")"));
                            }
                        }    
                    } else {
                        if(fs.existsSync(argv.target + ".json")){
                            // TODO : pre-defined target json file.

                                                        
                        } else 
                        if(argv.target=="android" || argv.target=="ios") {
                            // android type : "drawable", "mipmap"
                            let type = (argv.type!==true ? argv.type : null) || "mipmap";
                            let dpis = ['', 'ldpi', 'mdpi', 'tvdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
                            if(argv.target=='ios') {
                                type = argv.type || null;
                                dpis = ['', '@2x', '@3x'];
                            }
                            let dpi = 0;
                            let target = argv.target;
                            _iconSaveProc(res.body, dir, subdir, savefile, width, height, target, type, dpis, dpi);
                        }
                    }
                }
            } else {
                if(!quiet) console.log(chalk.red(JSON.stringify(err)));
            }
        });
    } else {
        if(!quiet) {
            console.log(chalk.magentaBright("Invalid command."));
        }
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
                if(!quiet) console.log(chalk.red(JSON.stringify(err)));
            } else {
                if(res.body.r=="s" && res.body.d) {
                    // Success
                    if(!quiet) console.log(JSON.stringify(res.body.d));
                } else {
                    if(!quiet) console.log(chalk.red(JSON.stringify(res.body)));
                }
            }
        });
    }
}

const _setenv = (json) => {
    HOST = json.host || HOST;
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
            _version();
            break;
        case 'help':
            _welcome();
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
    if(argv.version) {
        _version();
    } else
    if(argv.help) {
        _welcome();
    } else {
        _welcome();
        _first();
    }
}


