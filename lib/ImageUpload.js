var UploadField = require('./FileUpload');
var state = require('@nichoth/state');
var fileUtil = require('component-file');
var extend = require('xtend');
var value = require('observ');


module.exports = ImageUpload;


function ImageUpload(opts) {

  // var fileOpts = extend(opts);
  // delete fileOpts.src;

  var uploadEmitter = UploadField({
    field: opts.field,
    accept: opts.accept || 'image/*',
    isValid: function(files) {
      var v = files.length > 0 && files.reduce(function(acc, f) {
        return acc && f.type.indexOf('image/') > -1;
      }, true);
      return v;
    }
  });

  var s = state({
    src: value(opts.src || ''),
    field: value(opts.field),
    file: value('')
  });

  s.file.set(uploadEmitter());

  uploadEmitter(function onChange(data) {
    if ( UploadField.hasValue(data) ) {
      var file = UploadField.value(data).value[0];
      fileUtil(file).toDataURL(function done(err, url) {
        if (s.src() !== url) return s.src.set(url);
      });
    }
    s.file.set(data);
  });

  return s;
}


Object.keys(UploadField).forEach(function(key) {
  ImageUpload[key] = function(data) {
    return UploadField[key](data.file);
  };
});


ImageUpload.render = function(h, state) {

  function previewEl() {
    var attrs = {
      src: state.src
    };

    return h('img.vdom-image-upload-preview', attrs);
  }

  return h('div.vdom-image-upload', [
    state.src ? h('label.vdom-file-upload-label', [state.field]) : '',
    state.src ? previewEl() : UploadField.render(h, state.file)
  ]);
};
