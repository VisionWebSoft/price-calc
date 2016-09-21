'use strict';
//module basics
window.priceCalc={};
priceCalc.config={};
priceCalc.input={};
priceCalc.logic={};
priceCalc.output={};

//input
priceCalc.input.item = function (target) {
  var form = target.parentElement;
  var obj = priceCalc.config;
  form.querySelectorAll('select').forEach(function (dropdown) {
    obj = obj[dropdown.value];
  });
  var func = priceCalc.logic.isItem(obj) ? 'item' : 'list';
  priceCalc.output[func](obj,form);
};

//logic
priceCalc.logic.isItem = function (obj) {
  return obj.area || obj.qty;
};

//output
priceCalc.output.area = function (obj) {
};
priceCalc.output.init = function () {
  priceCalc.output.list();
};
priceCalc.output.item = function (obj, form) {
  var form = form || document.querySelector('form');
  var func = obj.area ? 'area' : 'qty';
  priceCalc.output[func](obj, form);
};
priceCalc.output.list = function (obj, form) {
  var form = form || document.querySelector('form');
  var obj = obj || priceCalc.config;
  var list = document.createElement('select');
  list.onchange = function (event) {
    priceCalc.input.item(event.target);
  };
  var arr= Object.keys(obj);
  arr.unshift('');
  arr.forEach(function (key) {
    var item = document.createElement('option');
    item.innerHTML = key;
    item.value = key;
    list.appendChild(item);
  });
  form.appendChild(list);
};
priceCalc.output.qty = function (obj) {
};