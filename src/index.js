import React from "react"; // 브라우저가 읽을 수 있도록 jsx문법을 js로 바꾸기 위해 작성
import ReactDOM from "react-dom/client"; // DOM (Document Object Model)에 구성한 컴포넌트를 붙이는 역활
import App from "./components/App";
// 최상단에 root id를 가진 태그를 만들고 그 하단에 컴포넌트를 붙임
// root에서부터 자식까지 한번에 렌더링 됨
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
