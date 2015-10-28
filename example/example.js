var vdom = require('virtual-dom');
var h = vdom.h;
var Form = require('../Form.js');

var state = Form({
  fields: ['title', 'author'],
});

console.log( Form.getData(state) );

var loop = require('main-loop')( state(), Form.render, vdom );
state(loop.update);
document.getElementById('content').appendChild(loop.target);
