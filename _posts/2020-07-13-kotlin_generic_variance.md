---
title: 코틀린 변성에 대한 이해
author: leejaeho
date: 2020-07-13 04:45:00 +0900
categories: [Kotlin]
tags: [covariance, contravariance, generic]
---

# 변성(variance)이란?

**기저 타입(base type)**이 같고 **타입 인자(type argument)**가 다른 경우 서로 어떤 관계가 있는지 설명하는 개념이다.

```kotlin
 List<String>, List<Any> 
```

여기서 `List`는 기저 타입, `<String>, <Any>` 는 타입 인자다.

이런 개념에 대해 왜 알아야 할까 ?


String 과 Any의 관계는 간단하게 말할 수 있다.
`String은 Any의 하위 타입이다.`
* 하위 타입 : 타입 A의 값이 필요한 모든 장소에 어떤 타입 B의 값을 넣어도 아무 문제가 없다면,
타입 B는 타입 A의 하위 타입이다.


그렇다면 `List<String>`은 `List<Any>`의 하위 타입일까?

결론은 '아니다'

<br>

```kotlin
fun addInvalidValue(list: MutableList<Any>){
    list.add("text")
}

fun main(){
    val numbers = mutableListOf(1,2,3) // MutableList<Int>
    addInvalidValue(numbers) // compile error
}
```
<center>[코드 1-1]</center>

<br>

만약 위의 경우 에러가 발생하지 않을 경우 list에 의도치 않은 타입인자가 add 될 수 있다. 

`List<String>`은 `List<Any>`의 하위 타입이 아니며, 이 둘은 아무런 관계가 없다. - 무공변(invariant)

하지만, `MutableList<Int>` 를 사용한다고 해서 항상 `MutableList<Int>`가 필요한 것은 아니다.

다음 코드를 보자.

```kotlin
fun printList(list: MutableList<Any>){
    println(list.joinToString())
}

fun main(){
    val numbers = mutableListOf(1,2,3) // MutableList<Int>
    printList(numbers) // compile error
}
```
<center>[코드 1-2]</center>

<br>  

위와 같을 경우 printList 함수에서 단순히 list element들의 toString을 이어준 결과 값을 출력하고자 하는 것이기에
굳이 `MutableList<Int>`가 필요하지 않다. `MutableList<Any>` 이어도 list에 영향을 미치지 않고, 
값을 오류 없이 읽어서 출력할 수 있다.

하지만 `printList(numbers)` 는 컴파일 오류를 발생시킨다.
왜냐면 `MutableList<Any>` 와 `MutableList<Int>`는 아무런 관계가 없기 때문.

이 둘의 관계를 정의하여 `printList(numbers)` 의 오류를 없애고, printList 함수의 활용성을 보다 확장할 수 있게하는 것
그게 **변성**이다.
  
변성을 잘 활용하면 사용에 불편하지 않으면서 타입 안정성을 보장하는 API를 만들 수 있다.

<br>

# in, out

코틀린에서 변성을 지정할 수 있게 2가지 키워드를 제공한다.
`in`, `out` 이다.

다음과 같은 클래스가 있다고 가정해보자
```kotlin
class Variance<T>
``` 

* B가 A의 하위 타입일 때 `Variance<B>`는 `Variance<A>`의 하위 타입이다. 라는 관계를 지정하고 싶다면 `out` 키워드를 사용하면 되며,
 `class Variance<out T>` 과 같이 작성하면 된다. 이를 `공변적` 이다. 라고 표현한다. - 공변성(covariance)
* B가 A의 하위 타입일 때 `Variance<A>`는 `Variance<B>`의 하위 타입이다. 라는 관계를 지정하고 싶다면 `in` 키워드를 사용하면 되며,
  `class Variance<in T>` 과 같이 작성하면 된다. 이를 `반공변적` 이다. 라고 표현한다. - 반공변성(contravariance)
  

`out` 키워드를 이용하여 [코드 1-2] 를 개선해보자

```kotlin
fun printList(list: MutableList<out Any>){
    println(list.joinToString())
}

fun main(){
    val numbers = mutableListOf(1,2,3) // MutableList<Int>
    printList(numbers) // compile success
}
```
<center>[코드 1-3]</center>
<br>

printList 함수 인자 list의 타입 `MutableList<Any>` 를 `MutableList<out Any>`로 수정하여,
Any의 하위 타입을 타입 인자로 갖는 MutableList를 허용하게 되어 코드 컴파일 및 printList 함수가 정상적으로 실행된다.

그렇다면 `in`과 `out`은 상하위 타입 간에 호환성을 지정하고 싶을 때 아무 조건 없이 사용해도 되는걸까?

<br>

# `in`, `out` 에 대한 이해

kotlin 라이브러리 인터페이스를 살펴보면서 언제 써야 좋을지에 대해 이해해보자.

## `out` 

List 인터페이스를 보면 다음과 같이 정의되어 있다.

```kotlin
public interface List<out E> : Collection<E> { 
      
    public operator fun get(index: Int): E
    
}
```
<center>[코드 1-4]</center>
<br>

List interface에서 get 함수는 제네릭으로 지정된 타입의 객체를 반환하는 함수다.
그리고 List의 제네릭 타입 선언 부분을 보면 `<out E>`로 작성 되어있다.
왜 `in`이 아닌 `out`을 지정했을까?

다음과 같이 코드가 선언되어 있다고 가정해보자.   

```kotlin
val charSequenceList: List<CharSequence>
val stringList: List<String> = listOf("abc", "123")
val anyList: List<Any> = listOf(1, 2, 3)

```
<center>[코드 1-5]</center>
<br>

charSequenceList 에서 get() 함수를 호출했을 때 기대하는 결과는 CharSequence 타입의 객체를 반환하는 것이다.

어떤 리스트에서 get() 함수를 호했을 때 CharSequence 라는 타입을 반환할 수 있는 리스트는 

CharSequence의 하위 타입을 타입 인자로 갖는 리스트일 것이다. ( stringList 반환 가능, anyList 반환 불가능 )

stringList는 get() 함수에서만큼은 charSequenceList 의 역할을 대체할 수 있다.

단순히 해당 타입의 객체를 `반환`하는 것이 목적이라면, 타입 인자의 하위 타입에 대해 공변적이다.

정리하면 `지정된 제네릭 타입을 반환할 수 있는 것은 타입 인자의 하위 타입을 타입 인자로 갖는 객체들이고, 
그런 객체들과의 호환성을 허용하게 해주는 것이 out 키워드` 이다.

여기서 반환 값에서의 공변관계의 포인트는 해당 값을 단순히 반환한다는 시각으로 보는 것보다 
해당 값을 반환할 수 있냐라는 시각으로 보는 것이 이해에 도움이 될 수 있다.
`반환할 수 있는 녀석에게는 나를 대신하게 허용해주겠다` 라는 의미
> 지정된 타입을 `반환할 수 있다`는 말은 해당 타입을 `생산해낼 수 있다`는 것으로도 해석할 수 있다.
코틀린을 다루는 여러 문서에서 특정 타입을 반환하는 것을 생산한다고 표현하는 것을 볼 수 있다. 


## `in` 

Comparable interface를 보면 다음과 같이 정의되어 있다.

```kotlin
public interface Comparable<in T> {

    public operator fun compareTo(other: T): Int
    
}
```
<center>[코드 1-6]</center>
<br>

Comparable interface에서 compareTo 함수는 제네릭으로 지정된 타입의 객체를 비교하는 함수다. (객체 간의 대소 비교를 가능하게 함)
그리고 Comparable 제네릭 타입 선언 부분을 보면 `<in T>`로 작성 되어있다.
왜 `out`이 아닌 `in`을 지정했을까?

다음과 같이 선언되어 있다고 가정해보자.

```kotlin
val charSequenceComparable: Comparable<CharSequence>
val stringComparable: Comparable<String>
val anyComparable: Comparable<Any>
```
<center>[코드 1-7]</center>
<br>

charSequenceComparable는 정렬과 같은 로직에 활용되기 위해 CharSequence 객체 간의 크기 비교에 대해 정의한 `Comparable<CharSequence>` 타입의 객체다.
charSequenceComparable의 경우 비교 로직을 작성할 때 CharSequence의 length를 이용하여 비교했을 수도 있고, hashCode() 값을 이용했을 수도 있다.
length 값을 비교했다면 CharSequence의 프로퍼티를 이용하여 비교한 것이므로 특이점은 없다.
하지만 hashCode()를 이용했다면 그것은 CharSequence의 상위 타입의 객체도 가지고 있는 것이므로 Comparable의 타입이 꼭 CharSequence 일 필요는 없다.
그럴 경우 `Comparable<Any>`로 `Comparable<CharSequence>`를 대신하는 것에 전혀 문제가 없다.
즉, Comparable의 compareTo 함수의 경우 상위 타입에 대해 호환이 가능하므로 반공변적인 관계를 지정할 수 있다.
`Comparable<String>`과 같은 하위 타입의 타입 인자를 갖는 경우 어떤 추가적인 프로퍼티를 이용하여 비교 로직이 작성되어 있을지 모르니 해당 타입으로 CharSequence를 비교하는 것은 불가능하다.
함수의 인자에서 사용될 경우 제네릭에 지정된 타입을 대체할 수 있어야하므로 하위 타입과는 호환이 불가능하며 상위 타입과는 호환이 가능하다.
정리하면 `함수 인자에서 제네릭 타입이 사용될 경우, 제네릭 타입 인자의 상위 타입을 타입 인자로 갖는 객체들은 이미 포함하고 있는 내용을 활용하고 있으므로 호환성을 허용해도 문제가 없으며, 
이를 지정하는 것이 in 키워드` 이다.

`제네릭에 지정된 타입이 함수의 인자에서 사용된 정보를 포함하는지`가 포인트이며, 당연하게도 타입 인자의 하위 타입을 갖는 객체들과는 호환이 되지 않는다.
    

이렇게 `in`, `out` 키워드를 사용하여 공변 및 반공변 관계를 정의하여 API의 타입 안정성을 유지하며 활용성을 높일 수 있다.