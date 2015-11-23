var state = require('@nichoth/state');
var struct = require('observ-struct');
var observ = require('observ');
var oArray = require('observ-array');
var toArray = require('lodash.toarray');

var noop = function(){};

module.exports = FileUpload;


function FileUpload(opts) {
  opts = opts || {};
  opts.field = opts.field || '';
  opts.onChange = opts.onChange || noop;
  opts.isValid = opts.isValid || function(){ return true; };


  var s = state({
    field: observ(opts.field || ''),
    _name: observ(opts.name || opts.field.toLowerCase() || 'file'),
    files: oArray([]),
    accept: opts.accept ? observ(opts.accept) : undefined,
    handles: {
      onChange: onChange,
      isValid: opts.isValid
    }
  });

  function onChange(files) {
    s.files.set( toArray(files) );
    opts.onChange(files);
  }

  return s;
}


FileUpload.value = function(data) {
  var v = {
    name: data._name,
    value: data.files
  };
  return v;
};


FileUpload.hasValue = function(data) {
  return data.files.length > 0;
};


FileUpload.isValid = function(data) {
  return data.handles.isValid(data.files);
};


FileUpload.render = function(h, state) {
  return h('div.vdom-file-upload', [
    h('label.vdom-file-upload-label', [state.field]),
    h('input', {
      type: 'file',
      name: state.name,
      accept: state.accept,
      onchange: function(ev) {
        state.handles.onChange(this.files);
      }
    }, [])
  ]);
};
