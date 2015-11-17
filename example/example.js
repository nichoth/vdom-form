var vdom = require('virtual-dom');
var h = vdom.h;
var Form = require('../Form.js');

var UploadField = require('vdom-components/FileUpload.js');
var Field = require('vdom-form-field');

function curry(component, args) {
  var c = component.bind(null, args);
  Object.keys(component).forEach(function(fn) {
    c[fn] = component[fn];
  });
  return c;
}

var state = Form({
  fields: [
    curry(Field, {
      field: 'example',
      value: 'default value'
    }),
    curry(UploadField, {
      label: 'upload a file'
    })
  ],
});

// console.log( Form.values(state) );

var loop = require('main-loop')( state(), Form.render, vdom );
state(loop.update);
document.getElementById('content').appendChild(loop.target);
