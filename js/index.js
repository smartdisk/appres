'use strict';

const pkg = require('../package.json');
const axios = require('axios');

const HOST = pkg.api.host;
const PKEY = "GXYqIgrafjTRatwTB96d";
const AKEY = "39f031e6-94a0-4e14-b600-82779ec899d7";
const LANG = "ko-KR";

Object.defineProperty(exports, "__esModule", { value: true });
var AppRes = /** @class */ (function () {
  
  function AppRes() {
    window.customElements.define('app-res', class extends HTMLElement {
      constructor() {
        super();
        const self = this;
        setTimeout(function(){
          _string(self.innerText).then((res) => {
            console.log("res:" + res);

          }, (err) => {
            console.log("err:" + err);

          });
        }, 0)
      }
    });    
  }

  const _string = (string) => {
    let data = {
      pkey: PKEY,
      akey: AKEY,
      lang: LANG,
      cmd: 'string',
      str: string
    };
    let config = {
      method: 'post',
      url: HOST,
      data: data
    };    
    return new Promise((resolve, reject) => {
      axios(config)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    });
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
  
  AppRes.prototype.enableTabKey = function (id) {
    enableTabKey(id);
  };

  AppRes.appres = new AppRes();
  AppRes.enableTabKey = function(id) {
    return this.appres.enableTabKey(id);
  };
  
  return AppRes;
}());

module.exports = AppRes;
module.exports.AppRes = AppRes;

