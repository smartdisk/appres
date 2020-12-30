#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const boxen = require("boxen");
const needle = require('needle');

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

const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

const hello = async() => {
    for(let i=0;i<1000;i++) {
        process.stdout.write("\r"+chalk.blue("hello") + ": " + i);
        await sleep(1);
    }
    process.stdout.write("\n");
}

const helper = () => {
    let helperMsg = chalk.white.bold("Hello AppRes!!!");
    let helperBox = boxen( helperMsg, boxenOptions );
    console.log(helperBox);
}


const load = (resolve) => {
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

const init = async() => {
    load((json) => {
        fs.writeFile(jsonFile, JSON.stringify(json, null, 2), (err) => {
            if(err) {
                console.log(err);
            } else {
                console.log(chalk.blueBright("Successfully initialize %s file."), chalk.greenBright(jsonFile));
            }
        });
    });
}

const icon = async() => {
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
                    let saveFile = argv.file;
                    if(argv.save && argv.save!==true) {
                        saveFile = argv.save;
                        argv.save = true;
                    }
                    else
                    if(argv.s && argv.a && argv.v && argv.e) {
                        argv.save = true;
                    }

                    if(argv.save===true && saveFile) {                        
                        fs.writeFile(saveFile, res.body, (err) => {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log(chalk.blueBright("Successfully saved %s file."), chalk.greenBright(saveFile));
                            }
                        });
                    } else {
                        console.log(res.body);
                    }


                    if(argv.resize) {
                        
                    }

                }
            } else {
                console.log(JSON.stringify(err));
            }
        });
    }
}

const string = async() => {
    if(argv.key) {
        let data = {
            pkey: PKEY,
            akey: AKEY,
            lang: LANG,
            cmd: 'string',
            key: argv.key,
        };
        needle.post(HOST, data, function(err, res) {
            if(!err) {
                if(res.body.r=="s" && res.body.d) {
                    // Success
                    console.log(JSON.stringify(res.body.d));
                } else {
                    console.log(JSON.stringify(res.body));
                }
            } else {
                console.log(JSON.stringify(err));
            }
        });
    }
}

const setenv = (json) => {
    HOST = json.host;
    PKEY = json.pkey;
    AKEY = json.akey;
    LANG = json.lang;
}

const main = async() => {
    switch(argv._[0]) {
        case 'init':
            init();
            break;
        case 'icon':
            load((json) => {
                setenv(json);
                icon();
            });
            break;
        case 'string':
            load((json) => {
                setenv(json);
                string();
            });
            break;
    }
}

if(argv._.length>0) {
    main();
} else {
    switch(argv.func) {
        case "help":
            helper();
            break;
        case "hello":
            hello();
            break;
    }    
}


