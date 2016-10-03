'use strict';
//module basics
window.priceCalc={};
priceCalc.config={};
priceCalc.input={};
priceCalc.logic={};
priceCalc.output={};

//input
priceCalc.input.calc = function (event) {
  priceCalc.output.price();
};
priceCalc.input.item = function (target) {
  var form = document.querySelector('.price-calc .list');
  var obj = priceCalc.config;
  //serialize here!!
  priceCalc.output.clearDropdowns(target);
  form.querySelectorAll('select').forEach(function (dropdown) {//get obj via dropdown values
    obj = obj[dropdown.value];
  });
  priceCalc.output.clearItem();
  priceCalc.output.clearPrice();
  var func = priceCalc.logic.isItem(obj) ? 'item' : 'list';
  priceCalc.output[func](obj);
  //re-output if possible here!!
};
priceCalc.input.serialize = function () {
  var obj = {};
  return obj;
};
//logic
priceCalc.logic.capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
priceCalc.logic.getBasePrice = function (obj, area) {
  var base = obj.price;//will be undefined if there is another price-based property
  if (obj.qty) {
    base = priceCalc.logic.getBracketPrice(obj.qty, area);
    //determine which bracket the order falls in
  } else if (obj.area) {
    base = obj.area;
  }
  //return something else if over max?!!
  return base;
};
priceCalc.logic.getBracketPrice = function (qty, area) {
  var arr = qty.reverse();
  var price = 0;
  for (var c = 0, l = arr.length; c < l; c++) {
    var entry = arr[c].split(':').map(function(str) {
      return parseFloat(str);
    });
    var minQty = entry[0];
    price = entry[1];
    if (area >= minQty) {
      break;
    }
  }
  return price;
};
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
priceCalc.output.clearDropdowns = function (target) {
  var parent = target.parentElement;
  var next = target.nextElementSibling;
  if (next) {
    parent.removeChild(next);
    next = target.nextElementSibling;
  }
};
priceCalc.output.clearItem = function () {
  $('.price-calc .item').html('');
};
priceCalc.output.clearPrice = function () {
  $('.price-calc .price').html('');
};
priceCalc.output.dimension = function (dimension, unit) {
  var label = $('<label>');
  var desc = $('<span>').html(priceCalc.logic.capitalize(dimension) + ': ');
  //opted for onclick to avoid memory leaks down the road
  var input = $('<input>').attr('type', 'number').attr('min', '0').val(1).attr('oninput', 'priceCalc.input.calc()').addClass(dimension);
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
  item.append(priceCalc.output.qty(obj));
  priceCalc.output.price();
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
priceCalc.output.obj = function () {
  var obj = priceCalc.config;
  $('.price-calc .list select').each(function () {
    var prop = this.value;
    obj = obj[prop];
  });
  return obj;
};
priceCalc.output.price = function () {//replace input.calc() or spinoff some functionality to it?!!
  var obj = priceCalc.output.obj();
  var h = $('.price-calc .height').val() || 1;
  var w = $('.price-calc .width').val() || 1;
  var qty = $('.price-calc .qty').val() || 0;
  var totalArea = h * w * qty; 
  var base = priceCalc.logic.getBasePrice(obj, totalArea);//adjust for base price here!!
  //if upgrade, add to base price
  var price = base * totalArea;
  //if extra addons, add to price
  $('.price-calc .price').html('Total: $' + price.toFixed(2));
};
priceCalc.output.qty = function (obj) {
  var label = $('<label>');
  var desc = $('<span>').html('Quantity: ');
  var input = $('<input>').attr('type', 'number').addClass('qty').attr('min', 1).val(1).attr('oninput', 'priceCalc.input.calc()');
  return label.append(desc).append(input);
};