# Functional.es

## ES6, 함수형 프로그래밍, 비동기, 동시성 프로그래밍

0. [들어가며]()
    - ES6, 함수형 프로그래밍, 비동기/동시성 프로그래밍
    - ES6+
    - 함수형 프로그래밍
    - 비동기/동시성 프로그래밍
1. [타입과 값]()
    - 7가지 내장 타입으로 바라보기
    - 자바스크립트에서의 객체
    - JSON 데이터 타입
    - Iterable, Iterator
    - Symbol.iterator
    - Promise
2. [함수형 프로그래밍 관점에서 바라본 자바스크립트의 값]()
    - 자바스크립트에서의 함수형 프로그래밍을 위한 타입과 값
    - JSON 데이터 타입
    - undefined
    - 열거 가능한 값, 컬렉션
    - 컬렉션 순회
    - 불변성
    - 함수와 화살표 함수
    - Promise
3. [컬렉션 중심 프로그래밍]()
    - 컬렉션
    - 3개의 대표 함수 map, reduce, findVal
    - map 함수
    - reduce 함수
    - findVal 함수
4. [코드를 컬렉션으로 다루기]()
    - pipe, go
    - match
    - 함수를 값으로 다루면서 원하는 시점에 평가하기
    - or, and
5. [비동기, 동시성, 병렬성 프로그래밍]()
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
6. [예외 처리]()
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