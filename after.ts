let restoreFunctions: Function[] = [];

function after(host: React.Component, name: string, cb: Function): void {
  const originalFn: Function = host[name];
  let restoreFn: () => void;

  if (originalFn) {
    host[name] = function(...args): void {
      originalFn.apply(this, args);
      cb(host);
    };
    restoreFn = function(): void {
      host[name] = originalFn;
    };
  } else {
    host[name] = function(): void {
      cb(host);
    };
    restoreFn = function(): void {
      delete host[name];
    };
  }

  restoreFunctions.push(restoreFn);
}

after.restorePatchedMethods = function(): void {
  restoreFunctions.forEach(restoreFn => restoreFn());
  restoreFunctions = [];
};

export = after;
