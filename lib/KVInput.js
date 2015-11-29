var struct = require('observ-struct');
var state = require('@nichoth/state');
var value = require('observ');
var Input = require('./Input.js');
var noop = function(){};


module.exports = KVInput;

function KVInput(opts) {
  opts = opts || {};
  opts.onComplete = opts.onComplete || noop;
  opts.onDelete = opts.onDelete || noop;
  opts.focus = opts.focus || '';
  opts.isValid = opts.isValid || function(){ return true; };

  var s = state({
    fieldInput: Input({
      value: opts.field,
      onDelete: onDelete,
      onChange: onChange,
      focus: opts.focus === 'field',
      attrs: {
        placeholder: 'field'
      },
    }),
    valueInput: Input({
      value: opts.value,
      onComplete: onComplete,
      onChange: onChange,
      focus: opts.focus === 'value',
      attrs: {
        placeholder: 'value'
      },
    }),
    isValid: value(opts.isValid({field: opts.field, value: opts.value}))
  });

  function onChange() {
    var v = opts.isValid({
      field: Input.value(s.fieldInput()),
      value: Input.value(s.valueInput())
    });
    if (v !== s.isValid()) { s.isValid.set(v); }
  }

  function onComplete(ev) {
    if (Input.hasValue(s.fieldInput) && Input.hasValue(s.valueInput)) {
      opts.onComplete(ev);
    }
  }

  function onDelete() {
    if ( !(Input.hasValue(s.fieldInput())) &&
      !(Input.hasValue(s.valueInput())) ) {
      opts.onDelete();
    }
  }

  return s;
}

KVInput.value = function(data) {
  return {
    field: Input.value(data.fieldInput).value,
    value: Input.value(data.valueInput).value,
  };
};

KVInput.focusValue = function(state) {
  Input.focus(state.valueInput);
};

KVInput.hasValue = function(data) {
  return Input.hasValue(data.fieldInput) && Input.hasValue(data.valueInput);
};

KVInput.isValid = function(data) {
  return data.isValid;
};

KVInput.isComplete = function(data) {
  return Input.hasValue(data.fieldInput) && Input.hasValue(data.valueInput);
};


KVInput.render = function(h, state) {
  return h('div.vdom-kv-input', [
    Input.render(h, state.fieldInput),
    Input.render(h, state.valueInput)
  ]);
};
