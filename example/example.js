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
      value: 'default value',
      isValid: function(value) {
        return value.length > 5;
      }
    }),
    curry(UploadField, {
      label: 'upload a file'
    })
  ],
});

// console.log( Form.values(state) );

var loop = require('main-loop')( state(), render, vdom );
state(loop.update);
document.getElementById('content').appendChild(loop.target);

function render(state) {
  return h('form.my-form', {
    onsubmit: onSubmit
  }, [
    Form.render(state),
    h('button', {
      type: 'submit',
      disabled: !Form.isValid(state)
    }, ['Save'])
  ]);
}

function onSubmit(ev) {
  ev.preventDefault();
  console.log('submit event');
  console.log(ev.target.elements);
}
