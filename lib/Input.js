var state = require('@nichoth/state');
var value = require('observ');
var struct = require('observ-struct');
var codes = require('@nichoth/keycodes');
var extend = require('xtend');
var FocusHook = require('virtual-dom/virtual-hyperscript/hooks/focus-hook.js');
var noop = function() {};


module.exports = Input;

function Input(opts) {

  opts = opts || {};
  opts.onChange = opts.onChange || noop;
  opts.onComplete = opts.onComplete || noop;
  opts.onDelete = opts.onDelete || noop;
  opts.attrs = opts.attrs || {};
  opts.attrs._name = opts.attrs.name;
  if (opts.attrs.name) delete opts.attrs.name;

  var defaults = {
    type: 'text',
    'focus-this': opts.focus ? new FocusHook() : false
  };

  var s = state({
    value: value( opts.value || '' ),
    attrs: struct(extend(defaults, opts.attrs)),
    handles: {
      onChange: onChange(),
      onDelete: onDelete(),
      onComplete: onComplete()
    }
  });

  function onChange() {
    return function(data) {
      s.value.set(data.value);
      // var v = opts.isValid(data.value);
      // if ( v !== s().isValid) {

      // }
      opts.onChange(data.value);
    };
  }

  function onDelete() {
    return function() {
      opts.onDelete();
    };
  }

  function onComplete() {
    return function(ev) {
      opts.onComplete(ev);
    };
  }

  return s;
}


Input.hasValue = function(state) {
  return !!state.value;
};


Input.focus = function(state) {
  state.attrs.set(extend(state.attrs, {
    'focus-this': new FocusHook()
  }));
};


Input.value = function(data) {
  var v = {
    name: data.attrs._name,
    value: data.value
  };
  return v;
};


Input.render = function(h, state) {

  var attrs = extend(state.attrs, {
    name: state.attrs._name,
    value: state.value,
    oninput: function(ev) {
      state.handles.onChange({ value: ev.target.value });
    },
    onkeydown: function(ev) {
      // tab in input with a value
      if ( ev.keyCode === codes.tab && !ev.shiftKey ) {
        if ( state.value && state.handles.onComplete ) {
          state.handles.onComplete(ev);
        }
      }
      // backspace in an input with no value
      if ( ev.keyCode === codes.backspace ) {
        if ( !state.value && state.handles.onDelete ) {
          state.handles.onDelete();
        }
      }
    }
  });

  return h('input.vdom-input', attrs, []);
};
