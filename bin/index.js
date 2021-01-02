#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const boxen = require("boxen");
const needle = require('needle');
const mkdirp = require('mkdirp');
const jimp = require('jimp');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const pkg = require('../package.json');
const { number } = require("yargs");

const jsonFile = "appres.json";
const quiet = argv.quiet===true;

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
    if(!quiet) console.log(helperBox);
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
const _rgba = (r, g, b, alpha) => {
    return { r: r, g: g, b: b, alpha: alpha };
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
const _hex2rgba = (hex, alpha) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      alpha: alpha
    } : null;
}
const _rgb2hex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
//_rgba2hex(0xFF00FF7F)
//_rgba2hex(0xFF00FF,0.5)
//_rgba2hex(255,0,255,127)
//_rgba2hex(255,0,255)  => a set to 255
const _rgba2hex = (r, g, b, a) => {
    if(r instanceof Object) {   // json r.g.b with alpha
        a = Math.round(r.alpha*255) || 0;
        b = r.b || 0;
        g = r.g || 0;
        r = r.r || 0;
    }
    else
    if(r!=null && g==null) {    // 0xRRGGBBAA
        return r;
    }
    else
    if(r!=null && g!=null && b==null) {    // 0xRRGGBB, alpha
        a = Math.round(g*255) || 0;
        return r*0x100 + a;
    }
    else
    if(r!=null && g!=null && b!=null && a==null) {
        a = 0xFF;
    }
    return r*0x1000000 + g*0x10000 + b*0x100 + a;
}

const _color = (tag) => {
    let color = tag;
    if(color!=null) {
        if(Number.isInteger(color)) {
            if(color<0x1000000) {
                return tag * 0x100 + 0xFF;
            }
            return color;
        }
        color = color.toLowerCase();
    }

    switch(color) {

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

    return color;    
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

                if(background!=null) {
                    background = _rgba2hex(background);
                    _console_proc("background: 0x" + background.toString(16));
                    jimp = jimp.background(background);
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

    if(!quiet) console.log(chalk.magentaBright("Save") + " : %s", 
        chalk.greenBright(
            dirname ? (subdir==null ? path.join(dirname, _savefile) : path.join(subdir, dirname, _savefile)) : (subdir==null ? path.join(_savefile) : path.join(subdir, _savefile))
        ));

    let scale = _scale(dpitag);
    _writeicon(icon, savefilepath, scale, width, height, subdir, dirname, _savefile).then((res, err) => {
        if(res) {
            if(!quiet) console.log(chalk.cyanBright(" OK!"));
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
            if(!quiet) console.log(chalk.red(err));
        } else {
            if(!quiet) console.log(chalk.blueBright("Initialize %s"), chalk.greenBright(jsonFile));
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

        if(!quiet) console.log(chalk.cyanBright("Fatch") + " : " + chalk.greenBright(data.file));
        needle.post(HOST, data, function(err, res) {
            if(!err) {
                if(res.body.r) {
                    if(!quiet) console.log(JSON.stringify(res.body));
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
                            if(!quiet) console.log(chalk.magentaBright("Save") + " : %s",
                                chalk.greenBright(
                                    dirname ? (subdir==null ? path.join(dirname, savefile) : path.join(subdir, dirname, savefile)) : (subdir==null ? path.join(savefile) : path.join(subdir, savefile))
                                ));
                            _writeicon(res.body, savefilepath, scale, width, height, subdir, dirname, savefile).then((res, err) => {
                                if(res) {
                                    if(!quiet) console.log(chalk.cyanBright(" OK!"));
                                } 
                                if(err) {
                                    if(!quiet) console.log(chalk.red(err));
                                }
                            });
                        } else {
                            if(!quiet) console.log(res.body);
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
            if(!quiet) console.log(pkg.version);
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


