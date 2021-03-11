/*!
 * AppRes JavaScript Library v0.0.48
 * https://appres.org/
 *
 * Copyright 2021 APPRES.ORG and other contributors
 * Released under the MIT license
 * https://appres.org/license
 *
 * Create Date: 2021.02.07 KST
 * Last Update: 2021.03.11 KST
 */


if(window.globalThis==null) {
  window.globalThis = window;
}

(function (window) {
  window.APPRES = {
    appEvents: {
      onReady: [],
      onLanguageChange: [],
      onLangsSelector: [],
      add: function(name, event) {
        if(this[name] == null) this[name] = [];
        if(this[name].indexOf(event)<0) {
          this[name].push(event);
        }
      },
      remove: function(name, event) {
        if(this[name] == null) this[name] = [];
        if(event==null) {
          this[name] = [];
        } else {
          while(this[name].indexOf(event)>=0) {
            this[name].splice(this[name].indexOf(event), 1);
          }  
        }
      },
      get: function(name) {
        if(this[name] == null) this[name] = [];
        return this[name];
      }
    }
  };
  
  var AppEvents = function() {
    var Event = (function(){
      function Event() { }
      return Event;
    }());
    Event.prototype.addEvent = function (name, event) {
      window.APPRES.appEvents.add(name, event);
    };
    Event.prototype.removeEvent = function (name, event) {
      window.APPRES.appEvents.remove(name, event);
    };
    Event.prototype.getEvents = function (name) {
      return window.APPRES.appEvents.get(name);
    };
    return new Event();
  };
  window.$$ = AppEvents;


  var SHA1 = (function () {      
    'use strict'; 
    
    function SHA1() {
    }

    /*
    * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
    * in FIPS PUB 180-1
    * Copyright (C) Paul Johnston 2000.
    * See http://pajhome.org.uk/site/legal.html for details.
    */

    /*
    * Convert a 32-bit number to a hex string with ms-byte first
    */
    var hex_chr = "0123456789abcdef";
    function hex(num)
    {
      var str = "";
      for(var j = 7; j >= 0; j--)
        str += hex_chr.charAt((num >> (j * 4)) & 0x0F);
      return str;
    }

    /*
    * Convert a string to a sequence of 16-word blocks, stored as an array.
    * Append padding bits and the length, as described in the SHA1 standard.
    */
    function str2blks_SHA1(str)
    {
      var nblk = ((str.length + 8) >> 6) + 1;
      var blks = new Array(nblk * 16);
      for(var i = 0; i < nblk * 16; i++) blks[i] = 0;
      for(i = 0; i < str.length; i++)
        blks[i >> 2] |= str.charCodeAt(i) << (24 - (i % 4) * 8);
      blks[i >> 2] |= 0x80 << (24 - (i % 4) * 8);
      blks[nblk * 16 - 1] = str.length * 8;
      return blks;
    }

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
    * to work around bugs in some JS interpreters.
    */
    function add(x, y)
    {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
    * Bitwise rotate a 32-bit number to the left
    */
    function rol(num, cnt)
    {
      return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
    * Perform the appropriate triplet combination function for the current
    * iteration
    */
    function ft(t, b, c, d)
    {
      if(t < 20) return (b & c) | ((~b) & d);
      if(t < 40) return b ^ c ^ d;
      if(t < 60) return (b & c) | (b & d) | (c & d);
      return b ^ c ^ d;
    }

    /*
    * Determine the appropriate additive constant for the current iteration
    */
    function kt(t)
    {
      return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
            (t < 60) ? -1894007588 : -899497514;
    }

    /*
    * Take a string and return the hex representation of its SHA-1.
    */
    function calcSHA1(str)
    {
      var x = str2blks_SHA1(str);
      var w = new Array(80);

      var a =  1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d =  271733878;
      var e = -1009589776;

      for(var i = 0; i < x.length; i += 16)
      {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;

        for(var j = 0; j < 80; j++)
        {
          if(j < 16) w[j] = x[i + j];
          else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
          var t = add(add(rol(a, 5), ft(j, b, c, d)), add(add(e, w[j]), kt(j)));
          e = d;
          d = c;
          c = rol(b, 30);
          b = a;
          a = t;
        }

        a = add(a, olda);
        b = add(b, oldb);
        c = add(c, oldc);
        d = add(d, oldd);
        e = add(e, olde);
      }
      return hex(a) + hex(b) + hex(c) + hex(d) + hex(e);
    }

    SHA1.prototype.calc = function (string) {
      return calcSHA1(string);
    };
    
    return SHA1;
  }());


  var MD5 = (function () {       
    'use strict';
    
    function MD5() {
    }

    /*
    * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
    * Digest Algorithm, as defined in RFC 1321.
    * Copyright (C) Paul Johnston 1999 - 2000.
    * Updated by Greg Holt 2000 - 2001.
    * See http://pajhome.org.uk/site/legal.html for details.
    */

    /*
    * Convert a 32-bit number to a hex string with ls-byte first
    */
    var hex_chr = "0123456789abcdef";
    function rhex(num)
    {
      var str = "";
      for(var j = 0; j <= 3; j++)
        str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
              hex_chr.charAt((num >> (j * 8)) & 0x0F);
      return str;
    }

    /*
    * Convert a string to a sequence of 16-word blocks, stored as an array.
    * Append padding bits and the length, as described in the MD5 standard.
    */
    function str2blks_MD5(str)
    {
      var nblk = ((str.length + 8) >> 6) + 1;
      var blks = new Array(nblk * 16);
      for(var i = 0; i < nblk * 16; i++) blks[i] = 0;
      for(i = 0; i < str.length; i++)
        blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
      blks[i >> 2] |= 0x80 << ((i % 4) * 8);
      blks[nblk * 16 - 2] = str.length * 8;
      return blks;
    }

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
    * to work around bugs in some JS interpreters.
    */
    function add(x, y)
    {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
    * Bitwise rotate a 32-bit number to the left
    */
    function rol(num, cnt)
    {
      return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
    * These functions implement the basic operation for each round of the
    * algorithm.
    */
    function cmn(q, a, b, x, s, t)
    {
      return add(rol(add(add(a, q), add(x, t)), s), b);
    }
    function ff(a, b, c, d, x, s, t)
    {
      return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t)
    {
      return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t)
    {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t)
    {
      return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
    * Take a string and return the hex representation of its MD5.
    */
    function calcMD5(str)
    {
      var x = str2blks_MD5(str);
      var a =  1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d =  271733878;

      for(var i = 0; i < x.length; i += 16)
      {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;

        a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
        d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
        c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
        b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
        a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
        d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
        c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
        b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
        a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
        d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
        c = ff(c, d, a, b, x[i+10], 17, -42063);
        b = ff(b, c, d, a, x[i+11], 22, -1990404162);
        a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
        d = ff(d, a, b, c, x[i+13], 12, -40341101);
        c = ff(c, d, a, b, x[i+14], 17, -1502002290);
        b = ff(b, c, d, a, x[i+15], 22,  1236535329);    

        a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
        d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
        c = gg(c, d, a, b, x[i+11], 14,  643717713);
        b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
        a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
        d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
        c = gg(c, d, a, b, x[i+15], 14, -660478335);
        b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
        a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
        d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
        c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
        b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
        a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
        d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
        c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
        b = gg(b, c, d, a, x[i+12], 20, -1926607734);
        
        a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
        d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
        c = hh(c, d, a, b, x[i+11], 16,  1839030562);
        b = hh(b, c, d, a, x[i+14], 23, -35309556);
        a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
        d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
        c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
        b = hh(b, c, d, a, x[i+10], 23, -1094730640);
        a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
        d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
        c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
        b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
        a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
        d = hh(d, a, b, c, x[i+12], 11, -421815835);
        c = hh(c, d, a, b, x[i+15], 16,  530742520);
        b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

        a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
        d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
        c = ii(c, d, a, b, x[i+14], 15, -1416354905);
        b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
        a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
        d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
        c = ii(c, d, a, b, x[i+10], 15, -1051523);
        b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
        a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
        d = ii(d, a, b, c, x[i+15], 10, -30611744);
        c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
        b = ii(b, c, d, a, x[i+13], 21,  1309151649);
        a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
        d = ii(d, a, b, c, x[i+11], 10, -1120210379);
        c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
        b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

        a = add(a, olda);
        b = add(b, oldb);
        c = add(c, oldc);
        d = add(d, oldd);
      }
      return rhex(a) + rhex(b) + rhex(c) + rhex(d);
    }

    MD5.prototype.calc = function (string) {
      return calcMD5(string);
    };
    
    return MD5;
  }());

  var
    options = {
      host: "https://us-central1-appres-org.cloudfunctions.net/api",
      // host: "https://appres.org/functions/api",
      // host: "http://127.0.0.1:5001/appres-org/us-central1/api",
      pkey: "GXYqIgrafjTRatwTB96d",
      akey: "39f031e6-94a0-4e14-b600-82779ec899d7",
      cmd: "string-dict",
      target: "js",
      skey: "default",
      lang: "ja-JP",
      hash: null,
      retry: 50,
      time: 25,
      cache: true,
      visibility: "hidden",
      title_trans: true,
      langs_all: false,
      langs_selector: {
        langs: ".appres-langs",
        langs_button: ".appres-langs-button",  
        langs_button_color: "black",  
        langs_items: ".appres-langs-items",
        style: {
          button: "auto"
        }
      },
      default_excepts: ["material-icons", "mat-tab-group"],
      user_excepts: []
    },
    md5 = new MD5(),
    sha1 = new SHA1(),
    loadScript = function (window, url, callback) {
      var script = window.document.createElement("script");
      script.type = 'text/javascript';
      // use onreadystatechange in IE
      script.onload = function () {
        if (callback) callback();
      };
      script.src = url;
      window.document.getElementsByTagName('head')[0].appendChild(script);
    },
    isExpects = function (element) {
      var arr = element.className.split(" ");
      for(i=0;i<options.default_excepts.length;i++) {
        if (arr.indexOf(options.default_excepts[i])>=0) return true;
      }
      for(i=0;i<options.user_excepts.length;i++) {
        if (arr.indexOf(options.default_excepts[i])>=0) return true;
      }
      if(element.id) {
        if(options.default_excepts.indexOf(element.id)>=0) return true;
        if(options.user_excepts.indexOf(element.id)>=0) return true;
      }
      return false;
    },
    findPosition = function (window, obj) { 
      var currenttop = 0; 
      var currentleft = 0; 
      if(obj==null) {        
        obj = window;
        window = appWindow;
      }
      if(typeof obj == 'string') {
        var objs = elementSelectAll(window, obj);
        if(objs.length>0) {
          obj = objs[0];
        } else {
          return [currentleft, currenttop]; 
        }
      }
      if (obj.offsetParent) { 
          do { 
              currenttop += obj.offsetTop; 
              currentleft += obj.offsetLeft; 
          } while ((obj = obj.offsetParent)); 
      } 
      return [currentleft, currenttop]; 
    },
    elementText = function (element, text) {
      if (text) {
        if (element.textContent!=null) {
          element.textContent = text;
          return element.textContent;
        }
        if (element.innerText!=null) {
          element.innerText = text;
          return element.innerText;
        }
      } else {
        if (element.textContent) return element.textContent;
        if (element.innerText) return element.innerText;
      }
      return null;
    },
    elementHTML = function (element, html) {
      if (html) {
        if (element.innerHTML) {
          element.innerHTML = html;
          return element.innerHTML;
        }
      } else {
        if (element.innerHTML) return element.innerHTML;
      }
      return null;
    },
    elementAttr = function (element, attr, val) {
      if (val) {
        element.setAttribute(attr, val);
        return element.getAttribute(attr);
      } 
      return element.getAttribute(attr);
    },
    objectString = function (text) {
      if(text==null) return null;
      if (typeof text === "object") {
        var _newtext = text[options.lang];
        if (_newtext == "") _newtext = text["default"];
        text = _newtext;
      }
      return text;
    },
    keyString = function (keystr) {
      if(options.hash && keystr!="") {
        keystr = options.hash=="md5" ? md5.calc(keystr) : (options.hash=="sha1" ? sha1.calc(keystr) : keystr);
      }
      return keystr || "";
    },
    appString = function (window, element) {
      var newtext = null;
      var keystr = null;
      if (typeof window === "string") {
        element = window;
        window = appWindow;
      }
      if (typeof element === "string") {        
        keystr = keyString(element);
        if(keystr!="") {
          if(window.APPRES_STRINGS && window.APPRES_DICTS) {
            newtext = window.APPRES_STRINGS[keystr] || window.APPRES_DICTS[keystr];
          } else 
          if(window.APPRES_STRINGS) {
            newtext = window.APPRES_STRINGS[keystr];
          } else 
          if(window.APPRES_DICTS) {
            newtext = window.APPRES_DICTS[keystr];
          }            
        }
        return objectString(newtext) || element;
      }
      
      if (window.APPRES_DICTS) {
        if (element.hasAttribute('dict')) {
          keystr = keyString(element.getAttribute('dict'));
          if(keystr!="") {
            newtext = window.APPRES_DICTS[keystr];
          }
        }
      }

      if (newtext==null && window.APPRES_STRINGS) {
        if (element.hasAttribute('string')) {
          keystr = keyString(element.getAttribute('string'));
          if(keystr!="") newtext = window.APPRES_STRINGS[keystr];
        } else
        if (element.hasAttribute('appres-key')) {
          keystr = element.getAttribute('appres-key') || "";
          if(keystr!="") newtext = window.APPRES_STRINGS[keystr];
        } else {
          var text = elementText(element);
          if (text != null) {
            keystr = keyString(text);
            if(keystr!="") {
              element.setAttribute('appres-key', keystr);
              newtext = window.APPRES_STRINGS[keystr];
            }
          }
        }
      }
      if (newtext) {
        newtext = objectString(newtext);
      } else {
        if (window.APPRES_STRINGS) {
          console.log("AppRes:" + options.lang + ":" + elementText(element));
        } else {
          console.log("AppRes:" + options.lang + ":" + elementText(element) + " " + "(Not found APPRES_STRINGS!!!)");
        }
      }
      return newtext;
    },
    appHTML = function (window, element) {
      var newhtml = null;
      var keystr = null;
      if (typeof window === "string") {
        element = window;
        window = appWindow;
      }
      if (typeof element === "string") {        
        keystr = keyString(element);
        if(keystr!="") {
          if(window.APPRES_STRINGS && window.APPRES_DICTS) {
            newhtml = window.APPRES_STRINGS[keystr] || window.APPRES_DICTS[keystr];
          } else 
          if(window.APPRES_STRINGS) {
            newhtml = window.APPRES_STRINGS[keystr];
          } else 
          if(window.APPRES_DICTS) {
            newhtml = window.APPRES_DICTS[keystr];
          }            
        }
        return objectString(newhtml) || element;
      }
      
      if (window.APPRES_DICTS) {
        if (element.hasAttribute('dict')) {
          keystr = keyString(element.getAttribute('dict'));
          if(keystr!="") {
            newhtml = window.APPRES_DICTS[keystr];
          }
        }
      }

      if (newhtml==null && window.APPRES_STRINGS) {
        if (element.hasAttribute('string')) {
          keystr = keyString(element.getAttribute('string'));
          if(keystr!="") newhtml = window.APPRES_STRINGS[keystr];
        } else
        if (element.hasAttribute('appres-key')) {
          keystr = element.getAttribute('appres-key') || "";
          if(keystr!="") newhtml = window.APPRES_STRINGS[keystr];
        } else {
          var html = elementHTML(element);
          if (html != null) {
            keystr = keyString(html);
            if(keystr!="") {
              element.setAttribute('appres-key', keystr);
              newhtml = window.APPRES_STRINGS[keystr];
            }
          }
        }
      }
      if (newhtml) {
        newhtml = objectString(newhtml);
      } else {
        if (window.APPRES_STRINGS) {
          console.log("AppRes:" + options.lang + ":" + elementHTML(element));
        } else {
          console.log("AppRes:" + options.lang + ":" + elementHTML(element) + " " + "(Not found APPRES_STRINGS!!!)");
        }
      }
      return newhtml;
    },
    appAttr = function (window, element, attr) {
      var newval = null;
      var keystr = null;
      var val = elementAttr(element, attr);
      if (window.APPRES_STRINGS) {
        if (element.hasAttribute('appres-'+attr)) {
          keystr = keyString(element.getAttribute('appres-'+attr));
          if(keystr!="") newval = window.APPRES_STRINGS[keystr];
        } else {
          if (val != null) {
            element.setAttribute('appres-'+attr, val);
            keystr = keyString(val);
            if(keystr!="") {
              newval = window.APPRES_STRINGS[keystr];
            }
          }
        }
      }
      if (newval) {
        newval = objectString(newval);
      } else {
        if (window.APPRES_STRINGS) {
          console.log("AppRes:" + options.lang + ":" + val);
        } else {
          console.log("AppRes:" + options.lang + ":" + val + " " + "(Not found APPRES_STRINGS!!!)");
        }
      }
      return newval;
    },
    appTranslateAsync = function (window, element, retry, callback) {
      if (window.APPRES_STRINGS) {
        if(elementAttr(element, "appres-lang")==options.lang) {
          if(callback) callback(true);
          return;
        }

        // innerText, innerHTML
        if(!isExpects(element)) {
          var attrs = ["text"];
          if(element.hasAttribute("appres")) {
            attrs = element.getAttribute("appres").split(/\s* |,\s/);
          }

          if(attrs.indexOf("text")>=0) {
            elementText(element, appString(window, element) || elementText(element));
          } else
          if(attrs.indexOf("html")>=0) {
            elementHTML(element, appHTML(window, element) || elementHTML(element));
          }

          // attributes
          var attr = 'title';
          if(elementAttr(element, attr)) {
            elementAttr(element, attr, appAttr(window, element, attr) || elementAttr(element, attr));
          }

          attr = 'href';
          if(attrs.indexOf(attr)>=0 && elementAttr(element, attr)) {
            elementAttr(element, attr, appAttr(window, element, attr) || elementAttr(element, attr));
          }

          if (window.onChangedAppRes) {
            window.onChangedAppRes(element, true);
          }          
        }

        if (callback) {
          callback(true);
        }
      } else {
        if (retry >= options.retry) {
          if (window.onChangedAppRes) {
            window.onChangedAppRes(element, false);
          }
          if (callback) {
            callback(false);
          }
        } else {
          setTimeout(function () {
            appTranslateAsync(window, element, ++retry, callback);
          }, options.time);
        }
      }
    },
    setItem = function (window, k, v) {
      var deno = 0, i, j;
      while (1) {
        try {
          if (!deno) window.localStorage.setItem(k, v);
          else {
            window.localStorage.setItem(k, '--' + deno);
            j = Math.ceil(v / deno);
            for (i = 0; i < deno; i++)
              window.localStorage.setItem(k + '::' + i, v.substr(i * j, j));
          }
          break;
        } catch (e) {
          deno++;
        }
      }
    },
    getItem = function (window, k) {
      var data = window.localStorage.getItem(k), temp, i, j;
      if (data && data.substr(0, 2) == '--') {
        for (temp = '', i = 0, j = parseInt(data.substr(2)); i < j; i++)
          temp += window.localStorage.getItem(k + '::' + i);
        data = temp;
      }
      return data;
    },
    removeItem = function (window, k) {
      var data = window.localStorage.getItem(k), i, j;
      if (data && data.substr(0, 2) == '--') {
        for (i = 0, j = parseInt(data.substr(2)); i < j; i++)
          window.localStorage.removeItem(k + '::' + i);
      }
      if (data) window.localStorage.removeItem(k);
    },
    clearItems = function (window) {
      if(window==null) window = appWindow;
      removeItem(window, "appres.ver");
      removeItem(window, "appres.url");
      removeItem(window, "appres.langs");
      removeItem(window, "appres.strings");
      removeItem(window, "appres.dicts");
    },
    equalItem = function (window, k, v) {
      var data = getItem(window, k);
      return (v == data);
    },
    getVer = function (window) {
      return getItem(window, "appres.ver");
    },
    elementSelectAll = function (window, selector) {
      if(typeof selector == "object") return [selector];
      if(window==null) return [];
      return window.document.querySelectorAll(selector);
    },
    addClassName = function (element, name) {
      if(name.startsWith(".")) {
        name = name.substring(1);
      }
      var arr = element.className.split(" ");
      if (arr.indexOf(name) == -1) {
        element.className += " " + name;
      }
    },    
    removeClassName = function (element, name) {
      if(name.startsWith(".")) {
        name = name.substring(1);
      }
      var arr = element.className.split(" ");
      var index  = arr.indexOf(name);
      if(index>=0) {
        arr.splice(index, 1);
      }
      element.className = arr.join(" ");
    },
    getSystemLang = function (window) {
      return window.navigator.language || window.navigator.userLanguage; 
    },
    getElementStyleDisplay = function (window, element) {
      return element.currentStyle ? element.currentStyle.display : window.getComputedStyle(element, null).display;
    },
    getLangs = function (window) {
      var appres_langs = elementSelectAll(window, options.langs_selector.langs);
      if(appres_langs.length>0) {
        return appres_langs[0];
      }
      return null;
    },
    getLangsButton = function (window) {
      var appres_langs_button = elementSelectAll(window, options.langs_selector.langs_button);
      if(appres_langs_button.length>0) {
        return appres_langs_button[0];
      }
      return null;
    },
    getLangsSelector = function (window) {
      var appres_langs_items = elementSelectAll(window, options.langs_selector.langs_items);
      if(appres_langs_items.length>0) {
        return appres_langs_items[0];
      }
      return null;
    },
    toggleLangsSelector = function (window) {
      var items_div = getLangsSelector(window);
      if(items_div) {
        if(getElementStyleDisplay(window, items_div)=="none") {
          clearLangsSelector(window);

          var appres_langs_button = getLangsButton(window);
          if(appres_langs_button) {
            addClassName(appres_langs_button, options.langs_selector.langs_button + "-active");
          }

          var selected = setLangsSelector(window);
          items_div.setAttribute('style', "display:block");
          if(selected) {
            setTimeout(function(){
              var items_div = getLangsSelector(window);
              items_div.scrollTo(0, selected.offsetTop);
            }, 0);
          }  
        } else {
          clearLangsSelector(window);
        }  
      }
    },
    clearLangsSelector = function (window) {
      var langs_button = getLangsButton(window);
      if(langs_button) {
        removeClassName(langs_button, options.langs_selector.langs_button + "-active");
      }

      var items_div = getLangsSelector(window);
      if(items_div) {
        while (items_div.firstChild) {
          items_div.removeChild(items_div.lastChild);
        }        
        items_div.setAttribute('style', "display:none");
      }
    },
    setLangsSelector = function (window) {
      var selected = null;
      var items_div = getLangsSelector(window);
      if(items_div) {
        var langs = Object.keys(window.APPRES_LANGS);
        langs.forEach(function (lang) {
          var lang_name = window.APPRES_LANGS[lang];
          var lang_div = document.createElement('div');
          lang_div.id = lang;
          if(options.lang==lang) {
            lang_div.className = "selected";
            selected = lang_div;
          }
          elementText(lang_div, lang_name);
          items_div.appendChild(lang_div);
          lang_div.onclick = function(e) {
            var lang = e.target.id;
            if(lang!=options.lang) {
              items_div.setAttribute('style', "display:none");
              options.lang = lang;
              setItem(window, "appres.lang", options.lang);
              initLangsSelector(window);
              if(options.langs_all==true) {
                translate(window);
                if (options.title_trans) title_translate(window);
                var langs_button = getLangsButton(window);
                if(langs_button) {
                  if(langs_button.blur) langs_button.blur();
                  removeClassName(langs_button, options.langs_selector.langs_button + "-active");
                }          
                appEvents.onLanguageChange.forEach(function (_onLanguageChange){
                  _onLanguageChange(self);
                });
              } else {
                window.location.reload();
              }
            }
          }
        });
      }
      return selected;
    },
    makeLangsSelector = function (window) {
      var langs = getLangs(window);
      if(langs) {
        var _proced = false;
        appEvents.onLangsSelector.forEach(function (_onLangsSelector) {
          _proced = _onLangsSelector(self, langs) || _proced;
        });
        if(_proced) return langs;

        var button = window.document.createElement("button");
        addClassName(button, options.langs_selector.langs_button);
        addClassName(button, options.langs_selector.langs_button + "-" + options.langs_selector.langs_button_color);

        langs.appendChild(button);
        var div = window.document.createElement("div");
        addClassName(div, options.langs_selector.langs_items);  
        langs.appendChild(div);
      }
      return langs;  
    },
    initLangsSelector = function (window) {
      var langs_button = getLangsButton(window);
      if(langs_button==null) {
        if(getLangs(window)!=null) {
          makeLangsSelector(window);
          langs_button = getLangsButton(window);
        }
      }
      if(langs_button) {
        if(options.langs_selector.style.button!="auto") {
          addClassName(langs_button, options.langs_selector.langs_button + "-" + options.langs_selector.style.button);
          var langs_selector = getLangsSelector(window);
          addClassName(langs_selector, options.langs_selector.langs_items + "-" + options.langs_selector.style.button);
        }

        var lang = window.APPRES_LANGS[options.lang];
        if(!lang) {
          options.lang = getSystemLang(window);
          lang = window.APPRES_LANGS[options.lang];
        }
        if(!lang) {
          options.lang = "en-US";
          lang = window.APPRES_LANGS[options.lang];
          if(!lang) {
            options.lang = Object.keys(window.APPRES_LANGS)[0];
            lang = window.APPRES_LANGS[options.lang];
          }
        }          
        if(lang) {
          elementText(langs_button, lang);
          var appres_langs = getLangs(window);
          if(appres_langs) {
            appres_langs.setAttribute('style', 'display:block');
          }
        }
        langs_button.onclick = function(e) {
          toggleLangsSelector(window);
        }
    
        langs_button.onblur = function(e) {
          setTimeout(function(){
            clearLangsSelector(window);
          }, 300);
        }
      }
    },
    reset = function (window, sels) {
      var elements = (sels==null) ? elementSelectAll(window, ".appres") : elementSelectAll(window, ".appres " + sels);
      elements.forEach(function (element) {
        element.removeAttribute("appres-lang");
        element.removeAttribute("appres-key");
      });
    },
    title_translate = function (window) {
      if(window.appres_title == null) {
        window.appres_title = window.document.title;
      }
      window.document.title = appString(window.appres_title);
    },
    translate = function (window, sels) {
      var elements = (sels==null) ? elementSelectAll(window, ".appres") : elementSelectAll(window, ".appres " + sels);
      elements.forEach(function (element) {
        var image = elementAttr(element, "image");
        if(image) {
          console.log(">>>" + image);

        }

        appTranslateAsync(window, element, 0, function (success) {
          var appres_lang = elementAttr(element, "appres-lang");
          if(success && appres_lang==null) {
            if (options.visibility == "hidden") {
              element.setAttribute('style', 'visibility:visible');
            }  
            elementAttr(element, "appres-lang", options.lang);
          } else
          if(success && appres_lang!=options.lang) {
            elementAttr(element, "appres-lang", options.lang);
          }
        });
      })
    },
    hideTemporarily = function (window) {
      var elements = elementSelectAll(window, ".appres");
      elements.forEach(function (element) {
        element.setAttribute('style', 'visibility:hidden');
      });
    },
    showTemporarily = function (window) {
      var elements = elementSelectAll(window, ".appres");
      elements.forEach(function (element) {
        element.setAttribute('style', 'visibility:visible');
      });
    },
    formatString = function (args) {
      args = arguments[0];
      args[0] = appString(args[0]);
      return args[0].replace(/{(\d+)}/g, 
        function(match, num) { 
            num = Number(num) + 1; 
            return typeof(args[num]) != undefined ? args[num] : match; 
        }); 
    },
    langsSelectorSmallButton = function (window, retry) {
      if(window==null) window = appWindow;
      if(typeof window == "number") {
        retry = window;
        window = appWindow;
      }
      var button_name = options.langs_selector.langs_button;
      var button = elementSelectAll(window, button_name);
      if(button && button.length>0) {
        button = button[0];
        addClassName(button, "appres-langs-button-small");
      } else {
        if(retry==null) retry = 1;
        else retry ++;
        if(retry<50) {
          setTimeout(function(){
            langsSelectorSmallButton(window, retry);
          }, 10);
        }
      }
    },
    readFromCache = function (window, name) {
      if(typeof window == "string") {
        name = window;
        window = appWindow;
      }
      var appres_values = getItem(window, name);
      if (appres_values) {
        try {
          return JSON.parse(appres_values);
        } catch (e) {
          console.log("AppRes: readFromCache error : " + e);
        }
      }
      return null;
    },
    loadFromCache = function (window) {
      window.APPRES_LANGS = readFromCache(window, "appres.langs");  
      window.APPRES_STRINGS = readFromCache(window, "appres.strings");
      window.APPRES_DICTS = readFromCache(window, "appres.dicts");
    },
    loadAppResScript = function (window, url, ver) {
      loadScript(window, url + "&cver=" + ver,
        function () {
          if (options.cache) {
            if(window.APPRES_STRINGS==null) {
              loadFromCache(window);
              if(window.APPRES_STRINGS==null || window.APPRES_DICTS==null || window.APPRES_LANGS==null) {
                clearItems(window);
                setTimeout(function() {
                  loadAppResScript(window, url, 0);
                },100);
                return;
              }        
              console.log("AppRes: Loaded app string from appres cached ver " + ver);
            } else {
              if(window.APPRES_DVER>0) {
                setItem(window, "appres.strings", JSON.stringify(window.APPRES_STRINGS));
                setItem(window, "appres.dicts", JSON.stringify(window.APPRES_DICTS));
                setItem(window, "appres.langs", JSON.stringify(window.APPRES_LANGS));
                setItem(window, "appres.url", url);
                setItem(window, "appres.ver", JSON.stringify(window.APPRES_DVER));  
              } else {
                clearItems(window);
              }
              console.log("AppRes: Loaded app string from appres url ver " + window.APPRES_DVER);
            }
          } else {
            console.log("AppRes: Loaded app string from appres url ver " + window.APPRES_DVER);
          }
          initLangsSelector(window);
          translate(window);
          if (options.title_trans) title_translate(window);

          appEvents.onReady.forEach(function (_onReady){
            _onReady(self);
          });
        }
      );
    },
    self = null;

  var appWindow = window;
  var AppRes = function (window, _options, _appEvents) {
    appWindow = window;
    appEvents = _appEvents;

    options.lang = getItem(appWindow, "appres.lang");
    if(options.lang==null) {
      options.lang = getSystemLang(appWindow);
    }

    if (_options) {
      if (_options.host) options.host = _options.host;
      if (_options.pkey) options.pkey = _options.pkey;
      if (_options.akey) options.akey = _options.akey;
      if (_options.cmd) options.cmd = _options.cmd;
      if (_options.target) options.target = _options.target;
      if (_options.skey) options.skey = _options.skey;
      if (_options.lang) options.lang = _options.lang;

      if (_options.hash != null) options.hash = _options.hash;

      if (_options.langs_all != null) options.langs_all = _options.langs_all;
      if (_options.title_trans != null) options.title_trans = _options.title_trans;
      
      if (_options.retry != null) options.retry = _options.retry;
      if (_options.time != null) options.time = _options.time;
      if (_options.cache != null) options.cache = _options.cache;
      if (_options.visibility != null) options.visibility = _options.visibility;
      if (_options.excepts != null) options.user_excepts = _options.excepts;
      if (_options.langs_selector != null) {
        if(_options.langs_selector.langs_button_color != null) {
          options.langs_selector.langs_button_color = _options.langs_selector.langs_button_color;
        }          
        if(_options.langs_selector.style != null) {
          if(_options.langs_selector.style.button != null) {
            options.langs_selector.style.button = _options.langs_selector.style.button;
          }
        } 
      } 

      // event functions
      if (_options.onReady != null) appEvents.add("onReady", _options.onReady);
      if (_options.onLanguageChange != null) appEvents.add("onLanguageChange", _options.onLanguageChange);
      if (_options.onLangsSelector != null) appEvents.add("onLangsSelector", _options.onLangsSelector);
    }

    if (options.visibility == "hidden") {
      hideTemporarily(appWindow);
    }

    var ver = getVer(appWindow) || 0;
    var url = options.host +
      "?pkey=" + options.pkey +
      "&akey=" + options.akey +
      "&cmd=" + options.cmd +
      "&target=" + options.target +
      "&skey=" + options.skey;
    if (options.hash != null) {
      url += "&hash=" + options.hash;
    }
    if (options.langs_all != true) {
      url += "&lang=" + options.lang;
    }
    if (ver=="undefined" || ver == 0 || options.cache == false || (options.cache && !equalItem(appWindow, "appres.url", url))) {
      clearItems();
      ver = 0;
    }

    loadAppResScript(appWindow, url, ver);
  }

  AppRes.prototype.self = function (o) {
    if(o) self = o;
    return self;
  };

  AppRes.prototype.appString = function (text, attr) {
    return appString(appWindow, text, attr);
  };

  AppRes.prototype.ready = function (callback, interval, limit) {
    if(callback) {
      if(window.APPRES_STRINGS != null) {
        callback(true);
      } else {
        if(interval==null) interval = 100;
        if(interval<10) interval = 10;
        if(limit==null) limit = 100;
        if(limit<10) limit = 10;
        let count = 0;
        const timerId = setInterval(function() {
          if((window.APPRES_STRINGS != null)) {
            clearInterval(timerId);
            callback(true);
          } else {
            count++;
            if(count>limit) {
              clearInterval(timerId);
              callback(false);  
            }
          }
        }, interval);  
      }
    }
    return (window.APPRES_STRINGS != null);
  };

  AppRes.prototype.appTranslate = function (window, delay, delay2) {
    if(window!=null && typeof window === 'string') {
      if(delay!=null && typeof delay === 'number') {
        delay2 = delay;
      }
      delay = window;
      window = null;
    }
    if(delay!=null && typeof delay === 'string') {
      if(delay2!=null && typeof delay2 === 'number') {
        if(delay2==-1) {
          reset(window || appWindow, delay);
          translate(window || appWindow, delay);
        } else {
          setTimeout(function(){translate(window || appWindow, delay)}, delay2);
        }
        return;
      }
      return translate(window || appWindow, delay);
    }

    if(typeof window === 'number') {
      delay = window;
      window = null;
    }
    if(delay!=null && typeof delay === 'number') {
      if(delay==-1) {
        reset(window || appWindow);
        translate(window || appWindow);
      } else {
        setTimeout(function(){
          translate(window || appWindow);
        }, delay);  
      }
      return;
    }
    return translate(window || appWindow);
  };
  AppRes.prototype.appSelect = function (window, selector) {
    if(window!=null && typeof window === 'string') {
      selector = window;
      window = appWindow;
    }
    return elementSelectAll(window, selector);
  };

  AppRes.prototype.appStyle = function (window, selector, style) {
    if(window!=appWindow && typeof window === 'object' && typeof selector === 'string') {
      if(selector) {
        elementAttr(window, 'style', selector);
      }
      return elementAttr(window, 'style');
    } else {
      if(window!=null && typeof window === 'string') {
        style = selector;
        selector = window;
        window = appWindow;
      }
      var elements = elementSelectAll(window, selector);
      if(style) {
        elements.forEach(function (element) {
          elementAttr(element, 'style', style);
        });
      }
      var styles = [];
      elements.forEach(function (element) {
        styles.push(elementAttr(element, 'style'));
      });
      return styles;
    }
  };

  AppRes.prototype.appRemoveClass = function (window, selector, name) {
    if(window!=appWindow && typeof window === 'object' && typeof selector === 'string') {
      removeClassName(window, selector);
    } else {
      if(window!=null && typeof window === 'string') {
        name = selector;
        selector = window;
        window = appWindow;
      }
      var elements = elementSelectAll(window, selector);
      elements.forEach(function (element) {
        removeClassName(element, name);
      });
    }
  };
  AppRes.prototype.appAddClass = function (window, selector, name) {
    if(window!=appWindow && typeof window === 'object' && typeof selector === 'string') {
      addClassName(window, selector);
    } else {
      if(window!=null && typeof window === 'string') {
        name = selector;
        selector = window;
        window = appWindow;
      }
      var elements = elementSelectAll(window, selector);
      elements.forEach(function (element) {
        addClassName(element, name);
      });  
    }
  };
  AppRes.prototype.appLangsSelectorSmallButton = function (window, retry) {
    langsSelectorSmallButton(window, 0);
  };
  AppRes.prototype.appPosition = function (window, selector) {
    return findPosition(window, selector);
  }

  AppRes.prototype.addEvent = function (name, event) {
    appEvents.add(name, event);
  }
  AppRes.prototype.removeEvent = function (name, event) {
    appEvents.remove(name, event);
  }
  AppRes.prototype.getEvents = function (name) {
    appEvents.get(name);
  }

  AppRes.prototype.appOptions = function (opt, val) {
    if(opt && typeof opt=="object") options = opt;
    else
    if(opt && typeof opt=="string" && val) options[opt] = val;
    else
    if(opt && typeof opt=="string" && val==null) return options[opt];
    return options;
  };
    
  AppRes.prototype.$$ = function (a, b, c) {
    if(a && typeof a === 'string') {
      return self.appString(a);
    }
    if(a==window || a==appWindow) {
      self.appTranslate(a, b, c);
    }
    return self;
  }
  AppRes.prototype.$S = function () {
    return self.appString;    
  }
  AppRes.prototype.$T = function () {
    return self.appTranslate;
  }
  AppRes.prototype.$Q = function () {
    return self.appSelect;
  }
  AppRes.prototype.$F = function () { 
    return formatString(arguments);
  }

  function init(window){
    window.APPRES = new AppRes(window, window.onAppResOptions(), window.APPRES.appEvents);
    window.APPRES.self(window.APPRES);
    window.$$ = window.APPRES.$$;
    window.$S = window.$$().$S();
    window.$T = window.$$().$T();
    window.$Q = window.$$().$Q();
    window.$F = window.$$().$F;
  }

  window.AppRes = AppRes;
  if (typeof define === "function" && define.amd && define.amd.AppRes) {
    define("appres", [], function () { return AppRes; });
  }

  if (document.addEventListener) { 
    // Mozilla, Opera, Webkit 
    var DOMContentLoadedCallee = function () { 
      // document.removeEventListener("DOMContentLoaded", arguments.callee, false); 
      document.removeEventListener("DOMContentLoaded", DOMContentLoadedCallee, false); 
      if(window.onAppResOptions) {
        setTimeout(function() {
          init(window);
        }, 0);
      } else {
        console.log("AppRes: Required onAppResOptions() function !!!");
      }
    };
    document.addEventListener("DOMContentLoaded", DOMContentLoadedCallee, false); 
  } 
  else 
  if (document.attachEvent) { 
    // Internet Explorer 
    var onreadystatechangecallee = function () { 
      if (document.readyState === "complete") { 
        // document.detachEvent("onreadystatechange", arguments.callee); 
        document.detachEvent("onreadystatechange", onreadystatechangecallee); 
        if(window.onAppResOptions) {
          setTimeout(function() {
            init(window);
          }, 0);
        } else {
          console.log("AppRes: Required onAppResOptions() function !!!");
        }
      } 
    };
    document.attachEvent("onreadystatechange", onreadystatechangecallee); 
  }

})(window);


