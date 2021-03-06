# vdom form

State machine for form components using a virtual dom.


## install

    $ npm install vdom-form


## example

[Demo](https://d1373243a46c54c5f34da83c284557090d46aebf.htmlb.in)

```js
var vdom = require('virtual-dom');
var h = vdom.h;

var Form = require('../Form.js');
var UploadField = require('../lib/FileUpload.js');
var Field = require('../lib/FormField.js');
var ImageUpload = require('../lib/ImageUpload.js');

function curry(component, args) {
  var c = component.bind(null, args);
  Object.keys(component).forEach(function(fn) {
    c[fn] = component[fn];
  });
  c.render = c.render.bind(null, h);
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
      field: 'upload a file',
      isValid: function(files) {
        var v = files.length > 0;
        return v;
      },
      onChange: function(files) {
        console.log('file changed', files);
      }
    }),
    curry(ImageUpload, {
      field: 'upload an image'
    })
  ],
});

var loop = require('main-loop')( state(), render, vdom );
state(loop.update);
document.getElementById('content').appendChild(loop.target);

function render(state) {

  return h('form.my-form', {
    onsubmit: onSubmit.bind(null, state)
  }, [
    Form.render(h, state),
    h('button', {
      type: 'submit',
      disabled: !Form.isValid(state)
    }, ['Save'])
  ]);
}

function onSubmit(data, ev) {
  ev.preventDefault();
  console.log('submit event');
  console.log( Form.values(data) );
}

```
