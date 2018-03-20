# Functional.es

## ES6+, 함수형 프로그래밍, 비동기, 동시성 프로그래밍

[소스코드 보기](https://github.com/Functional-JavaScript/functional.es/tree/master/articles/ES6%2C%20%ED%95%A8%EC%88%98%ED%98%95%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%2C%20%EB%B9%84%EB%8F%99%EA%B8%B0%2C%20%EB%8F%99%EC%8B%9C%EC%84%B1%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/html)

#### 목차

0. [들어가며](https://github.com/Functional-JavaScript/functional.es/blob/master/articles/ES6%2C%20%ED%95%A8%EC%88%98%ED%98%95%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%2C%20%EB%B9%84%EB%8F%99%EA%B8%B0%2C%20%EB%8F%99%EC%8B%9C%EC%84%B1%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/0.%20%EB%93%A4%EC%96%B4%EA%B0%80%EB%A9%B0.md)
    - ES6, 함수형 프로그래밍, 비동기/동시성 프로그래밍
    - ES6+
    - 함수형 프로그래밍
    - 비동기/동시성 프로그래밍
1. [타입과 값](https://github.com/Functional-JavaScript/functional.es/blob/master/articles/ES6%2C%20%ED%95%A8%EC%88%98%ED%98%95%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%2C%20%EB%B9%84%EB%8F%99%EA%B8%B0%2C%20%EB%8F%99%EC%8B%9C%EC%84%B1%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/1.%20%ED%83%80%EC%9E%85%EA%B3%BC%20%EA%B0%92.md)
    - 7가지 내장 타입으로 바라보기
    - 자바스크립트에서의 객체
    - JSON 데이터 타입
    - Iterable, Iterator
    - Symbol.iterator
    - Promise
2. [함수형 프로그래밍 관점에서 바라본 자바스크립트의 값](https://github.com/Functional-JavaScript/functional.es/blob/master/articles/ES6%2C%20%ED%95%A8%EC%88%98%ED%98%95%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%2C%20%EB%B9%84%EB%8F%99%EA%B8%B0%2C%20%EB%8F%99%EC%8B%9C%EC%84%B1%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/2.%20%ED%95%A8%EC%88%98%ED%98%95%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%20%EA%B4%80%EC%A0%90%EC%97%90%EC%84%9C%20%EB%B0%94%EB%9D%BC%EB%B3%B8%20%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98%20%EA%B0%92.md)
    - 자바스크립트에서의 함수형 프로그래밍을 위한 타입과 값
    - JSON 데이터 타입
    - undefined
    - 열거 가능한 값, 컬렉션
    - 컬렉션 순회
    - 불변성
    - 함수와 화살표 함수
    - Promise
3. [컬렉션 중심 프로그래밍](https://github.com/Functional-JavaScript/functional.es/blob/master/articles/ES6%2C%20%ED%95%A8%EC%88%98%ED%98%95%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%2C%20%EB%B9%84%EB%8F%99%EA%B8%B0%2C%20%EB%8F%99%EC%8B%9C%EC%84%B1%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/3.%20%EC%BB%AC%EB%A0%89%EC%85%98%20%EC%A4%91%EC%8B%AC%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D.md)
    - 컬렉션
    - 3개의 대표 함수 map, reduce, findVal
    - map 함수
    - reduce 함수
    - findVal 함수
4. [코드를 컬렉션으로 다루기](https://github.com/Functional-JavaScript/functional.es/blob/master/articles/ES6%2C%20%ED%95%A8%EC%88%98%ED%98%95%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%2C%20%EB%B9%84%EB%8F%99%EA%B8%B0%2C%20%EB%8F%99%EC%8B%9C%EC%84%B1%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/4.%20%EC%BD%94%EB%93%9C%EB%A5%BC%20%EC%BB%AC%EB%A0%89%EC%85%98%EC%9C%BC%EB%A1%9C%20%EB%8B%A4%EB%A3%A8%EA%B8%B0.md)
    - pipe, go
    - match
    - 함수를 값으로 다루면서 원하는 시점에 평가하기
    - or, and
5. [비동기, 동시성, 병렬성 프로그래밍](https://github.com/Functional-JavaScript/functional.es/blob/master/articles/ES6%2C%20%ED%95%A8%EC%88%98%ED%98%95%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%2C%20%EB%B9%84%EB%8F%99%EA%B8%B0%2C%20%EB%8F%99%EC%8B%9C%EC%84%B1%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/5.%20%EB%B9%84%EB%8F%99%EA%B8%B0%2C%20%EB%8F%99%EC%8B%9C%EC%84%B1%2C%20%EB%B3%91%EB%A0%AC%EC%84%B1%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D.md)
    - 들어가기 앞서 Promise, async/await에 대해
    - Promise는 콜백 지옥을 해결한 것일까?
    - promise.then(f)의 규칙
    - Promise 체인
    - then :: Promise p => (a -> b | p b) -> a | p a -> b | p b
    - then에 커링 적용하기
    - 파이프라인
    - 이미지 동시에 모두 불러온 후 DOM에 반영하기
    - cMap과 limit
    - 쇼트트랙 계주 - 순서대로 실행하기
    - 동시적으로 혹은 순차적으로
    - async/await는 은총알인가?
    - 더 많은 함수들
6. [예외 처리](https://github.com/Functional-JavaScript/functional.es/blob/master/articles/ES6%2C%20%ED%95%A8%EC%88%98%ED%98%95%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%2C%20%EB%B9%84%EB%8F%99%EA%B8%B0%2C%20%EB%8F%99%EC%8B%9C%EC%84%B1%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/6.%20%EC%98%88%EC%99%B8%20%EC%B2%98%EB%A6%AC.md)
    - ES6+의 3가지 예외
    - pipe().nullable()
    - pipe().error()
    - pipe().exception() ()
    - 여러가지 달기
    - pipe().error().complete()
    - 다른 컬렉션 조작 함수들과의 조합
    - 비동기를 지원하지 않는 함수에서 발생한 예외 처리 실패
    - 동기/비동기를 함께 지원하는 함수의 필요성
    - 정리
