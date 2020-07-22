---
title: error running 'app' default activity not found
author: leejaeho
date: 2020-07-22 11:56:00 +0900
categories: [Android]
tags: [android studio]
---

앱 모듈 실행시 `error running 'app': Default Activity not found`
이런 에러가 발생하는 경우가 있다.

1. AndroidManifest 에 default activity에 대한 처리가 안되있거나
2. android studio 캐시 문제로 이와 같은 상황이 발생할 수 있다.

2번의 경우
* File > Invalid Caches / Restart
* Android Studio 재실행
* 또는, 직접 경로로 이동하여 관련 cache 파일 삭제

정도의 조치를 취할 수 있으나, 

그래도 안 될 경우 `Edit Configurations` 에서 Launch Options 를 `Nothing` 으로 설정하여 Launch Options를 미적용 상태로 빌드할 수 있다.
미적용 상태로 빌드할 경우 설치까지는 진행하고, 설치 후 launch는 하지 않는다.
