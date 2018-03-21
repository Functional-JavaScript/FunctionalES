!function() {
  const curry2 = f => (..._) => _.length < 2 ? (..._2) => f(..._, ..._2) : f(..._);

  const then = curry2((f, a) => a instanceof Promise ? a.then(f) : f(a));

  const log = console.log;

  const ObjIter = curry2((generator, coll, iter = generator(coll)) => {
    return { next: _=> iter.next(), [Symbol.iterator]() { return this } }
  });

  Object.assign(ObjIter, {
    values: ObjIter(function *(coll) {
      if (!coll) return;
      for (const key in coll) yield coll[key];
    }),
    entries: ObjIter(function *(coll) {
      if (!coll) return;
      for (const key in coll) yield [key, coll[key]];
    })
  });

  const hasIter = a => a && a[Symbol.iterator],
    isObject = a => a && typeof a == 'object';

  const valuesIter = coll =>
    hasIter(coll) ?
      coll[typeof coll.values == 'function' ? 'values' : Symbol.iterator]() :
      ObjIter.values(coll); // isPlainObject

  const reduce = curry2((f, acc, coll) => {
    const iter = valuesIter(coll === undefined ? acc : coll);
    return then(function recur(acc) {
      for (const val of iter) {
        if ((acc = f(acc, val)) instanceof Promise)
          return acc.then(recur);
      }
      return acc;
    }, coll === undefined ? iter.next().value : acc);
  });

  class Tuple {
    constructor() {
      this.value = arguments;
    }
    [Symbol.iterator]() {
      return this.value[Symbol.iterator]();
    }
  }

  function tuple(...args) {
    if (args.length == 1) return args[0];
    return find(arg => arg instanceof Promise, args) ?
      then(toTuple, Promise.all(args)) :
      new Tuple(...args);
  }

  function toTuple(list) {
    return list.length == 1 ? list[0] : tuple(...list);
  }

  function callRight(arg, f) {
    return arg instanceof Tuple ? f(...arg) : arg === undefined ? f() : f(arg);
  }

  const map = curry2((f, coll) =>
    coll instanceof Function ?
      pipe(coll, f)
    :
    coll instanceof Promise ?
      coll.then(f)
    :
    coll instanceof Map ?
      reduce((m, [k, v]) => go(f(v), v => m.set(k, v)), new Map, coll.entries())
    :
    hasIter(coll) ?
      reduce((arr, v) => go(f(v), v => (arr.push(v), arr)), [], coll)
    :
    isObject(coll) ?
      reduce((o, [k, v]) => go(f(v), v => (o[k] = v, o)), {}, ObjIter.entries(coll))
    :
    [] // else
  );

  const go = (..._) => reduce(callRight, _);

  const pipe = (..._fs) => Object.assign(
    (..._) => reduce(callRight, tuple(..._), _fs), { _fs }, hurdles);

  const hurdles = map(
    name => function(...fs2) { return hurdle(...this._fs)[name](...fs2) }, {
      nullable: 'nullable',
      error: 'error',
      exception: 'exception',
      complete: 'complete',
    });

  const each = curry2((f, coll) => reduce((_, val) => f(val), null, coll));

  const findVal = curry2((f, coll) => {
    const iter = valuesIter(coll);
    return function recur(res) {
      for (const val of iter)
        if ((res = f(val)) !== undefined)
          return then(res => res === undefined ? recur() : res, res);
    } ();
  });

  const find = curry2((f, coll) =>
    findVal(a => go(a, f, b => b ? a : undefined), coll));

  const isAny = a => a !== undefined;
  const some = curry2(pipe(find, isAny));

  const isUndefined = a => a === undefined;
  const none = curry2(pipe(find, isUndefined));

  const not = a => !a;
  const every = curry2((f, coll) => go(coll, find(pipe(f, not)), isUndefined));

  function match(...targets) {
    var cbs = [];

    function _case(f) {
      cbs.push({
        _case: typeof f == 'function' ? pipe(...arguments) : b => b == f
      });
      return body;
    }
    _case.case = _case;

    function body() {
      cbs[cbs.length-1]._body = pipe(...arguments);
      return _case;
    }

    _case.else = function() {
      _case(_=> true) (...arguments);
      return go(cbs,
        find(pb => { return pb._case(...targets); }),
        pb => pb._body(...targets));
    };

    return _case;
  }

  const or = (...fs) => {
    const last = fs.pop();
    return function() {
      return go(fs,
        findVal(pipe(
          f => f(...arguments),
          a => a ? a : undefined)),
        a => a ? a : last(...arguments));
    }
  };

  const and = (...fs) => {
    const last = fs.pop();
    return function() {
      return go(fs,
        findVal(pipe(
          f => f(...arguments),
          a => a ? undefined : a)),
        a => a === undefined ? last(...arguments) : a);
    }
  };

  function stepIter(data, limit) {
    var iter = valuesIter(data), i = 0;
    return limit == Infinity ? iter : {
      next: function() {
        if (i++ == limit) {
          i = 0;
          return { value: undefined, done: true };
        }
        var cur = iter.next();
        this.remain = !cur.done;
        return cur;
      },
      [Symbol.iterator]: function() { return this; },
      remain: true
    }
  }

  const mapIter = curry2((f, iter, res = []) => {
    for (const val of iter) res.push(f(val));
    return res;
  });

  const identity = a => a;

  function noop() {}

  const pAall = l => Promise.all(l);

  function cMapReduce(acc, iter, mapF, extendF) {
    return go(mapIter(mapF, iter), pAall, l => extendF(acc, l),
      _=> iter.remain ? cMapReduce(acc, iter, mapF, extendF) : acc);
  }

  const setPair = f => pair => go(pair[1], f, v => (pair[1] = v, pair));

  const cMap = curry2((f, coll, limit = Infinity) =>
    coll instanceof Map ?
      cMapReduce(new Map, stepIter(coll.entries(), limit),
        setPair(f), (acc, l) => l.forEach(([k, v]) => acc.set(k, v)))
    :
    hasIter(coll) ?
      limit == Infinity ?
        pAall(mapIter(f, coll)) :
        cMapReduce([], stepIter(coll, limit), f, (acc, l) => acc.push(...l))
    :
    isObject(coll) ?
      cMapReduce({}, stepIter(ObjIter.entries(coll), limit),
        setPair(f), (acc, l) => l.forEach(([k, v]) => acc[k] = v))
    :
    []
  );

  const series = map(a => a());
  const concurrency = cMap(a => a());

  const cFindVal = curry2((f, coll) => {
    const iter = valuesIter(coll);
    var t = 0, r = 0;
    return function() {
      return new Promise(function(resolve) {
        for (const a of iter) {
          ++t, then(
            b => b === undefined ? t == ++r ? resolve() : undefined : resolve(b),
            f(a));
        }
      })
    } ();
  });

  const cFind = curry2((f, coll) =>
    cFindVal(a => go(a, f, b => b ? a : undefined), coll));
  const cSome = curry2(pipe(cFind, isAny));
  const cNone = curry2(pipe(cFind, isUndefined));
  const cEvery = curry2((f, coll) => go(coll, cFind(pipe(f, not)), isUndefined));

  function hurdle(...fs) {
    var errorF, nullableF, completeF, exceptions = [];

    function evaluator() {
      var error = false, catched = false;
      if (!errorF && !exceptions.length && !nullableF) nullableF = noop;
      return go(
        reduce(function(arg, f) {
          if (errorF && error) return error;
          if (nullableF && arg == null) return arg;
          if (catched) return arg;
          return go(
            find(pnb => callRight(arg, pnb.predi), exceptions),
            function(pnb) {
              if (pnb) return catched = true, callRight(arg, pnb.body);
              if (!errorF) return callRight(arg, f);
              try {
                var res = callRight(arg, f);
                res = res instanceof Promise ? res.then(a => a, err => error = err) : res;
              } catch (err) {
                error = err;
              }
              return res;
            }
          );
        }, toTuple(arguments), fs),
        function(res) {
          if (catched) return res;
          if (error) return errorF ?
            errorF(error) : console.log('Uncaught Error: ', error);
          if (nullableF && res == null) return nullableF(res);
          return completeF ? completeF(res) : res;
        });
    }

    Object.assign(evaluator, {
      nullable: function(...fs) {
        nullableF = fs.length ? pipe(...fs) : a => a;
        return evaluator;
      },
      error: function(...fs) {
        errorF = pipe(...fs);
        return evaluator;
      },
      exception: function(...fs) {
        var pnb = { predi: pipe(...fs) };
        return function(...fs) {
          pnb.body = pipe(...fs);
          exceptions.push(pnb);
          return evaluator;
        }
      },
      complete: function(...fs) {
        completeF = pipe(...fs);
        return evaluator;
      }
    });

    return evaluator;
  }

  const root = typeof global == 'object' ? global : window;
  root.Functional = {
    curry2,
    then, identity, noop,
    ObjIter, valuesIter, stepIter, hasIter, isObject,
    map, cMap, series, concurrency,
    reduce,
    go, pipe,
    findVal, find, some, none, every,
    cFindVal, cFind, cSome, cNone, cEvery,
    match, or, and,
    Tuple, tuple, toTuple, callRight,
    each, log
  };
} ();