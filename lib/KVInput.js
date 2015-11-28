var struct = require('observ-struct');
var Input = require('./Input.js');
var noop = function(){};


module.exports = KVInput;

function KVInput(opts) {
  opts = opts || {};
  opts.onComplete = opts.onComplete || noop;
  opts.onDelete = opts.onDelete || noop;
  opts.focus = opts.focus || '';

  var state = struct({
    fieldInput: Input({
      onDelete: onDelete,
      focus: opts.focus === 'field'
      attrs: {
        placeholder: 'field'
      },
    }),
    valueInput: Input({
      onComplete: onComplete,
      focus: opts.focus === 'value'
      attrs: {
        placeholder: 'value'
      },
    })
  });

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

KVInput.isComplete = function(data) {
  return Input.hasValue(data.field) && Input.hasValue(data.value);
};


KVInput.render = function(h, state) {
  return h('div.vdom-kv-input', [
    Input.render(state.fieldInput),
    Input.render(state.valueInput)
  ]);
};
