!function() {
  const base$ = name => (selector, parent = document) => parent[name](selector);

  const $ = base$('querySelector');
  $.find = curry2($);

  $.all = base$('querySelectorAll');
  $.findAll = curry2($.all);

  $.closest = curry2((selector, el) => el.closest(selector));

  $.append = curry2((parent, child) => parent.appendChild(child));
  $.append2 = curry2((parent, child) => (parent.appendChild(child), parent));

  $.prepend = curry2((parent, child) => parent.insertBefore(child, parent.firstChild));
  $.prepend2 = curry2((parent, child) => (parent.insertBefore(child, parent.firstChild), parent));

  $.animate = curry2((options, el) =>
    go(anime(Object.assign({ targets: el, easing: 'easeInOutQuart', duration: 500 }, options)).finished, _ => el));

  $.remove = el => {
    el.parentNode.removeChild(el);
    each(args => el.removeEventListener(...args), el._events);
    return el;
  };

  $.val = (el, val = el.value) =>
    typeof val == "string" ? val.replace(/\r/g, "") : val == null ? "" : val;

  $.setVal = curry2((val, el) => (el.value = val, el));

  $.focus = i => i.focus();

  $.on = function(el, event, sel, f) {
    if (arguments.length == 3) return el => $.on(el, ...arguments);
    function handler(e) {
      some(c => c == e.target, $.findAll(sel, el)) && f(Object.assign(e, { delegateTarget: el }));
    }
    el.addEventListener(event, handler);
    el._events = el._events || [];
    el._events.push([event, handler]);
    return el;
  };

  $.el = html => {
    var els, tmp;
    if (/^<(tr|th|td).*><\/(tr|th|td)>$/.test(html)) {
      tmp = document.createElement('table');
      tmp.innerHTML = html;
      tmp = tmp.firstChild;
      if (RegExp.$1 != 'tr') tmp = tmp.firstChild;
    } else {
      tmp = document.createElement('div');
      tmp.innerHTML = html;
    }
    return (els = map(v => v, tmp.children)).length == 1 ? els[0] : els;
  };

  window.$ = $;
} ();