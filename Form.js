var h = require('virtual-dom/h');
var state = require('@nichoth/state');
var FormField = require('vdom-form-field');
var oArray = require('observ-array');

module.exports = Form;


function Form(opts) {
  opts = opts || {};
  opts.fields = opts.fields || [];

  var fields = oArray(opts.fields.map(function(f) {
    return FormField({
      field: f
    });
  }));

  var s = state({
    formFields: fields,
  });

  return s;
}


Form.getData = function(state) {
  throw new Error('need to implement');
};


// is valid if all inputs have a value. Need to change this
Form.isValid = function(state) {
  var fs = state.formFields();
  return fs.reduce(function(acc, f, i) {
    return acc && FormField.hasValue( state.formFields.get(i) );
  }, true);
};

Form.render = function(state) {

  var fieldEls = state.formFields.map(function(f) {
    return FormField.render(f);
  });

  return h('div.vdom-form', [
    fieldEls
  ]);

};
