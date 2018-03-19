function memoize(f) {
  const wm = new WeakMap();
  return function(obj, ...rest) {
    if (typeof obj != 'object') return f(obj, ...rest);
    if (wm.has(obj)) return wm.get(obj);
    const val = f(obj, ...rest);
    wm.set(obj, val);
    return val;
  };
}

function clone(data) {
  if (data == null || typeof data != 'object') return data;
  return Array.isArray(data) ? [...data] : Object.assign({}, data);
}

function reduce(f, data) {
  return arguments.length == 1 ?
    reduceAcc(f, undefined) : baseReduce(f, undefined, data);
}

function reduceAcc(f, acc, data) {
  // Currying
  if (arguments.length == 1) return (...args) => reduceAcc(f, ...args);
  if (arguments.length == 2) return data => reduceAcc(f, clone(acc), data);

  return baseReduce(f, acc, data);
}

function baseReduce(f, acc, data) {
  if (data == null) return;
  let isNotArrayLike = typeof data.length != 'number';
  if (isNotArrayLike && data[Symbol.iterator]) return baseReduceIter(f, acc, data);

  var i = -1, l = (data = isNotArrayLike ? Object.values(data) : data).length;
  return callP(function recur(acc) {
    while (++i < l)
      if ((acc = f(acc, data[i])) instanceof Promise)
        return acc.then(recur);
    return acc;
  }, acc === undefined ? data[++i] : acc);
}

function baseReduceIter(f, acc, data) {
  let iter = toIterator(data);
  return callP(function recur(acc) {
    for (const val of iter)
      if ((acc = f(acc, val)) instanceof Promise)
        return acc.then(recur);
    return acc;
  }, acc === undefined ? iter.next().value : acc);
}

function toIterator(data) {
  return typeof data.values == 'function' ? data.values() : data[Symbol.iterator]();
}

function callP(f, p) {
  return p instanceof Promise ? p.then(f) : f(p);
}

class Tuple {
  constructor() {
    this.value = arguments;
  }
  [Symbol.iterator]() {
    return this.value[Symbol.iterator]();
  }
}

function tuple(...args) {
  var l = args.length;
  while (l--) if (args[l] instanceof Promise) return Promise.all(args).then(toTuple);
  return new Tuple(...args);
}

function toTuple(list) {
  return list.length == 1 && list[0] instanceof Tuple ? list[0] : new Tuple(...list);
}

function isTuple(tp) {
  return tp instanceof Tuple;
}

function call(f, arg) {
  return f(arg);
}

function callRight(arg, f) {
  return f(arg);
}

function callTp(f, arg) {
  return callTpRight(arg, f);
}

function callTpRight(arg, f) {
  return arg instanceof Tuple ? f(...arg) : f(arg);
}

function go(arg, f) {
  return Array.isArray(f) ?
    reduceAcc(callTpRight, arg, f) :
    reduce(callTpRight, arguments);
}

function pipe(f) {
  var fs = Array.isArray(f) ? f : arguments;
  return function() {
    return reduceAcc(callTpRight, toTuple(arguments), fs);
  }
}