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
const extName = require('ext-name');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const color = require('@appres/color');
const imgclip = require('@appres/imgclip');

const pkg = require('../package.json');

const jsonFile = "appres.json";

let quiet = argv.quiet===true;

let HOST = pkg.api.host;
//let HOST = "http://127.0.0.1:5001/appres-org/us-central1/api";
let PKEY = argv.pkey || "YOUR_PKEY";
let AKEY = argv.akey || "YOUR_AKEY";
let LANG = argv.lang;
let DIR = argv.dir;
let TARGET = argv.target;

let IgnoreVerCheck = argv.IgnoreVerCheck;

const _log = (...args) => {
    if(quiet) return;
    if(args==null) console.log();
    else 
    {
        if(args.length==1) console.log(args[0]);
        if(args.length==2) console.log(args[0],args[1]);
        if(args.length==3) console.log(args[0],args[1],args[2]);
        if(args.length==4) console.log(args[0],args[1],args[2],args[3]);
        if(args.length==5) console.log(args[0],args[1],args[2],args[3],args[4]);
    }
}

// 현재 pkg 버전이 latest 보다 작으면 true 를 내 준다. 즉 업그레이드가 필요하다. null 리턴은 검사 실패. 
const _needlatest = (latest) => {
    let s1 = latest.split(".");
    let s2 = pkg.version.split(".");
    if(s1.length==3 && s2.length==3) {
        if(s1[0]>s2[0]) return true;
        if(s1[0]<s2[0]) return false;
        if(s1[1]>s2[1]) return true;
        if(s1[2]<s2[2]) return false;
        if(s1[2]>s2[2]) return true;
        return false;
    }
    return null;
}

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
        ;
        });
    };
}
const _updatemsg = (current, latest) => {
    _log("");
    _log(chalk.magentaBright("A newer version exists. {0}<{1}. You can update to the latest version using the following command.".format(current, latest)));
    _log("$ " + chalk.greenBright("npm update appres -g"));
    _log("");
    _log(chalk.magentaBright("If you want to ignore the version check, use the following option."));
    _log("$ " + chalk.greenBright("appres {your command and options} --IgnoreVerCheck"));
    _log("");
    _log(chalk.magentaBright("Insert ignore version check option into the appres.json file."));
    _log("$ " + chalk.greenBright("appres init --IgnoreVerCheck true"));
    _log("");
}

const _latest = (chkmode) => {
    let data = {
        cmd: "meta",
        opt: "latest"
    };
    needle.post(HOST, data, function(err, res) {
        if(err) {
            _log(err);
        } else {
            let latest = res.body;
            if(chkmode!==true) _log(chalk.blueBright("Latest") + ":" + chalk.greenBright.bold(latest));
            if(_needlatest(res.body)===true) _updatemsg(pkg.version, latest);
        }
    });
}
const _version = () => {
    _log(chalk.blueBright("Installed") + ":" + chalk.greenBright.bold(pkg.version));
}

const _welcome = () => {
    let welcomeMsg = chalk.white.bold("Welcome to App Resource !!!") + 
        "\n" + 
        chalk.green("v" + pkg.version) +
        "\n" + 
        chalk.cyan("This package use with the appres.org");
        _log(welcomeMsg);
}
const _first = () => {
    _log();

    let msg = "Are you trying to test? First, Initialize the test key using the following command.";
    _log(chalk.whiteBright(msg));

    msg = "$ appres init --pkey GXYqIgrafjTRatwTB96d --akey 39f031e6-94a0-4e14-b600-82779ec899d7";
    _log(chalk.greenBright(msg));

    msg = "In addition, you can obtain a sample icon file with the command.";
    _log(chalk.whiteBright(msg));

    msg = "$ appres icon --file sample.png --save";
    _log(chalk.greenBright(msg));

    _log();

    msg = "Project keys can be created at appres.org";
    _log(chalk.whiteBright(msg));

    _log();
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
            _log(chalk.red(err));
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
    _log(chalk.cyan(" > " + msg));
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

const _saveAsset = (_asset, _file, _scale, _width, _height) => {
    return new Promise((resolve, reject) => {
        jimp.read(_asset).then((jimp, err) => {
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

const _writeAsset = (_asset, _savefilepath, _scale, _width, _height, _subdir, _dirname, _savefile) => {
    return new Promise((resolve, reject) => {
        if(_forcefiledir(_savefilepath)) {
            _saveAsset(_asset, _savefilepath, _scale, _width, _height).then((res, err) => {
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


const _saveAssetProc = (asset, dir, subdir, savefile, width, height, target, type, dpis, dpi) => {
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

    _log(chalk.cyanBright("Save") + " : %s", 
        chalk.greenBright(
            dirname ? (subdir==null ? path.join(dirname, _savefile) : path.join(subdir, dirname, _savefile)) : (subdir==null ? path.join(_savefile) : path.join(subdir, _savefile))
        ));

    let scale = _scale(dpitag);
    _writeAsset(asset, savefilepath, scale, width, height, subdir, dirname, _savefile).then((res, err) => {
        if(res) {
            if(argv.open) {
                if(argv.open===true) {
                    _log(chalk.cyanBright("Open it."));
                    open(savefilepath);
                } else {
                    _log(chalk.cyanBright("Open it as " + argv.open));
                    open(savefilepath, {app: argv.open});
                }
            }
            _log(chalk.cyanBright("OK!"));
            setTimeout(()=>{
                _saveAssetProc(asset, dir, subdir, savefile, width, height, target, type, dpis, dpi+1);            
            },1);    
        }
        if(err) {
            _log(chalk.red(err));
        }
    });
}




const _asset = async() => {
    if(PKEY=="YOUR_PKEY" || AKEY=="YOUR_AKEY") {
        let msg = "You haven't initialize an access key yet.";
        _log(chalk.redBright(msg));
        _log("\n");
        _first();
        return;
    }

    let data = {
        pkey: PKEY,
        akey: AKEY,
        cmd: argv._[0]
    };

    if(argv.console) {
        quiet = true;
    }

    if(argv.file && argv.file!==true) {
        data.file = argv.file;
        _log(chalk.cyanBright("Fetch") + " : " + chalk.greenBright(data.file));
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
                    if(argv.console) {
                        if(argv.console=='bytes') {
                            let bytes = imgclip.bufferToBytes(res.body);
                            console.log(bytes);
                        } else
                        if(argv.console=='array') {
                            let bytes = imgclip.bufferToArray(res.body);
                            console.log(bytes);
                        } else
                        if(argv.console=='base64') {
                            let b64data = imgclip.bufferToBase64(res.body);
                            console.log(b64data);
                        } else
                        if(argv.console=='blob') {
                            let b64data = imgclip.bufferToBase64(res.body);
                            let mime = "png";
                            let ext = extName(argv.file);
                            if(ext && ext.length>0) {
                                mime = ext[0].ext;
                            }
                            console.log("data:image/"+mime+";base64," + b64data);
                        } else {
                            console.log(res.body);
                        }
                    } else {
                        let savefile = argv.file;
                        if(argv.save && argv.save!==true) {
                            savefile = argv.save;
                            argv.save = true;
                        }
                        else
                        if(argv.s===true && argv.a===true && argv.v===true && argv.e===true) {
                            argv.save = true;
                        }

                        if((argv.file && argv.file!==true) || argv.open) {
                            argv.save = true;
                        }

                        let subdir = null;
                        let dir = _getcwd();
                        if(DIR && DIR!==true) {
                            subdir = DIR;
                            argv.save = true;
                            if(path.isAbsolute(DIR)) {
                                dir = DIR;
                            } else {
                                dir = path.join(dir, DIR);
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
                                _writeAsset(res.body, savefilepath, scale, width, height, subdir, dirname, savefile).then((res, err) => {
                                    if(res) {
                                        if(argv.open) {
                                            if(argv.open===true) {
                                                _log(chalk.cyanBright("Open it."));
                                                open(savefilepath);
                                            } else {
                                                _log(chalk.cyanBright("Open it as " + argv.open));
                                                open(savefilepath, {app: argv.open});
                                            }
                                        }
                                        _log(chalk.cyanBright("OK!"));
                                    } 
                                    if(err) {
                                        _log(chalk.red(err));
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
                                _saveAssetProc(res.body, dir, subdir, savefile, width, height, target, type, dpis, dpi);
                            }
                        }
                    }
                }
            } else {
                _log(chalk.red(JSON.stringify(err)));
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
    if(argv.key || argv.str) {
        let data = {
            pkey: PKEY,
            akey: AKEY,
            lang: LANG,
            cmd: argv._[0],
            key: argv.key,
            str: argv.str
        };
        needle.post(HOST, data, function(err, res) {
            if(err) {
                _log(chalk.red(JSON.stringify(err)));
            } else {
                if(res.body.r=="s" && res.body.d) {
                    // Success
                    _log(JSON.stringify(res.body.d, null, 2));
                } else {
                    _log(chalk.red(JSON.stringify(res.body)));
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
    DIR = json.dir;
    TARGET = json.target;
    IgnoreVerCheck = json.IgnoreVerCheck;
}

const _setJson = (json, key, argv, def, nullChk=true) => {
    if(argv[key]!=null) {
        json[key] = argv[key];
    } else 
    if(json[key]==null) {
        json[key] = def;
    }
    if(nullChk && (json[key]=='null' || json[key]===null || json[key]===true || json[key]===false)) {
        delete json[key];
    }
    return json[key];
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
        HOST = _setJson(json, 'host', argv, null) || pkg.api.host;
        PKEY = _setJson(json, 'pkey', argv, PKEY);
        AKEY = _setJson(json, 'akey', argv, AKEY);
        LANG = _setJson(json, 'lang', argv, LANG);
        DIR = _setJson(json, 'dir', argv, DIR);
        TARGET = _setJson(json, 'target', argv, TARGET);

        IgnoreVerCheck = _setJson(json, 'IgnoreVerCheck', argv, IgnoreVerCheck);

        resolve(json);
    });
}

const _langs = async(json) => {
    let data = {
        pkey: PKEY,
        akey: AKEY,
        cmd: "langs"
    };
    needle.post(HOST, data, function(err, res) {
        if(err) {
            _log(chalk.red(JSON.stringify(err)));
        } else {
            if(res.body.r=="s" && res.body.d) {
                // Success
                _log(JSON.stringify(res.body.d, null, 2));
            } else {
                _log(chalk.red(JSON.stringify(res.body)));
            }
        }
    });
}

const _lang = async(json) => {
    let data = {
        pkey: PKEY,
        akey: AKEY,
        cmd: "langs",
        lang: LANG
    };
    needle.post(HOST, data, function(err, res) {
        if(err) {
            _log(chalk.red(JSON.stringify(err)));
        } else {
            if(res.body.r=="s" && res.body.d) {
                // Success
                _log(JSON.stringify(res.body.d, null, 2));
            } else {
                _log(chalk.red(JSON.stringify(res.body)));
            }
        }
    });
}

const _init = async(json) => {
    fs.writeFile(jsonFile, JSON.stringify(json, null, 2), (err) => {
        if(err) {
            _log(chalk.red(err));
        } else {
            _log(chalk.blueBright("Initialize : %s"), chalk.greenBright(jsonFile));
            _log(chalk.blueBright("appres.json:\n%s"), chalk.greenBright(JSON.stringify(json, null, 2)));
        }
    });
}

const _main = async() => {
    switch(argv._[0]) {
        case 'init':
            _load((json) => {
                _init(json);
                if(IgnoreVerCheck!="true") _latest(true);
            });
            break;
        case 'version':
            _version();
            _latest();
            break;
        case 'help':
            _welcome();
            break;
        case 'lang':
            _load((json) => {
                _setenv(json);
                _lang(json);
                if(IgnoreVerCheck!="true") _latest(true);
            });
            break;
        case 'langs':
            _load((json) => {
                _setenv(json);
                _langs(json);
                if(IgnoreVerCheck!="true") _latest(true);
            });
            break;
        case 'image':
        case 'icon':
            _load((json) => {
                _setenv(json);
                _asset();
                if(IgnoreVerCheck!="true") _latest(true);
            });
            break;
        case 'string':
        case 'dict':
            _load((json) => {
                _setenv(json);
                _string();
                if(IgnoreVerCheck!="true") _latest(true);
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


