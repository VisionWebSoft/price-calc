'use strict';
//module basics
window.priceCalc={};
priceCalc.config={};
priceCalc.input={};
priceCalc.logic={};
priceCalc.output={};

//input
priceCalc.input.calc = function (event) {
};
priceCalc.input.item = function (target) {
  var form = document.querySelector('.price-calc .list');
  var obj = priceCalc.config;
  //remove all dropdowns after this target!!
  form.querySelectorAll('select').forEach(function (dropdown) {
    obj = obj[dropdown.value];
  });
  var func = priceCalc.logic.isItem(obj) ? 'item' : 'list';
  console.log(func);
  priceCalc.output[func](obj);
};
priceCalc.input.serialize = function () {
  var obj = {};
  return obj;
};
//logic
priceCalc.logic.isItem = function (obj) {
  return obj.area || obj.qty || obj.price;
};

//output
priceCalc.output.area = function (obj) {
  var area = $('<div>');
  var unit = obj.unit || 'ft';
  var width = priceCalc.output.dimension('width', unit);
  var height = priceCalc.output.dimension('height', unit);
  return area.append(width).append(height);
};
priceCalc.output.dimension = function (dimension, unit) {
  var label = $('<label>');
  var desc = $('<span>').html(dimension);
  //opted for onclick to avoid memory leaks down the road
  var input = $('<input>').attr('type', 'number').addClass(dimension).attr('onclick', function (event) {
    priceCalc.input.calc(event);
  });
  var unit = $('<span>').html(unit);
  return label.append(desc).append(input).append(unit);
};
priceCalc.output.init = function () {
  priceCalc.output.list();
};
priceCalc.output.item = function (obj) {
  var item = $('.price-calc .item');
  var state = priceCalc.input.serialize(item);
  item.html('');
  if (obj.area) {
    item.append(priceCalc.output.area(obj));
  }
  //generate qty here!!
};
priceCalc.output.list = function (obj) {
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
  document.querySelector('.price-calc .list').appendChild(list);
};