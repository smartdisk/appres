'use strict';

const pkg = require('../package.json');

let HOST = pkg.api.host;
let PKEY = "GXYqIgrafjTRatwTB96d";
let AKEY = "39f031e6-94a0-4e14-b600-82779ec899d7";
let LANG = "ko-KR";

Object.defineProperty(exports, "__esModule", { value: true });
var AppRes = /** @class */ (function () {
  function AppRes() {
    /*
    window.customElements.define('app-res', class extends HTMLElement {
      constructor() {
        super();
        const context = window;
        const element = this;
        setTimeout(function(){
          element.innerText = appString(context, element) || element.innerText;
        }, 0);
      }
    });
    */    
  }

  function appString(context, element) {
    let newtext = null;
    if(context.AppString) {
      if(element.hasAttribute('key')) {
        newtext = context.AppString[element.getAttribute('key')];
      } else {
        newtext = context.AppString[element.innerText];
      }  
    }
    if(!newtext) {
      if(context.AppString) {
        console.log("AppRes:" + element.innerText);
      } else {
        console.log("AppRes:" + element.innerText + " " + "(Not found AppString!!!)");
      }
    }
    return newtext;
  }

  function setEnv(host, pkey, akey, lang) {
    if(host) HOST = host;
    if(pkey) PKEY = pkey;
    if(akey) AKEY = akey;
    if(lang) LANG = lang;
  }
  function setLang(lang) {
    if(lang) LANG = lang;
  }

  AppRes.prototype.setEnv = function (host, pkey, akey, lang) {
    setEnv(host, pkey, akey, lang);
  };
  AppRes.prototype.setLang = function (lang) {
    setLang(lang);
  };  

  AppRes.prototype.appString = function (context, element) {
    return appString(context, element);
  };  




  AppRes.appres = new AppRes();
  AppRes.setEnv = function(host, pkey, akey, lang) {
    this.appres.setEnv(host, pkey, akey, lang);
  };
  AppRes.setLang = function(lang) {
    this.appres.setLang(lang);
  };

  AppRes.appString = function(context, element) {
    return this.appres.appString(context, element);
  };

  
  return AppRes;
}());

module.exports = AppRes;
module.exports.AppRes = AppRes;

