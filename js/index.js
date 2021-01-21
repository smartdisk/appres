'use strict';

const pkg = require('../package.json');
const HOST = pkg.api.host;

Object.defineProperty(exports, "__esModule", { value: true });
var AppRes = /** @class */ (function () {
  
  function AppRes() {
  }

  AppRes.prototype.test = function () {
    return 'test';
  };

  AppRes.appres = new AppRes();
  AppRes.test = function() {
    return this.appres.test();
  };
  
  return AppRes;
}());

module.exports = AppRes;
module.exports.AppRes = AppRes;

