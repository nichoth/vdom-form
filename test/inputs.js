var test = require('tape');
var forEach = require('lodash.foreach');
var inputs = {
  formField: require('../lib/FormField.js'),
  fileUpload: require('../lib/FileUpload.js'),
  imageUpload: require('../lib/ImageUpload.js'),
  kvInput: require('../lib/KVInput.js')
};

forEach(inputs, function(component, k) {
  test(k + ' implements the methods', function (t) {

    t.plan(6);

    var methods = {
      value: function(){
        return {};
      },
      hasValue: function(){
        return true;
      },
      isValid: function(){
        return true;
      }
    };

    forEach(methods, function(fn, fnName) {
      var data = component()();
      t.equal(typeof component[fnName], typeof fn, fnName);
      t.equal(typeof component[fnName](data), typeof fn(),
        fnName + ' returns the right type')
      ;
    });

  });
});
