!function() {
  const curry2 = f => (..._) => _.length < 2 ? (..._2) => f(..._, ..._2) : f(..._);

  const then = curry2((f, a) => a instanceof Promise ? a.then(f) : f(a));

  const log = console.log;

  const identity = a => a;

  function noop() {}

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

  const mfReduce = (f1, f2, f3) => (f, coll) =>
    coll instanceof Map ? reduce(f1(f), new Map, coll.entries())
    :
    hasIter(coll) ? reduce(f2(f), [], coll)
    :
    isObject(coll) ? reduce(f3(f), {}, ObjIter.entries(coll))
    :
    []
  ;

  const _map = mfReduce(
    f => (m, [k, v]) => go(f(v), v => m.set(k, v)),
    f => (arr, v) => go(f(v), v => (arr.push(v), arr)),
    f => (o, [k, v]) => go(f(v), v => (o[k] = v, o)));

  const map = curry2((f, coll) =>
    coll instanceof Function ? pipe(coll, f)
    :
    coll instanceof Promise ? coll.then(f)
    :
    _map(f, coll)
  );

  const filter = curry2(mfReduce(
    f => (m, [k, v]) => go(f(v), b => b ? m.set(k, v) : m),
    f => (arr, v) => go(f(v), b => (b && arr.push(v), arr)),
    f => (o, [k, v]) => go(f(v), b => (b && (o[k] = v), o))));

  const reject = curry2((f, coll) => filter(negate(f), coll));

  const compact = filter(identity);

  const negate = f => pipe(f, not);

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
  const every = curry2((f, coll) => go(coll, find(negate(f)), isUndefined));

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

  const pAall = l => Promise.all(l);

  function mapCReduce(acc, iter, mapF, extendF) {
    return go(mapIter(mapF, iter), pAall, l => extendF(acc, l),
      _=> iter.remain ? mapCReduce(acc, iter, mapF, extendF) : acc);
  }

  const setPair = f => pair => go(pair[1], f, v => (pair[1] = v, pair));

  const mapC = curry2((f, coll, limit = Infinity) =>
    coll instanceof Map ?
      mapCReduce(new Map, stepIter(coll.entries(), limit),
        setPair(f), (acc, l) => l.forEach(([k, v]) => acc.set(k, v)))
    :
    hasIter(coll) ?
      limit == Infinity ?
        pAall(mapIter(f, coll)) :
        mapCReduce([], stepIter(coll, limit), f, (acc, l) => acc.push(...l))
    :
    isObject(coll) ?
      mapCReduce({}, stepIter(ObjIter.entries(coll), limit),
        setPair(f), (acc, l) => l.forEach(([k, v]) => acc[k] = v))
    :
    []
  );

  const series = map(a => a());
  const concurrency = mapC(a => a());

  const thenCatch = (f, catchF, a) => {
    try { return a instanceof Promise ? a.then(f, catchF) : f(a) }
    catch (e) { return catchF(e); }
  };

  const findValC = curry2((f, coll, limit = Infinity) => {
    const iter = stepIter(coll, limit);
    return new Promise(function(resolve, reject) {
      !function recur() {
        var t = 0, r = 0;
        for (const a of iter) {
          ++t, thenCatch(
            b => b === undefined ? t == ++r && iter.remain && recur() : resolve(b),
            reject,
            f(a));
        }
      } ();
    });
  });

  const findC = curry2((f, coll, limit) =>
    findValC(a => go(a, f, b => b ? a : undefined), coll, limit));
  const someC = curry2(pipe(findC, isAny));
  const noneC = curry2(pipe(findC, isUndefined));
  const everyC = curry2((f, coll, limit) => go(findC(negate(f), coll, limit), isUndefined));

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
    map, mapC, series, concurrency,
    filter, reject, compact,
    reduce,
    go, pipe,
    findVal, find, some, none, every,
    findValC, findC, someC, noneC, everyC,
    match, or, and,
    Tuple, tuple, toTuple, callRight,
    negate, not, isAny, isUndefined,
    each, log
  };
} ();