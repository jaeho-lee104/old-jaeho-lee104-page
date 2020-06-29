---
title: ExoPlayer EOF error case
author: leejaeho
date: 2020-06-29 23:55:05 +0900
categories: [Android, ExoPlayer]
tags: [android, exoplayer]
---

## ExoPlayer `2.10.x` 파일 재생 에러 케이스

#### 파일 헤더와 미디어 파일 구성이 맞지 않거나
```java 
java.io.EOFException: FragmentedMp4Extractor::read.4 > FragmentedMp4Extractor::readAtomPayload.5 > DefaultExtractorInput::skipFully.6 > DefaultExtractorInput::skipFully.4 > DefaultExtractorInput::readFromDataSource.3
```

```java
java com.google.android.exoplayer2.ParserException: Skipping atom with length > 2147483647 (unsupported)., trace : ThreadPoolExecutor::runWorker.1167 > Loader$LoadTask::run.4 > ContainerMediaChunk::load.12 > FragmentedMp4Extractor::read.5 > FragmentedMp4Extractor::readAtomHeader.47
```

#### mpd 명세된 initialization range 와 파일의 moov 사이즈가 다를 경우
```java 
java.io.EOFException: FragmentedMp4Extractor::read.4 > FragmentedMp4Extractor::readAtomPayload.3 > DefaultExtractorInput::readFully.4 > DefaultExtractorInput::readFully.2 > DefaultExtractorInput::readFromDataSource.3
```
 


