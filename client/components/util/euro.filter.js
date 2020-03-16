'use strict';

Number.prototype.formatMoney = function(c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? '.' : d,
    t = t == undefined ? ',' : t,
    s = n < 0 ? '-' : '',
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};


export default function euroFilter() {
  return function(input, addAbr, floor) {
    if (typeof input === 'undefined')
      return;
    if(input >= 5000)
      input = (floor ? Math.floor(input / 1000) : Math.ceil(input / 1000)) * 1000;
    var short = (input / 100000).formatMoney(input <= 5000 && input > -5000 && input !== 0 ? '4' : '2', '.', ' ') + ' $';
    var long = (input / 100000).formatMoney('4', ',', ' ') + ' €';
    if (addAbr)
      return `<abr title='${long}'>${short}</abr>`;
    else
      return `${short}`;
  }
}
