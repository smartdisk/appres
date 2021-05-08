#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const filesize = require("filesize");
const needle = require('needle');
const mkdirp = require('mkdirp');
const Jimp = require('jimp');
const open = require('open');
const progress = require('progress');
const extName = require('ext-name');

const inquirer = require('inquirer');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const color = require('@appres/color');
const imgclip = require('@appres/imgclip');

const pkg = require('../package.json');
const { Console } = require("console");

const oldJsonFile = "appres.json";
const jsonFile = ".appres.json";

let quiet = argv.quiet===true;

let HOST = pkg.api.host;
let PKEY = argv.pkey || "YOUR_PKEY";
let AKEY = argv.akey || "YOUR_AKEY";
let LANG = argv.lang;
let DIR = argv.dir;
let TARGET = argv.target;

let CMD = null;
let FILE = null;

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

const _err = (...args) => {
    if(quiet) return;
    if(args==null) console.log();
    else 
    {
        if(args.length==1) console.log(chalk.redBright(args[0]));
        if(args.length==2) console.log(chalk.redBright(args[0]),chalk.redBright(args[1]));
        if(args.length==3) console.log(chalk.redBright(args[0]),chalk.redBright(args[1]),chalk.redBright(args[2]));
        if(args.length==4) console.log(chalk.redBright(args[0]),chalk.redBright(args[1]),chalk.redBright(args[2]),chalk.redBright(args[3]));
        if(args.length==5) console.log(chalk.redBright(args[0]),chalk.redBright(args[1]),chalk.redBright(args[2]),chalk.redBright(args[3]),chalk.redBright(args[4]));
    }
}

const _debug = (...args) => {
    if(quiet) return;
    if(args==null) console.log();
    else 
    {
        if(args.length==1) console.log(chalk.greenBright(args[0]));
        if(args.length==2) console.log(chalk.greenBright(args[0]),chalk.greenBright(args[1]));
        if(args.length==3) console.log(chalk.greenBright(args[0]),chalk.greenBright(args[1]),chalk.greenBright(args[2]));
        if(args.length==4) console.log(chalk.greenBright(args[0]),chalk.greenBright(args[1]),chalk.greenBright(args[2]),chalk.greenBright(args[3]));
        if(args.length==5) console.log(chalk.greenBright(args[0]),chalk.greenBright(args[1]),chalk.greenBright(args[2]),chalk.greenBright(args[3]),chalk.greenBright(args[4]));
    }
}

const _info = (...args) => {
    if(quiet) return;
    if(args==null) console.log();
    else 
    {
        if(args.length==1) console.log(chalk.cyanBright(args[0]));
        if(args.length==2) console.log(chalk.cyanBright(args[0]),chalk.cyanBright(args[1]));
        if(args.length==3) console.log(chalk.cyanBright(args[0]),chalk.cyanBright(args[1]),chalk.cyanBright(args[2]));
        if(args.length==4) console.log(chalk.cyanBright(args[0]),chalk.cyanBright(args[1]),chalk.cyanBright(args[2]),chalk.cyanBright(args[3]));
        if(args.length==5) console.log(chalk.cyanBright(args[0]),chalk.cyanBright(args[1]),chalk.cyanBright(args[2]),chalk.cyanBright(args[3]),chalk.cyanBright(args[4]));
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
    _log(chalk.magentaBright("A newer version available! {0}->{1}").format(current, latest)); 
    _log(chalk.magentaBright("You can update to the latest version using the following command."));
    _log("$ " + chalk.greenBright("npm update appres -g"));
    _log("");
    _log(chalk.magentaBright("If you want to ignore the version check, use the following option."));
    _log("$ " + chalk.greenBright("appres {your command and options} --IgnoreVerCheck"));
    _log("");
    _log(chalk.magentaBright("Insert ignore version check option into the .appres.json file."));
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

const _isCwdName = (name) => {
    return path.basename(_getcwd())===name;
}
const _hasParentsName = (name, dir) => {
    if(dir==null) dir = _getcwd();
    if(path.basename(dir)===name) return true;

    let pd = path.dirname(dir);
    if(pd==='/' || pd===dir) return false;

    return _hasParentsName(name, pd);
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
const _assetsSize = (size, scale) => {
    if(size==null) return null;

    let sizes = size.split("x");
    if(sizes.length==1) {
        sizes = [sizes[0], sizes[0]];
    } else
    if(sizes.length!=2) return null;    

    if(sizes) {
        let scales = null;
        if(scale) scales = scale.split("x");
        if(scales && scales.length>0) {
            sizes[0] *= scales[0];
            sizes[1] *= scales[0];
        }    
    }
    return sizes;
}
const _xcassets = (target, type) => {
    if(target) target = target.toLowerCase();
    if(type) type = type.toLowerCase();
    let kind = (type==null) ? target : target + "." + type;
    switch(kind) {
        case 'macos.iconset':
        case 'ios.iconset':
        case 'watch.iconset':
            return {
                "images" : [
                    {
                        "scale" : "1x",
                        "size"  : "16x16",
                        "idiom" : "universal",
                        "filename" : "icon_16x16.png"
                    },
                    {
                        "scale" : "2x",
                        "size"  : "16x16",
                        "idiom" : "universal",
                        "filename" : "icon_16x16.png"
                    },
                    {
                        "scale" : "1x",
                        "size"  : "32x32",
                        "idiom" : "universal",
                        "filename" : "icon_32x32.png"
                    },
                    {
                        "scale" : "2x",
                        "size"  : "32x32",
                        "idiom" : "universal",
                        "filename" : "icon_32x32.png"
                    },
                    {
                        "scale" : "1x",
                        "size"  : "128x128",
                        "idiom" : "universal",
                        "filename" : "icon_128x128.png"
                    },
                    {
                        "scale" : "2x",
                        "size"  : "128x128",
                        "idiom" : "universal",
                        "filename" : "icon_128x128.png"
                    },
                    {
                        "scale" : "1x",
                        "size"  : "256x256",
                        "idiom" : "universal",
                        "filename" : "icon_256x256.png"
                    },
                    {
                        "scale" : "2x",
                        "size"  : "256x256",
                        "idiom" : "universal",
                        "filename" : "icon_256x256.png"
                    },
                    {
                        "scale" : "1x",
                        "size"  : "512x512",
                        "idiom" : "universal",
                        "filename" : "icon_512x512.png"
                    },
                    {
                        "scale" : "2x",
                        "size"  : "512x512",
                        "idiom" : "universal",
                        "filename" : "icon_512x512.png"
                    }
                ],
                "info" : {
                "author" : "xcode",
                "version" : 1
                }
            };
        case 'ios.imageset':
        case 'macos.imageset':
        case 'watch.imageset':
            return {
                "images" : [
                    {
                        "scale" : "1x",
                        "idiom" : "universal"
                    },
                    {
                        "scale" : "2x",
                        "idiom" : "universal"
                    },
                    {
                        "scale" : "3x",
                        "idiom" : "universal"
                    }
                ],
                "info" : {
                "author" : "xcode",
                "version" : 1
                }
            };
        case 'circular.imageset':
            return {
                "images" : [
                {
                    "screen-width" : "<=145",
                    "scale" : "2x",
                    "size" : "16x16",
                    "idiom" : "watch",
                    "filename" : "circular38mm@2x.png"
                },
                {
                    "screen-width" : ">161",
                    "scale" : "2x",
                    "size" : "18x18",
                    "idiom" : "watch",
                    "filename" : "circular40mm@2x.png"
                },
                {
                    "screen-width" : ">145",
                    "scale" : "2x",
                    "size" : "18x18",
                    "idiom" : "watch",
                    "filename" : "circular42mm@2x.png"
                },
                {
                    "screen-width" : ">183",
                    "scale" : "2x",
                    "size" : "20x20",
                    "idiom" : "watch",
                    "filename" : "circular44mm@2x.png"
                }
                ],
                "info" : {
                "author" : "xcode",
                "version" : 1
                }
            };
        case 'extra large.imageset':
            return {
                "images" : [
                    {
                      "screen-width" : "<=145",
                      "scale" : "2x",
                      "size" : "91x91",
                      "idiom" : "watch",
                      "filename" : "extra-large38mm@2x.png"
                    },
                    {
                      "screen-width" : ">161",
                      "scale" : "2x",
                      "size" : "101.5x101.5",
                      "idiom" : "watch",
                      "filename" : "extra-large40mm@2x.png"
                    },
                    {
                      "screen-width" : ">145",
                      "scale" : "2x",
                      "size" : "101.5x101.5",
                      "idiom" : "watch",
                      "filename" : "extra-large42mm@2x.png"
                    },
                    {
                      "screen-width" : ">183",
                      "scale" : "2x",
                      "size" : "112x112",
                      "idiom" : "watch",
                      "filename" : "extra-large44mm@2x.png"
                    }
                  ],
                  "info" : {
                    "author" : "xcode",
                    "version" : 1
                  }                
            };
        case 'graphic bezel.imageset':
            return {
                "info" : {
                    "author" : "xcode",
                    "version" : 1
                  },
                  "images" : [
                    {
                      "screen-width" : ">161",
                      "scale" : "2x",
                      "size" : "42x42",
                      "idiom" : "watch",
                      "filename" : "graphic-bezel40mm@2x.png"
                    },
                    {
                      "screen-width" : ">183",
                      "scale" : "2x",
                      "size" : "47x47",
                      "idiom" : "watch",
                      "filename" : "graphic-bezel44mm@2x.png"
                    }
                  ]                
            };
        case 'graphic circular.imageset':
            return {
                "info" : {
                  "author" : "xcode",
                  "version" : 1
                },
                "images" : [
                  {
                    "screen-width" : ">161",
                    "scale" : "2x",
                    "size" : "42x42",
                    "idiom" : "watch",
                    "filename" : "graphic-circular40mm@2x.png"
                  },
                  {
                    "screen-width" : ">183",
                    "scale" : "2x",
                    "size" : "47x47",
                    "idiom" : "watch",
                    "filename" : "graphic-circular44mm@2x.png"
                  }
                ]
            };
        case 'graphic corner.imageset':
            return {
                "info" : {
                  "author" : "xcode",
                  "version" : 1
                },
                "images" : [
                  {
                    "screen-width" : ">161",
                    "scale" : "2x",
                    "size" : "42x42",
                    "idiom" : "watch",
                    "filename" : "graphic-corner40mm@2x.png",
                  },
                  {
                    "screen-width" : ">183",
                    "scale" : "2x",
                    "size" : "47x47",
                    "idiom" : "watch",
                    "filename" : "graphic-corner44mm@2x.png"
                  }
                ]
            };
        case 'graphic extra large.imageset':
            return {
                "info" : {
                  "author" : "xcode",
                  "version" : 1
                },
                "images" : [
                  {
                    "screen-width" : "<=145",
                    "scale" : "2x",
                    "size" : "103x103",
                    "idiom" : "watch",
                    "filename" : "graphic-extra-large38mm@2x.png"
                  },
                  {
                    "screen-width" : ">161",
                    "scale" : "2x",
                    "size" : "120x120",
                    "idiom" : "watch",
                    "filename" : "graphic-extra-large40mm@2x.png"
                  },
                  {
                    "screen-width" : ">145",
                    "scale" : "2x",
                    "size" : "120x120",
                    "idiom" : "watch",
                    "filename" : "graphic-extra-large42mm@2x.png"
                  },
                  {
                    "screen-width" : ">183",
                    "scale" : "2x",
                    "size" : "132x132",
                    "idiom" : "watch",
                    "filename" : "graphic-extra-large44mm@2x.png"
                  }
                ]
            };
        case 'graphic large rectangular.imageset':
            return {
                "images" : [
                  {
                    "screen-width" : ">161",
                    "scale" : "2x",
                    "size" : "150x47",
                    "idiom" : "watch",
                    "filename" : "graphic-large-rectangular40mm@2x.png"
                  },
                  {
                    "screen-width" : ">183",
                    "scale" : "2x",
                    "size" : "171x54",
                    "idiom" : "watch",
                    "filename" : "graphic-large-rectangular44mm@2x.png"
                  }
                ],
                "info" : {
                  "author" : "xcode",
                  "version" : 1
                }
            };
        case 'modular.imageset':
            return {
                "info" : {
                  "author" : "xcode",
                  "version" : 1
                },
                "images" : [
                  {
                    "screen-width" : "<=145",
                    "scale" : "2x",
                    "size" : "26x26",
                    "idiom" : "watch",
                    "filename" : "modular38mm@2x.png"
                  },
                  {
                    "screen-width" : ">161",
                    "scale" : "2x",
                    "size" : "29x29",
                    "idiom" : "watch",
                    "filename" : "modular40mm@2x.png"
                  },
                  {
                    "screen-width" : ">145",
                    "scale" : "2x",
                    "size" : "29x29",
                    "idiom" : "watch",
                    "filename" : "modular42mm@2x.png"
                  },
                  {
                    "screen-width" : ">183",
                    "scale" : "2x",
                    "size" : "32x32",
                    "idiom" : "watch",
                    "filename" : "modular44mm@2x.png"
                  }
                ]
            };
        case 'utilitarian.imageset':
            return {
                "info" : {
                  "author" : "xcode",
                  "version" : 1
                },
                "images" : [
                  {
                    "screen-width" : "<=145",
                    "scale" : "2x",
                    "size" : "20x20",
                    "idiom" : "watch",
                    "filename" : "utility38mm@2x.png"
                  },
                  {
                    "screen-width" : ">161",
                    "scale" : "2x",
                    "size" : "22x22",
                    "idiom" : "watch",
                    "filename" : "utility40mm@2x.png"
                  },
                  {
                    "screen-width" : ">145",
                    "scale" : "2x",
                    "size" : "22x22",
                    "idiom" : "watch",
                    "filename" : "utility42mm@2x.png"
                  },
                  {
                    "screen-width" : ">183",
                    "scale" : "2x",
                    "size" : "25x25",
                    "idiom" : "watch",
                    "filename" : "utility44mm@2x.png"
                  }
                ]
            };
        case 'watchos.complicationset':
            return {
                "info" : {
                  "author" : "xcode",
                  "version" : 1
                },
                "assets" : [
                  {
                    "role" : "circular",
                    "idiom" : "watch",
                    "filename" : "Circular.imageset"
                  },
                  {
                    "idiom" : "watch",
                    "role" : "modular",
                    "filename" : "Modular.imageset"
                  },
                  {
                    "role" : "utilitarian",
                    "idiom" : "watch",
                    "filename" : "Utilitarian.imageset"
                  },
                  {
                    "idiom" : "watch",
                    "filename" : "Extra Large.imageset",
                    "role" : "extra-large"
                  },
                  {
                    "role" : "graphic-corner",
                    "idiom" : "watch",
                    "filename" : "Graphic Corner.imageset"
                  },
                  {
                    "role" : "graphic-circular",
                    "filename" : "Graphic Circular.imageset",
                    "idiom" : "watch"
                  },
                  {
                    "role" : "graphic-bezel",
                    "filename" : "Graphic Bezel.imageset",
                    "idiom" : "watch"
                  },
                  {
                    "filename" : "Graphic Large Rectangular.imageset",
                    "role" : "graphic-large-rectangular",
                    "idiom" : "watch"
                  },
                  {
                    "idiom" : "watch",
                    "filename" : "Graphic Extra Large.imageset",
                    "role" : "graphic-extra-large"
                  }
                ]
              };
        case 'watchos.appiconset':
            return {
                "images" : [
                {
                    "idiom" : "watch",
                    "role" : "notificationCenter",
                    "scale" : "2x",
                    "size" : "24x24",
                    "subtype" : "38mm"
                },
                {
                    "idiom" : "watch",
                    "role" : "notificationCenter",
                    "scale" : "2x",
                    "size" : "27.5x27.5",
                    "subtype" : "42mm"
                },
                {
                    "idiom" : "watch",
                    "role" : "companionSettings",
                    "scale" : "2x",
                    "size" : "29x29"
                },
                {
                    "idiom" : "watch",
                    "role" : "companionSettings",
                    "scale" : "3x",
                    "size" : "29x29"
                },
                {
                    "idiom" : "watch",
                    "role" : "appLauncher",
                    "scale" : "2x",
                    "size" : "40x40",
                    "subtype" : "38mm"
                },
                {
                    "idiom" : "watch",
                    "role" : "appLauncher",
                    "scale" : "2x",
                    "size" : "44x44",
                    "subtype" : "40mm"
                },
                {
                    "idiom" : "watch",
                    "role" : "appLauncher",
                    "scale" : "2x",
                    "size" : "50x50",
                    "subtype" : "44mm"
                },
                {
                    "idiom" : "watch",
                    "role" : "quickLook",
                    "scale" : "2x",
                    "size" : "86x86",
                    "subtype" : "38mm"
                },
                {
                    "idiom" : "watch",
                    "role" : "quickLook",
                    "scale" : "2x",
                    "size" : "98x98",
                    "subtype" : "42mm"
                },
                {
                    "idiom" : "watch",
                    "role" : "quickLook",
                    "scale" : "2x",
                    "size" : "108x108",
                    "subtype" : "44mm"
                },
                {
                    "idiom" : "watch-marketing",
                    "scale" : "1x",
                    "size" : "1024x1024"
                }
                ],
                "info" : {
                "author" : "xcode",
                "version" : 1
                }
            }
          
        case 'macos.sidebariconset':
            return {
                "images" : [
                {
                    "idiom" : "universal",
                    "scale" : "1x",
                    "size" : "16x16"
                },
                {
                    "idiom" : "universal",
                    "scale" : "2x",
                    "size" : "16x16"
                },
                {
                    "idiom" : "universal",
                    "scale" : "1x",
                    "size" : "18x18"
                },
                {
                    "idiom" : "universal",
                    "scale" : "2x",
                    "size" : "18x18"
                },
                {
                    "idiom" : "universal",
                    "scale" : "1x",
                    "size" : "24x24"
                },
                {
                    "idiom" : "universal",
                    "scale" : "2x",
                    "size" : "24x24"
                },
                {
                    "idiom" : "universal",
                    "scale" : "1x",
                    "size" : "32x32"
                },
                {
                    "idiom" : "universal",
                    "scale" : "2x",
                    "size" : "32x32"
                }
                ],
                "info" : {
                "author" : "xcode",
                "version" : 1
                }
            };
          
        case 'macos.iconbadgeset':
            return {
                "images" : [
                {
                    "idiom" : "universal",
                    "scale" : "1x",
                    "size" : "7x7"
                },
                {
                    "idiom" : "universal",
                    "scale" : "2x",
                    "size" : "7x7"
                },
                {
                    "idiom" : "universal",
                    "scale" : "3x",
                    "size" : "7x7"
                },
                {
                    "idiom" : "universal",
                    "scale" : "1x",
                    "size" : "11x11"
                },
                {
                    "idiom" : "universal",
                    "scale" : "2x",
                    "size" : "11x11"
                },
                {
                    "idiom" : "universal",
                    "scale" : "3x",
                    "size" : "11x11"
                },
                {
                    "idiom" : "universal",
                    "scale" : "1x",
                    "size" : "24x24"
                },
                {
                    "idiom" : "universal",
                    "scale" : "2x",
                    "size" : "24x24"
                },
                {
                    "idiom" : "universal",
                    "scale" : "3x",
                    "size" : "24x24"
                },
                {
                    "idiom" : "universal",
                    "scale" : "1x",
                    "size" : "50x50"
                },
                {
                    "idiom" : "universal",
                    "scale" : "2x",
                    "size" : "50x50"
                },
                {
                    "idiom" : "universal",
                    "scale" : "3x",
                    "size" : "50x50"
                },
                {
                    "idiom" : "universal",
                    "scale" : "1x",
                    "size" : "100x100"
                },
                {
                    "idiom" : "universal",
                    "scale" : "2x",
                    "size" : "100x100"
                },
                {
                    "idiom" : "universal",
                    "scale" : "3x",
                    "size" : "100x100"
                }
                ],
                "info" : {
                "author" : "xcode",
                "version" : 1
                }
            };
          
        case 'macos.iconset':
            return {
                "images" : [
                  {
                    "scale" : "1x",
                    "size" : "16x16"
                  },
                  {
                    "scale" : "2x",
                    "size" : "16x16"
                  },
                  {
                    "scale" : "1x",
                    "size" : "32x32"
                  },
                  {
                    "scale" : "2x",
                    "size" : "32x32"
                  },
                  {
                    "scale" : "1x",
                    "size" : "128x128"
                  },
                  {
                    "scale" : "2x",
                    "size" : "128x128"
                  },
                  {
                    "scale" : "1x",
                    "size" : "256x256"
                  },
                  {
                    "scale" : "2x",
                    "size" : "256x256"
                  },
                  {
                    "scale" : "1x",
                    "size" : "512x512"
                  },
                  {
                    "scale" : "2x",
                    "size" : "512x512"
                  }
                ],
                "info" : {
                  "author" : "xcode",
                  "version" : 1
                }
              };

        case 'ios.stickersiconset':
            return {
                "images" : [
                {
                    "idiom" : "iphone",
                    "scale" : "2x",
                    "size" : "29x29"
                },
                {
                    "idiom" : "iphone",
                    "scale" : "3x",
                    "size" : "29x29"
                },
                {
                    "idiom" : "iphone",
                    "scale" : "2x",
                    "size" : "60x45"
                },
                {
                    "idiom" : "iphone",
                    "scale" : "3x",
                    "size" : "60x45"
                },
                {
                    "idiom" : "ipad",
                    "scale" : "2x",
                    "size" : "29x29"
                },
                {
                    "idiom" : "ipad",
                    "scale" : "2x",
                    "size" : "67x50"
                },
                {
                    "idiom" : "ipad",
                    "scale" : "2x",
                    "size" : "74x55"
                },
                {
                    "idiom" : "ios-marketing",
                    "scale" : "1x",
                    "size" : "1024x1024"
                },
                {
                    "idiom" : "universal",
                    "platform" : "ios",
                    "scale" : "2x",
                    "size" : "27x20"
                },
                {
                    "idiom" : "universal",
                    "platform" : "ios",
                    "scale" : "3x",
                    "size" : "27x20"
                },
                {
                    "idiom" : "universal",
                    "platform" : "ios",
                    "scale" : "2x",
                    "size" : "32x24"
                },
                {
                    "idiom" : "universal",
                    "platform" : "ios",
                    "scale" : "3x",
                    "size" : "32x24"
                },
                {
                    "idiom" : "ios-marketing",
                    "platform" : "ios",
                    "scale" : "1x",
                    "size" : "1024x768"
                }
                ],
                "info" : {
                "author" : "xcode",
                "version" : 1
                }
            };
          
        case 'macos.appiconset':
            return {
                "images" : [
                  {
                    "idiom" : "mac",
                    "scale" : "1x",
                    "size" : "16x16"
                  },
                  {
                    "idiom" : "mac",
                    "scale" : "2x",
                    "size" : "16x16"
                  },
                  {
                    "idiom" : "mac",
                    "scale" : "1x",
                    "size" : "32x32"
                  },
                  {
                    "idiom" : "mac",
                    "scale" : "2x",
                    "size" : "32x32"
                  },
                  {
                    "idiom" : "mac",
                    "scale" : "1x",
                    "size" : "128x128"
                  },
                  {
                    "idiom" : "mac",
                    "scale" : "2x",
                    "size" : "128x128"
                  },
                  {
                    "idiom" : "mac",
                    "scale" : "1x",
                    "size" : "256x256"
                  },
                  {
                    "idiom" : "mac",
                    "scale" : "2x",
                    "size" : "256x256"
                  },
                  {
                    "idiom" : "mac",
                    "scale" : "1x",
                    "size" : "512x512"
                  },
                  {
                    "idiom" : "mac",
                    "scale" : "2x",
                    "size" : "512x512"
                  }
                ],
                "info" : {
                  "author" : "xcode",
                  "version" : 1
                }
              };

        case 'ios.appiconset':
            return {
                "images" : [
                  {
                    "idiom" : "iphone",
                    "scale" : "2x",
                    "size" : "20x20"
                  },
                  {
                    "idiom" : "iphone",
                    "scale" : "3x",
                    "size" : "20x20"
                  },
                  {
                    "idiom" : "iphone",
                    "scale" : "2x",
                    "size" : "29x29"
                  },
                  {
                    "idiom" : "iphone",
                    "scale" : "3x",
                    "size" : "29x29"
                  },
                  {
                    "idiom" : "iphone",
                    "scale" : "2x",
                    "size" : "40x40"
                  },
                  {
                    "idiom" : "iphone",
                    "scale" : "3x",
                    "size" : "40x40"
                  },
                  {
                    "idiom" : "iphone",
                    "scale" : "2x",
                    "size" : "60x60"
                  },
                  {
                    "idiom" : "iphone",
                    "scale" : "3x",
                    "size" : "60x60"
                  },
                  {
                    "idiom" : "ipad",
                    "scale" : "1x",
                    "size" : "20x20"
                  },
                  {
                    "idiom" : "ipad",
                    "scale" : "2x",
                    "size" : "20x20"
                  },
                  {
                    "idiom" : "ipad",
                    "scale" : "1x",
                    "size" : "29x29"
                  },
                  {
                    "idiom" : "ipad",
                    "scale" : "2x",
                    "size" : "29x29"
                  },
                  {
                    "idiom" : "ipad",
                    "scale" : "1x",
                    "size" : "40x40"
                  },
                  {
                    "idiom" : "ipad",
                    "scale" : "2x",
                    "size" : "40x40"
                  },
                  {
                    "idiom" : "ipad",
                    "scale" : "1x",
                    "size" : "76x76"
                  },
                  {
                    "idiom" : "ipad",
                    "scale" : "2x",
                    "size" : "76x76"
                  },
                  {
                    "idiom" : "ipad",
                    "scale" : "2x",
                    "size" : "83.5x83.5"
                  },
                  {
                    "idiom" : "ios-marketing",
                    "scale" : "1x",
                    "size" : "1024x1024"
                  },
                  {
                    "idiom" : "car",
                    "scale" : "2x",
                    "size" : "60x60"
                  },
                  {
                    "idiom" : "car",
                    "scale" : "3x",
                    "size" : "60x60"
                  }
                ],
                "info" : {
                  "author" : "xcode",
                  "version" : 1
                }
              };
    }
    return {};
}

function isAppleOS(name) {
    return name==="ios" || name==="macos" || name==="watchos";
}


function fillChar(str, width, ch) {
    if(ch==null) ch = '0';
    return str.length >= width ? str:new Array(width-str.length+1).join(ch)+str; //남는 길이만큼 ch 으로 채움
}

function replaceAll(str, s, r) {
    return str.split(s).join(r);
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

const _saveAsset = (_asset, _file, _scale, _width, _height, quietly) => {
    return new Promise((resolve, reject) => {
        Jimp.read(_asset).then((jimp, err) => {
            if(jimp) {
                let width = jimp.getWidth();
                let height = jimp.getHeight();
                let newsize = _newsize(width, height, _scale, _width, _height);
                let background = color.val ? color.val(argv.background) : color.hex(argv.background);
                let overlay = color.val ? color.val(argv.overlay) : color.hex(argv.overlay);

                if(overlay && overlay!==true) {
                    if(jimp.hasAlpha()) {
                        let _overlay = fillChar(overlay.toString(16), 8);
                        if(!quietly) _console_proc("overlay: 0x" + _overlay);
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
                            if(!quietly) _console_proc("overlay: " + chalk.red("Was canceled. Color is invalid."));
                        }
                    } else {
                        if(!quietly) _console_proc("overlay: " + chalk.red("Was canceled. No alpha channel."));
                    }
                }
                
                if(background!=null) {
                    let _background = fillChar(background.toString(16), 8);
                    if(!quietly) _console_proc("background: 0x" + _background);
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
                            if(!quietly) _console_proc("background: " + chalk.red("Was canceled. Color is invalid."));
                        }
                    } else {
                        if(!quietly) _console_proc("background: " + chalk.red("Was canceled. No alpha channel."));
                    }
                }
                if(argv.crop) {
                    if(!quietly) _console_proc("crop");
                    jimp = jimp.autocrop();
                }
                if(argv.flip || argv.mirror) {
                    if(!quiet) {
                        if(argv.flip===true && !quietly) _console_proc("flip");
                        if(argv.mirror===true && !quietly) _console_proc("mirror");
                    }
                    jimp = jimp.flip(argv.mirror===true, argv.flip===true);
                }
                if(argv.grayscale) {
                    if(!quietly) _console_proc("grayscale");
                    jimp = jimp.grayscale();
                }
                if(argv.sepia) {
                    if(!quietly) _console_proc("sepia");
                    jimp = jimp.sepia();
                }

                if(argv.contrast) {
                    argv.contrast = argv.contrast===true ? 0.2 : 1.0 * argv.contrast;
                    if(argv.contrast>=-1.0 && argv.contrast<=1.0) {
                        if(!quietly) _console_proc("contrast: " + argv.contrast);
                        jimp = jimp.contrast(argv.contrast);
                    }
                }
                if(argv.brightness) {
                    argv.brightness = argv.brightness===true ? 0.2 : 1.0 * argv.brightness;
                    if(argv.brightness>=-1.0 && argv.brightness<=1.0) {
                        if(!quietly) _console_proc("brightness: " + argv.brightness);
                        jimp = jimp.brightness(argv.brightness);
                    }
                }
                
                if(argv.invert) {
                    if(!quietly) _console_proc("invert");
                    jimp = jimp.invert();
                }
                if(argv.blur) {
                    argv.blur = argv.blur===true ? 5 : 1 * argv.blur;
                    if(argv.blur>0) {
                        if(!quietly) _console_proc("blur: " + argv.blur);
                        jimp = jimp.blur(argv.blur);    
                    }
                }
                if(argv.gaussian) {
                    argv.gaussian = argv.gaussian===true ? 1 : 1 * argv.gaussian;
                    if(argv.gaussian>0) {
                        if(!quietly) _console_proc("gaussian: " + argv.gaussian);
                        jimp = jimp.gaussian(argv.gaussian);    
                    }
                }
                if(argv.opacity) {
                    argv.opacity = argv.opacity===true ? 0.5 : 1.0 * argv.opacity;
                    if(argv.opacity>=0 && argv.opacity<1.0) {
                        if(!quietly) _console_proc("opacity: " + argv.opacity);
                        jimp = jimp.opacity(argv.opacity);    
                    }
                }
                if(argv.rotate && argv.rotate!==true && argv.rotate!=0) {
                    if(!quietly) _console_proc("rotate: " + argv.rotate);
                    jimp = jimp.rotate(argv.rotate);
                }

                let padding = 0;
                if(argv.padding && argv.padding!==true && argv.padding>0) {
                    padding = argv.padding;
                }

                let user_width = newsize.width;
                let user_height = newsize.height;

                if((width!=newsize.width || height!=newsize.height) && newsize.width>0 && newsize.height>0) {
                    if(!quietly) _console_proc("resize: " + newsize.width + "," + newsize.height);
                    if(padding>0) {
                        let padding_width = newsize.width - padding * 2;
                        let padding_height = newsize.height - padding * 2;
                        if(padding_width>0 && padding_height>0) {
                            newsize.width = padding_width;
                            newsize.height = padding_height;
                        } else {
                            padding = 0;
                            if(!quietly) _console_proc("padding: " + chalk.yellowBright("The padding is too large.") + " " + chalk.redBright("Ignored"));
                        }
                    }
                    jimp = jimp.contain(newsize.width, newsize.height);
                }
                if(padding>0) {
                    if(!quietly) _console_proc("padding: " + argv.padding);
                    let jimp_padding = new Jimp(user_width, user_height, function (err, image) {

                    });
                    jimp_padding.blit(jimp, padding, padding);
                    jimp = jimp_padding;
                }


                if(argv.scale) {
                    if(argv.scale===true) argv.scale = 1.0;
                    else argv.scale *= 1.0;

                    if(argv.scale>0) {
                        if(!quietly) _console_proc("scale: " + argv.scale);
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

const _writeAsset = (_asset, _savefilepath, _scale, _width, _height, _subdir, _dirname, _savefile, quietly) => {
    return new Promise((resolve, reject) => {
        if(_forcefiledir(_savefilepath)) {
            _saveAsset(_asset, _savefilepath, _scale, _width, _height, quietly).then((res, err) => {
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


const _saveAssetProc = (asset, dir, subdir, savefile, width, height, target, type, dpis, dpi, assets_contents, filename, finish) => {
    if(dpis.length<=dpi) {
        if(finish) {
            finish(filename);
        }
        return;
    }

    let dirname = type;
    let dpitag = dpis[dpi];
    let _savefile = savefile;

    if(typeof dpitag === 'object') {
        let assetSize = _assetsSize(dpitag['size']);
        if(assetSize && isAppleOS(target)) {
            width = assetSize[0];
            height = assetSize[1];

            if(dpitag['scale']=='2x' || dpitag['scale']=='3x') {
                dpitag = "@" + dpitag['scale'];
            } else {
                dpitag = "";
            }

            if(assets_contents && type=="complicationset" && filename) {
                if(_hasParentsName("Assets.xcassets")) {
                    dirname = path.join("Complication", filename);
                } else {
                    dirname = path.join("Assets.xcassets", "Complication", filename);
                }                    
            } else {
                let fname = path.parse(savefile).name;        
                if(_hasParentsName("Assets.xcassets")) {
                    dirname = fname + "." + type;
                } else {
                    dirname = path.join("Assets.xcassets", fname + "." + type);
                }    
            }


            let _filename = null;
            if(assets_contents && assets_contents['images']) {
                _filename = assets_contents['images'][dpi]['filename'];
            }
            if(_filename) {
                _savefile = _filename;
            } else {
                let fw = replaceAll(width, ".", "_");
                let fh = replaceAll(height, ".", "_");
                let sname = path.parse(savefile).name;
                let sext = path.parse(savefile).ext;
                if(width==height) {
                    _savefile = sname + "-" + fw + sext;
                } else {
                    _savefile = sname + "-" + fw + "x" + fh + sext;
                }    
            }
        } else {
            dpitag = "";
        }
    } else {
        if(dpitag!='' && target=="android") {
            if(type) {
                dirname = type + "-" + dpitag;
            } else {
                dirname = dpitag;
            }
        }    
    }

    let savefilepath;
    if(dirname) {
        savefilepath = path.join(dir, dirname, _savefile);
    } else {
        savefilepath = path.join(dir, _savefile);
    }
    if(dpitag!='' && isAppleOS(target)) {
        let fileext = path.extname(savefilepath);
        savefilepath = savefilepath.replace(/\.[^/.]+$/, "") + dpitag;
        if(fileext!=null && fileext!="") {
            savefilepath = savefilepath + fileext;
            _savefile = path.join(path.dirname(_savefile), path.basename(savefilepath));
        }
    }

    let savedFile = dirname ? (subdir==null ? path.join(dirname, _savefile) : path.join(subdir, dirname, _savefile)) : (subdir==null ? path.join(_savefile) : path.join(subdir, _savefile));
    if(assets_contents) {
        assets_contents['images'][dpi]['filename'] = path.basename(savedFile);
    }


    if(assets_contents!=null && dpi==0) {
        if(fs.existsSync(path.dirname(savedFile))) {
            // TODO : confirm to remove derectory
            
            if(finish==null) _log(chalk.cyanBright("Clear Folder") + " : %s", chalk.greenBright(path.join(path.dirname(savedFile), "*")));
            fs.rmdirSync(path.dirname(savedFile), {recursive:true});
            if(finish==null) _log(chalk.cyanBright("OK!"));    
        }
    }

    if(finish==null) _log(chalk.cyanBright("Save") + " : %s", chalk.greenBright(savedFile));

    let scale = _scale(dpitag);

    _writeAsset(asset, savefilepath, scale, width, height, subdir, dirname, _savefile, (finish!=null)).then((res, err) => {
        if(res) {
            if(argv.open) {
                if(argv.open===true) {
                    if(finish==null) _log(chalk.cyanBright("Open it."));
                    open(savefilepath);
                } else {
                    if(finish==null) _log(chalk.cyanBright("Open it as " + argv.open));
                    open(savefilepath, {app: argv.open});
                }
            }

            if(finish==null) _log(chalk.cyanBright("OK!"));

            if(assets_contents!=null && dpi+1==dpis.length) {
                assets_contents['info']['author'] = "appres";
                if(assets_contents['images'][dpi]['idiom']!=null) {
                    let contentsFile = path.join(path.dirname(savedFile), "Contents.json");                
                    fs.writeFileSync(contentsFile, JSON.stringify(assets_contents, null, 2));                
                    _log(chalk.cyanBright("Save") + " : %s", chalk.greenBright(contentsFile) + " " + "with" + " " + chalk.greenBright((dpi+1)) + " " + "assets.");    
                    _log(chalk.cyanBright("OK!"));
                }
            }        

            setTimeout(()=>{
                _saveAssetProc(asset, dir, subdir, savefile, width, height, target, type, dpis, dpi+1, assets_contents, filename, finish);
            },1);    
        }
        if(err) {
            if(finish==null) _log(chalk.red(err));
        }
    });
}




const _asset = async() => {
    if(PKEY=="YOUR_PKEY" || AKEY=="YOUR_AKEY") {
        let msg = "The access key has not been initialized yet. Please check the related to PKEY and AKEY.";
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
                            if(path.extname(argv.file)=="") {
                                argv.file = argv.file + ".png";
                                setTimeout(()=>{
                                    _asset();
                                },1);
                            } else {
                                console.log(chalk.redBright("Invalid command or file not found."));
                            }
                        } else {
                            console.log(chalk.red(JSON.stringify(res.body)));
                        }
                    }
                } else {
                    // success
                    const asset = res.body;
                    if(argv.console) {
                        if(argv.console=='bytes') {
                            let bytes = imgclip.bufferToBytes(asset);
                            console.log(bytes);
                        } else
                        if(argv.console=='array') {
                            let bytes = imgclip.bufferToArray(asset);
                            console.log(bytes);
                        } else
                        if(argv.console=='base64') {
                            let b64data = imgclip.bufferToBase64(asset);
                            console.log(b64data);
                        } else
                        if(argv.console=='blob') {
                            let b64data = imgclip.bufferToBase64(asset);
                            let mime = "png";
                            let ext = extName(argv.file);
                            if(ext && ext.length>0) {
                                mime = ext[0].ext;
                            }
                            console.log("data:image/"+mime+";base64," + b64data);
                        } else {
                            console.log(asset);
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
                                _writeAsset(asset, savefilepath, scale, width, height, subdir, dirname, savefile).then((res, err) => {
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
                                    console.log(asset);
                                }
                            }    
                        } else {
                            if(fs.existsSync(argv.target + ".json")){
                                // TODO : pre-defined target json file.
                                console.log(chalk.redBright("TODO : exists pre-defined target json file."));                    
                                console.log(chalk.greenBright(argv.target + ".json"));                    
                            } else 
                            if(argv.target=="android" || isAppleOS(argv.target)) {
                                // android type : "drawable", "mipmap"
                                let type = (argv.type!==true ? argv.type : null) || "mipmap";
                                let dpis = ['', 'ldpi', 'mdpi', 'tvdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
                                if(isAppleOS(argv.target)) {
                                    type = argv.type || null;
                                    dpis = ['', '@2x', '@3x'];
                                }

                                let assets_contents = null;
                                let wasProcessed = false;
                                if(isAppleOS(argv.target) && type) {
                                    assets_contents = _xcassets(argv.target, argv.type);
                                    if(assets_contents) {
                                        dpis = [];
                                        if(assets_contents["images"]) {
                                            assets_contents["images"].forEach(image => {
                                                let sizeok = true;
                                                if(image["size"]==null) {
                                                    sizeok = false;
                                                    if(width=="auto" || height=="auto") {
                                                        _log(chalk.yellowBright("Required") + " : " + chalk.redBright("You need to enter the target image size."));
                                                    } else {
                                                        image["size"] = "" + width + "x" + height;
                                                        sizeok = true;
                                                    }
                                                }
                                                if(sizeok) dpis.push(image);
                                            });        
                                        } else
                                        if(assets_contents["assets"]) { // apple watch (Complication.complicationset)
                                            assets_contents["assets"].forEach(asset_content => {
                                                let filename = asset_content['filename'];
                                                if(filename) {
                                                    let dpis = [];
                                                    let assets_contents = _xcassets(filename);
                                                    assets_contents["images"].forEach(image => {
                                                        dpis.push(image);
                                                    });                                                
                                                    _saveAssetProc(asset, dir, subdir, savefile, width, height, argv.target, type, dpis, 0, assets_contents, filename, (result) => {

                                                    });
                                                }
                                            });        
                                            wasProcessed = true;
                                        }
                                    }
                                }

                                if(wasProcessed==false) {
                                    _saveAssetProc(asset, dir, subdir, savefile, width, height, argv.target, type, dpis, 0, assets_contents);    
                                }
                            }
                        }
                    }
                }
            } else {
                if(path.extname(argv.file)=="") {
                    argv.file = argv.file + ".png";
                    setTimeout(()=>{
                        _asset();
                    },1);
                } else {
                    _log(chalk.red(JSON.stringify(err)));
                }
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
    if(argv.key || argv.str || argv.target || argv.type) {
        let data = {
            pkey: PKEY,
            akey: AKEY,
            lang: LANG,
            cmd: argv._[0],
            key: argv.key,
            str: argv.str,
            target: argv.target,
            type: argv.type
        };
        needle.post(HOST, data, function(err, res) {
            if(err) {
                _log(chalk.red(JSON.stringify(err)));
            } else {
                if(res.body.r=="s" && res.body.d) {
                    // Success
                    if(argv.save) {
                        let subdir = null;
                        let savefile = data.cmd + ".json";
                        if(argv.target=="ios" || argv.target=="xcode") {
                            if(data.type=="plist")
                                savefile = "InfoPlist.strings";
                            else
                                savefile = "Localizable.strings";

                            if(!LANG || LANG=="default") {
                                subdir = "base.lproj";
                            } else {
                                let ss = LANG.split("-");
                                if(ss.length==2) {
                                    subdir = ss[0] + ".lproj";    
                                }
                            }    
                        } else 
                        if(argv.target=="android") {
                            savefile = "strings.xml";
                            if(!LANG || LANG=="default") {
                                subdir = "values";
                            } else {
                                let ss = LANG.split("-");
                                if(ss.length==2) {
                                    subdir = "values-" + ss[0];    
                                }
                            }    
                        } else
                        if(argv.type=="xml" || argv.type=="plist" || argv.type=="kv" || argv.type=="ini") {
                            savefile = data.cmd + "." + argv.type;
                        }

                        if(argv.save && argv.save!==true) {
                            savefile = argv.save;
                        }
                        
                        let dir = _getcwd();
                        if(DIR && DIR!==true) {
                            if(path.isAbsolute(DIR)) {
                                dir = DIR;
                            } else {
                                dir = path.join(dir, DIR);
                            }
                        }

                        if(subdir) {
                            dir = path.join(dir, subdir);
                        }

                        let savefilepath = path.join(dir, savefile);
                        if(_forcefiledir(savefilepath)) {
                            let str = null;
                            if((typeof res.body.d)=="string") {
                                str = res.body.d;
                            } else {
                                try {
                                    str = JSON.stringify(res.body.d, null, 2);
                                } catch (e) {
                                    str = res.body.d;
                                }    
                            }
                            fs.writeFile(savefilepath, str, function (err) {
                                if (err) {
                                    _log(chalk.redBright(err));
                                } else {
                                    _log(chalk.cyanBright("Save") + " : " + chalk.greenBright(path.join(path.join(argv.dir||"", subdir||"")||"", savefile)));

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
                            });
                        }
                    } else {
                        _log(JSON.stringify(res.body.d, null, 2));
                    }
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

const _findJson = (pDir) => {
    if(pDir==null) return null;
    let findJsonFile = path.join(pDir, jsonFile);
    if(fs.existsSync(findJsonFile)) {
        return findJsonFile;
    }
    let pd = path.dirname(pDir);
    if(pd==='/' || pd===pDir) return null;
    return _findJson(pd);
}

const _load = (resolve) => {
    let json = null;
    if(fs.existsSync(oldJsonFile) && !fs.existsSync(jsonFile)) {
        fs.renameSync(oldJsonFile, jsonFile);
    }

    let findJsonFile = jsonFile;
    if(!fs.existsSync(findJsonFile)) {
        findJsonFile = _findJson(_getcwd());
    }
    if(findJsonFile==null) findJsonFile = jsonFile;

    fs.readFile(findJsonFile, (err, data) => {
        if(err) {
            json = {};
            // _log(chalk.red(JSON.stringify(err)));
        } else {
            try {
                json = JSON.parse(data);
            } catch (e) {
                json = {};
                _log(chalk.red(JSON.stringify(e)));
            }    
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

const _writeJson = async(json) => {
    fs.writeFile(jsonFile, JSON.stringify(json, null, 2), (err) => {
        if(err) {
            _log(chalk.red(err));
        } else {
            _log(chalk.blueBright("Initialize : %s"), chalk.greenBright(jsonFile));
            _log(chalk.blueBright(jsonFile + ":\n%s"), chalk.greenBright(JSON.stringify(json, null, 2)));
        }
    });
}

const _init = async(json) => {
    if(!fs.existsSync(jsonFile)) {
        let find = _findJson(_getcwd());
        if(find!=null) {
            var questions = [{
                type: 'confirm',
                name: 'toBeNewCreate',
                message: 'We have find .appres.json file in parent folder. Do you want to create a new .appres.json file in the current working folder?',
                default: false,
            }];              
            inquirer.prompt(questions).then((answers) => {
                if(answers.toBeNewCreate===true) {
                    _writeJson(json);
                }
            });
            return;
        }
    }
    _writeJson(json);
}

const _main = async() => {
    CMD = argv._[0];
    FILE = argv.file;
    switch(CMD) {
        case 'test':
            break;
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


