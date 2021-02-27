/*!
 * AppRes JavaScript Library v0.0.15
 * https://appres.org/
 *
 * Copyright 2021 APPRES.ORG and other contributors
 * Released under the MIT license
 * https://appres.org/license
 *
 * Create Date: 2021.02.07 KST
 * Last Update: 2021.02.27 KST
 */

if(window.globalThis==null) {
  window.globalThis = window;
}

(function (window) {
  var
    options = {
      host: "https://appres.org/functions/api",
      //host: "http://127.0.0.1:5001/appres-org/us-central1/api",
      pkey: "GXYqIgrafjTRatwTB96d",
      akey: "39f031e6-94a0-4e14-b600-82779ec899d7",
      cmd: "string",
      target: "js",
      skey: "default",
      lang: "ja-JP",
      retry: 50,
      time: 25,
      cache: true,
      visibility: "hidden",
      langs_all: false,
      langs_selector: {
        langs: ".appres-langs",
        langs_button: ".appres-langs-button",  
        langs_items: ".appres-langs-items",
        style: {
          button: "auto"
        }
      },
      default_excepts: ["material-icons", "mat-tab-group"],
      user_excepts: []
    },
    isInitLangsSelector = false,
    loadScript = function (window, url, callback) {
      var script = window.document.createElement("script");
      script.type = 'text/javascript';
      // IE에서는 onreadystatechange를 사용 
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
    elementAttr = function (element, attr, val) {
      if (val) {
        element.setAttribute(attr, val);
        return element.getAttribute(attr);
      } 
      return element.getAttribute(attr);
    },
    appString = function (window, element) {
      var newtext = null;
      if (typeof window === "string") {
        element = window;
        window = appWindow;
      }
      if (typeof element === "string") {
        if(window.APPRES_STRINGS) {
          newtext = window.APPRES_STRINGS[element];
        }
        return newtext || element;
      }
      
      var text = elementText(element);
      if (window.APPRES_STRINGS) {
        if (element.hasAttribute('appres')) {
          newtext = window.APPRES_STRINGS[element.getAttribute('appres')];
        } else {
          if (text != null) {
            element.setAttribute('appres', text);
            newtext = window.APPRES_STRINGS[text];
          }
        }
      }
      if (newtext) {
        if (typeof newtext === "object") {
          var _newtext = newtext[options.lang];
          if (_newtext == "") {
            _newtext = newtext["default"];
          }
          newtext = _newtext;
        }
      } else {
        if (window.APPRES_STRINGS) {
          console.log("AppRes:" + options.lang + ":" + text);
        } else {
          console.log("AppRes:" + options.lang + ":" + text + " " + "(Not found APPRES_STRINGS!!!)");
        }
      }
      return newtext;
    },
    appAttr = function (window, element, attr) {
      var newval = null;
      var val = elementAttr(element, attr);
      if (window.APPRES_STRINGS) {
        if (element.hasAttribute('appres-'+attr)) {
          newval = window.APPRES_STRINGS[element.getAttribute('appres-'+attr)];
        } else {
          if (val != null) {
            element.setAttribute('appres-'+attr, val);
            newval = window.APPRES_STRINGS[val];
          }
        }
      }
      if (newval) {
        if (typeof newtext === "object") {
          var _newval = newval[options.lang];
          if (_newval == "") {
            _newval = newval["default"];
          }
          newval = _newval;
        }
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
        if(isInitLangsSelector==false) {
          initLangsSelector(window);
        }


        if(elementAttr(element, "appres-lang")==options.lang) {
          if(callback) callback(true);
          return;
        }

        // console.log(" " + elementText(element) + "," + element.className);

        // innerText
        if(element.childNodes.length==1) {
          if(elementText(element)!=null) {
            if(!isExpects(element)) {
              elementText(element, appString(window, element) || elementText(element));
            }
          }
        }

        // attributes
        var attr = 'title';
        if(elementAttr(element, attr)) {
          elementAttr(element, attr, appAttr(window, element, attr) || elementAttr(element, attr));
        }

        if (window.onChangedAppRes) {
          window.onChangedAppRes(element, true);
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
      removeItem(window, "appres.ver");
      removeItem(window, "appres.url");
      removeItem(window, "appres.langs");
      removeItem(window, "appres.strings");
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
          setLangsSelector(window);
          items_div.setAttribute('style', "display:block");
        } else {
          clearLangsSelector(window);
          items_div.setAttribute('style', "display:none");
        }  
      }
    },
    clearLangsSelector = function (window) {
      var items_div = getLangsSelector(window);
      if(items_div) {
        while (items_div.firstChild) {
          items_div.removeChild(items_div.lastChild);
        }        
      }
    },
    setLangsSelector = function (window) {
      var items_div = getLangsSelector(window);
      if(items_div) {
        var langs = Object.keys(window.APPRES_LANGS);
        langs.forEach(function (lang) {
          var lang_name = window.APPRES_LANGS[lang];
          var lang_div = document.createElement('div');
          lang_div.id = lang;
          if(options.lang==lang) {
            lang_div.className = "selected";
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
                applyPageAll(window);
              } else {
                window.location.reload();
              }
            }
          }
        });
      }
    },
    initLangsSelector = function (window) {
      var langs_button = getLangsButton(window);
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
          isInitLangsSelector = true;

          var appres_langs = getLangs(window);
          if(appres_langs) {
            appres_langs.setAttribute('style', 'display:block');
          }
        }
        langs_button.onclick = function(e) {
          toggleLangsSelector(window);
        }  
      }
    },
    translate = function (window, sels) {
      var elements = (sels==null) ? elementSelectAll(window, ".appres") : elementSelectAll(window, ".appres " + sels);
      elements.forEach(function (element) {
        appTranslateAsync(window, element, 0, function (success) {
          if(success && elementAttr(element, "appres-lang")==null) {
            if (options.visibility == "hidden") {
              element.setAttribute('style', 'visibility:visible');
            }  
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
    self = null;

  var appWindow = window;
  var AppRes = function (window, _options) {
    appWindow = window;

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
      if (_options.langs_all) options.langs_all = _options.langs_all;
      if (_options.retry != null) options.retry = _options.retry;
      if (_options.time != null) options.time = _options.time;
      if (_options.cache != null) options.cache = _options.cache;
      if (_options.visibility != null) options.visibility = _options.visibility;
      if (_options.excepts != null) options.user_excepts = _options.excepts;
      if (_options.langs_selector != null) {
        if(_options.langs_selector.style != null) {
          if(_options.langs_selector.style.button != null) {
            options.langs_selector.style.button = _options.langs_selector.style.button;
          }
        } 
      } 
    }

    if (options.visibility == "hidden") {
      hideTemporarily(appWindow);
    }

    var ver = getVer(appWindow) || 0;
    var appres_url = options.host +
      "?pkey=" + options.pkey +
      "&akey=" + options.akey +
      "&cmd=" + options.cmd +
      "&target=" + options.target +
      "&skey=" + options.skey;
    if (options.langs_all != true) {
      appres_url += "&lang=" + options.lang;
    }
    appres_url += "&ver=" + ver;

    if (ver == 0 || options.cache == false || (options.cache && !equalItem(appWindow, "appres.url", appres_url))) {
      clearItems(appWindow);
    }

    var appres_langs = null;
    if (options.cache) {
      appres_langs = getItem(appWindow, "appres.langs");
      if (appres_langs) {
        try {
          var appres_langs_json = JSON.parse(appres_langs);
          var key_count = Object.keys(appres_langs_json).length;
          if (key_count > 0) {
            appWindow.APPRES_LANGS = appres_langs_json;
            appres_langs = true;
          } else {
            appres_langs = false;
          }
        } catch (e) {
          clearItems(appWindow);
          appres_langs = null;
        }
      }
    }

    var appres_strings = null;
    if (options.cache) {
      appres_strings = getItem(appWindow, "appres.strings");
      if (appres_strings) {
        try {
          var appres_strings_json = JSON.parse(appres_strings);
          var key_count = Object.keys(appres_strings_json).length;
          if (key_count > 0) {
            appWindow.APPRES_STRINGS = appres_strings_json;
            appres_strings = true;
          } else {
            appres_strings = false;
          }
        } catch (e) {
          clearItems(appWindow);
          appres_strings = null;
        }
      }
    }

    if (options.cache && appres_langs == true && appres_strings == true) {
      console.log("AppRes: Loaded app string from cached");
      translate(appWindow);
      if (appWindow.onLoadedAppRes) {
        appWindow.onLoadedAppRes();
      }
    } else {
      loadScript(appWindow, appres_url,
        function () {
          console.log("AppRes: Loaded app string from appres url");
          if (options.cache) {
            setItem(appWindow, "appres.url", appres_url);
            setItem(appWindow, "appres.langs", JSON.stringify(window.APPRES_LANGS));
            setItem(appWindow, "appres.strings", JSON.stringify(window.APPRES_STRINGS));
          }
          translate(appWindow);
          if (appWindow.onLoadedAppRes) {
            appWindow.onLoadedAppRes();
          }
        }
      );
    }
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
        setTimeout(function(){translate(window || appWindow, delay)}, delay2);
        return;
      }
      return translate(window || appWindow, delay);
    }

    if(typeof window === 'number') {
      delay = window;
      window = null;
    }
    if(delay!=null && typeof delay === 'number') {
      setTimeout(function(){
        return translate(window || appWindow);
      }, delay);
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

  window.AppRes = AppRes;
  if (typeof define === "function" && define.amd && define.amd.AppRes) {
    define("appres", [], function () { return AppRes; });
  }


  function init(window){
    window.APPRES = new AppRes(window, window.onAppResOptions());
    window.APPRES.self(window.APPRES);
    window.$$ = window.APPRES.$$;
    window.$S = window.$$().$S();
    window.$T = window.$$().$T();
    window.$Q = window.$$().$Q();
    window.$F = window.$$().$F;
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


