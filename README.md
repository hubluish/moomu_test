25-1 웹플밍 기말팀플 - Moomu
---
## 🚀 시작하기


먼저 아래 명령어로 개발 서버를 실행합니다:

```bash
npm run dev
# or
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 실행 결과를 확인하세요.

`src/pages/` 폴더 안의 `.tsx` 파일을 수정하면 페이지가 자동으로 업데이트됩니다.


## 📁 폴더 구조

```
public/              # 정적 파일 (이미지, favicon 등)
src/
├── assets/          # 폰트, 아이콘 등 프로젝트 자산
├── components/      # 컴포넌트 관리
├── pages/           # 각 페이지 파일 (Next.js 자동 라우팅)
├── styles/          # 전역 스타일, 공용 CSS 파일 등
```

## ✨ 컨벤션

- 파일 이름은 소문자, 단어는 `-`로 구분해주세요. (예: `main-style.css`)
- 브랜치는 `feat_OOO` 형식으로 만들어주세요. `feat` 이후에 오는 첫 알파벳은 대문자로 해주세요 (예: `feat_Home`)
- 이미지 파일 이름도 소문자로 관리해주세요.
- 폴더를 만들어 두었으니 알맞게 분리해주세요.
- 각 HTML 파일에서 상대 경로로 CSS 및 JS 파일을 연결해주세요!
- `index.html` 파일은 최종 실행 파일입니다.
- `src/pages/`에 각각 페이지 별로 폴더를 만들어 두었으니, 각 폴더 내부에서 맞는 페이지를 개발해 주시기 바랍니다.

🔗 Commit Convention
---
[타입] 부연 설명 및 이유

[FEAT] 새로운 기능 추가 <br>
[FIX] 기능 수정 (겉으로 동작하는 것이 달라짐) <br>
[REFACTOR] 코드 리펙토링 (겉으로 동작하는 것이 달라지지 않고 코드만 변경할 때) <br>
[BUG] 버그 수정 <br>
[UI] CSS 수정, UI수정 <br>
[STYLE] 코드 포맷팅, 세미 콜론 누락, 코드 변경이 없는 경우 <br>
[CONFIG] 설정, 환경 변수 변경 <br>
[TYPO] 오타 수정 <br>
[DOCS] 문서 수정 <br>
[COMMENT] Todo, Highlight, Question 등 기타 주석 추가/삭제 <br>
[PACKAGE] 새로운 라이브러리 추가 <br>
[REMOVE] 코드나 파일 삭제 <br>
