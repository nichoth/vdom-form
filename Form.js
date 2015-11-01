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
      field: f.field,
      value: f.value
    });
  }));

  var s = state({
    formFields: fields,
  });

  return s;
}


Form.set = function(state, opts) {
  state.formFields.set(opts.fields.map(function(f) {
    return FormField({field: f.field, value: f.value});
  }));
  // state.formFields.forEach(function(fieldState, i) {
  //   FormField.set(fieldState, opts.fields[i]);
  // });
  // console.log(state());
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
