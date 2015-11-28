var test = require('tape');
var forEach = require('lodash.foreach');
var inputs = {
  formField: require('../lib/FormField.js'),
  fileUpload: require('../lib/FileUpload.js'),
  imageUpload: require('../lib/ImageUpload.js')
};

forEach(inputs, function(component, k) {
  test(k + ' implements the methods', function (t) {

    t.plan(3);

    var methods = {
      value: function(){},
      hasValue: function(){},
      isValid: function(){}
    };

    forEach(methods, function(fn, fnName) {
      t.equal(typeof component[fnName], typeof fn, fnName);
    });

  });
});
