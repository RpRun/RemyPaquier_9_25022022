import $ from 'jquery';
global.$ = global.jQuery = $;

// on mock jQuery
$.fn.modal = jest.fn();
