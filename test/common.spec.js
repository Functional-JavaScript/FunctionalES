const expect = require('chai').expect;
const { curry2, pipe } = require('../functional.es');

describe('[ curry2 ]', function () {
  it('curry2 는 함수를 리턴한다.', () => {
    const adder = curry2((a, b) => a + b);
    expect(adder).to.be.a('function');
  });

  it('curry2 를 통해 리턴된 함수는 인자가 2개 미만이면 함수를 리턴하고, 2개 이상이면 해당 함수를 실행한다.', () => {
    const adder = curry2((a, b) => a + b);
    const addWith5 = adder(5);

    expect(addWith5).to.be.a('function');
    expect(addWith5(3)).to.eql(8);
    expect(addWith5(5)).to.eql(10);
  })
});

describe('[ pipe ]', function () {
  const add1 = a => a + 1;
  const add1P = a => new Promise(resolve => setTimeout(() => resolve(a + 1), 1000));
  const mul2 = a => a * 2;

  it('pipe 는 인자로 받은 함수들을 순차적으로 실행하는 함수를 리턴한다.', () => {
    const f = pipe(add1, mul2);

    expect(f).to.be.a('function');
    expect(f(1)).to.eql(4);
    expect(f(2)).to.eql(6);
  });

  it('pipe 로 만든 함수를 실행하면, pipe 에 전달되었던 함수들을 순차적으로 실행하면서 값을 누적한다. 그러다 promise를 만나면, 모든 함수들의 누적 결과를 만들기로 약속된 promise를 리턴한다.', async () => {
    this.timeout(2000);

    const fP = pipe(add1P, mul2);
    expect(fP).to.be.a('function');

    const p1 = fP(1);
    const p2 = fP(2);

    expect(p1).to.be.a('Promise');
    expect(p2).to.be.a('Promise');

    expect(await p1).to.eql(4);
    expect(await p2).to.eql(6);
  });
});
