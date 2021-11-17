# Glo Exception Filter

Glocalize의 NestJS에서 공통으로 사용하는 Global Pipe

# Library Development

1. 라이브러리에 반영되어야하는 내용을 `src/lib`에서 개발
2. `npm run build`로 lib 파일이 잘 생성되는지 확인
3. `package.json`의 version을 업데이트

## Library Testing

1. `src/dev`에서 내용이 반영되었는지 테스트할 내용을 작성
2. `npx tsc -p tsconfig-dev.json`으로 `lib`과 `dev`를 컴파일
3. `node dist/dev/main`으로 application을 실행 & 테스트
