var restoreFunctions = [];

var after = function after(host, name, cb) {
  var originalFn = host[name];
  var restoreFn = undefined;

  if (originalFn) {
    host[name] = function () {
      originalFn.apply(this, arguments);
      cb(host);
    };
    restoreFn = function () {
      return host[name] = originalFn;
    };
  } else {
    host[name] = function () {
      cb(host);
    };
    restoreFn = function () {
      return delete host[name];
    };
  }

  restoreFunctions.push(restoreFn);
};

after.restorePatchedMethods = function () {
  restoreFunctions.forEach(function (restoreFn) {
    return restoreFn();
  });
  restoreFunctions = [];
};

module.exports = after;
