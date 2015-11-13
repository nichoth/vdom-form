var h = require('virtual-dom/h');
var state = require('@nichoth/state');
var oArray = require('observ-array');

module.exports = Form;


function Form(opts) {
  opts = opts || {};
  opts.fields = opts.fields || [];

  var fields = oArray( map(opts.fields, function(component) {
    return struct({
      state: component(),
      component: value(component)
    });
  }));

  var s = state({
    fields: fields,
    isValid: value(opts.isValid || false),
    handles: {
      onChange: onChange,
      submit: submitHandler.bind(null, action)
    }
  });

  return s;
}


Form.isValid = function(data) {
  return data.fields.reduce(function(acc, f){
    return acc && f.component.isValid(f.state);
  }, true);
};


Form.values = function(elmts) {
  return data.fields.reduce(function(acc, f, i) {
    var v = f.component.value(f.state);
    acc[v.name] = v.value;
    return acc;
  }, {});
};


Form.render = function(state) {

  var fieldEls = state.fields.map(function(f) {
    return f.component.render(f.state);
  });

  return h('div.vdom-form', [
    fieldEls
  ]);

};
