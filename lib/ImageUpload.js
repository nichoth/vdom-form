var UploadField = require('./FileUpload');
var state = require('@nichoth/state');
var fileUtil = require('component-file');
var extend = require('xtend');
var value = require('observ');
// var curry = require('./curry-component');


module.exports = ImageUpload;


// var ImageUpload = curry(UploadField, {
//   isValid: function(files) {
//     return files.length && files.reduce(function(acc, f) {
//       return acc && f.type.indexOf('image/') > -1;
//     }, true);
//   }
// });



function ImageUpload(opts) {

  var fileOpts = extend(opts);
  delete fileOpts.src;

  var uploadEmitter = UploadField(extend(opts, {
    accept: opts.accept || 'image/*',
    isValid: function(files) {
      return files.length && files.reduce(function(acc, f) {
        return acc && f.type.indexOf('image/') > -1;
      }, true);
    }
  }));

  var s = state({
    src: value(opts.src || ''),
    file: value('')
  });

  s.file.set(uploadEmitter());

  uploadEmitter(function onChange(data) {
    if ( UploadField.hasValue(data) ) {
      var file = UploadField.value(data).value[0];
      console.log(data);
      console.log(file);
      fileUtil(file).toDataURL(function done(err, url) {
        if (s.src() !== url) s.src.set(url);
      });
    }
    s.file.set(data);
  });

  return s;
}


ImageUpload.render = function(h, state) {

  console.log(state);

  function previewEl() {
    var attrs = {
      src: state.src
    };

    return h('div.vdom-image-upload-preview', [
      h('img', attrs)
    ]);
  }

  return h('div.vdom-image-upload', [
    state.src ? previewEl() : UploadField.render(h, state.file)
  ]);
};
