var state = require('@nichoth/state');
var Input = require('./Input.js');
var value = require('observ');
var struct = require('observ-struct');
var extend = require('xtend');

module.exports = FormField;

function FormField(opts) {

  opts = opts || {};
  opts.field = opts.field || '';
  var isValid = opts.isValid || function(){ return true; };

  var s = state({
    field: value(opts.field),
    input: Input({
      value: opts.value,
      attrs: {
        name: opts.field.toLowerCase()
      },
      onChange: function(value) {
        var v = isValid(value);
        if (v !== s().isValid) {
          s.isValid.set(v);
        }
      }
    }),
    isValid: value( isValid(opts.value || '') ),
    attrs: struct( extend({}, opts.attrs) )
  });

  return s;
}


FormField.isValid = function(data) {
  return data.isValid;
};


FormField.hasValue = function(state) {
  var hv = Input.hasValue( state.input );
  return hv;
};


FormField.value = function(data) {
  return Input.value(data.input);
};


FormField.render = function(h, state) {
  return h('div.vdom-form-field', [
    h('label', [state.field]),
    Input.render(h, state.input)
  ]);
};
