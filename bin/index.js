#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const filesize = require("filesize");
const needle = require('needle');
const mkdirp = require('mkdirp');
const jimp = require('jimp');
const open = require('open');
const progress = require('progress');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const color = require('@appres/color');

const pkg = require('../package.json');

const jsonFile = "appres.json";
const quiet = argv.quiet===true;

let HOST = pkg.api.host;
//let HOST = "http://127.0.0.1:5001/appres-org/us-central1/api";
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

    if(!quiet) console.log();

    let msg = "Are you trying to test? First, Initialize the test key using the following command.";
    if(!quiet) console.log(chalk.whiteBright(msg));

    msg = "$ appres init --pkey GXYqIgrafjTRatwTB96d --akey 39f031e6-94a0-4e14-b600-82779ec899d7";
    if(!quiet) console.log(chalk.greenBright(msg));

    msg = "In addition, you can obtain a sample icon file with the command.";
    if(!quiet) console.log(chalk.whiteBright(msg));

    msg = "$ appres icon --file sample.png --save";
    if(!quiet) console.log(chalk.greenBright(msg));

    if(!quiet) console.log();

    msg = "Project keys can be created at appres.org";
    if(!quiet) console.log(chalk.whiteBright(msg));

    if(!quiet) console.log();
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

function fillChar(str, width, ch) {
    if(ch==null) ch = '0';
    return str.length >= width ? str:new Array(width-str.length+1).join(ch)+str; //남는 길이만큼 ch 으로 채움
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
                let background = color.val ? color.val(argv.background) : color.hex(argv.background);
                let overlay = color.val ? color.val(argv.overlay) : color.hex(argv.overlay);

                if(overlay && overlay!==true) {
                    if(jimp.hasAlpha()) {
                        let _overlay = fillChar(overlay.toString(16), 8);
                        _console_proc("overlay: 0x" + _overlay);
                        overlay = color.json("#" + _overlay);
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
                        background = color.json("#" + _background);
                        if(background!=null) {
                            jimp.scan(0, 0, jimp.bitmap.width, jimp.bitmap.height, (x, y, idx) => {
                                if(jimp.bitmap.data[idx+3]===0) {
                                    jimp.bitmap.data[idx] = background.r;
                                    jimp.bitmap.data[idx+1] = background.g;
                                    jimp.bitmap.data[idx+2] = background.b;
                                    jimp.bitmap.data[idx+3] = background.a;                            
                                }
                            });    
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

    if(argv.file && argv.file!==true) {
        data.file = argv.file;
        if(!quiet) console.log(chalk.cyanBright("Fetch") + " : " + chalk.greenBright(data.file));
        let readable = needle.post(HOST, data, function(err, res) {
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
                            if(!quiet) {
                                console.log(chalk.cyanBright("Save") + " : %s",
                                    chalk.greenBright(
                                        dirname ? (subdir==null ? path.join(dirname, savefile) : path.join(subdir, dirname, savefile)) : (subdir==null ? path.join(savefile) : path.join(subdir, savefile))
                                    ));
                            }
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
        if(!quiet) {
            readable.on('response', (res) => {
                var len = parseInt(res.headers['content-length'], 10);             
                console.log();
                console.log("  " + chalk.greenBright(filesize(len)) + chalk.green(" (" + len + ")"));
                var bar = new progress(' [:bar] :rate/bps :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 40,
                    total: len
                    });
                readable.on('data', (chunk) => {
                    bar.tick(chunk.length);
                });
                readable.on('end', () => {
                    console.log();
                });        
            });
    
        }
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
        case 'image':
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


