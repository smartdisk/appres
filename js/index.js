'use strict';

const pkg = require('../package.json');

let HOST = pkg.api.host;
let PKEY = "GXYqIgrafjTRatwTB96d";
let AKEY = "39f031e6-94a0-4e14-b600-82779ec899d7";
let LANG = "ko-KR";

Object.defineProperty(exports, "__esModule", { value: true });
var AppRes = /** @class */ (function () {
  
  function AppRes() {
    window.customElements.define('app-res', class extends HTMLElement {
      constructor() {
        super();
        const self = this;
        setTimeout(function(){
          let newtext = null;
          if(self.hasAttribute('key')) {
            newtext = window.AppString[self.getAttribute('key')];
          } else {
            newtext = window.AppString[self.innerText];
          }
          if(newtext) {
            self.innerText = newtext;  
          } else {
            console.log("AppRes:" + self.innerText);
          }
        }, 0)
      }
    });    
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
  function enableTabKey(id) {
    var el = (typeof id)=="string" ? document.getElementById(id) : id;
    el.onkeydown = function(e) {
        if (e.keyCode === 9) { // tab was pressed
  
            // get caret position/selection
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;
  
            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);
  
            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;
  
            // prevent the focus lose
            return false;
  
        }
    };
  }

  AppRes.prototype.setEnv = function (host, pkey, akey, lang) {
    setEnv(host, pkey, akey, lang);
  };
  AppRes.prototype.setLang = function (lang) {
    setLang(lang);
  };  
  AppRes.prototype.enableTabKey = function (id) {
    enableTabKey(id);
  };


  AppRes.appres = new AppRes();
  AppRes.setEnv = function(host, pkey, akey, lang) {
    return this.appres.setEnv(host, pkey, akey, lang);
  };
  AppRes.setLang = function(lang) {
    return this.appres.setLang(lang);
  };
  AppRes.enableTabKey = function(id) {
    return this.appres.enableTabKey(id);
  };
  
  return AppRes;
}());

module.exports = AppRes;
module.exports.AppRes = AppRes;

