var extend = require('xtend');

module.exports = function curry(component, args) {

  var c = function(opts){

    var merged = extend(args, opts);
    return component(merged);

  };

  Object.keys(component).forEach(function(key) {
    c[key] = function() {
      return component[key].apply(null, arguments);
    };
  });

  return c;

};
