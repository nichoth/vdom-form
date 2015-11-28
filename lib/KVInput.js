var struct = require('observ-struct');
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

  var state = struct({
    fieldInput: Input({
      onDelete: onDelete,
      onChange: onChange,
      focus: opts.focus === 'field',
      attrs: {
        placeholder: 'field'
      },
    }),
    valueInput: Input({
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
      field: Input.value(state.fieldInput()),
      value: Input.value(state.valueInput())
    });
    if (v !== state.isValid()) { state.isValid.set(v); }
  }

  function onComplete(ev) {
    if ( Input.hasValue(state.field) && Input.hasValue(state.value) ) {
      opts.onComplete(ev);
    }
  }

  function onDelete() {
    if ( !(Input.hasValue(s.field)) && !(Input.hasValue(s.value)) ) {
      opts.onDelete();
    }
  }

  return state;
}

KVInput.value = function(data) {
  return {
    field: Input.value(data.fieldInput),
    value: Input.value(data.valueInput),
  };
};

KVInput.hasValue = function(data) {
  return Input.hasValue(data.fieldInput) && Input.hasValue(data.valueInput);
};

KVInput.isValid = function(data) {
  return data.isValid;
}

KVInput.isComplete = function(data) {
  return Input.hasValue(data.field) && Input.hasValue(data.value);
};


KVInput.render = function(h, state) {
  return h('div.vdom-kv-input', [
    Input.render(state.fieldInput),
    Input.render(state.valueInput)
  ]);
};
