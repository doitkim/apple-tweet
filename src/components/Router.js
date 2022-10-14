/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom"; // 주소 경로 지정 및 페이지 이동위해 사용
import Profile from "routes/Profile"; // 프로필
import Auth from "../routes/Auth"; // 인증
import Home from "../routes/Home"; // 홈
import Navigation from "./Navigation"; // 네비게이션 (메뉴 네비게이션 바)
import twitter from "../Image/tweeterLogo.png";
import styles from "../CSS/LayOut.module.css";
import ResetPassword from "./ResetPassword";

// eslint-disable-next-line import/no-anonymous-default-export
const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  // refreshUser (사용자 업데이트 정보) , isLoggedIn (로그인 여부), userObj (유저 정보) 받음
  return (
    <Router>
      {/* HashRouter (주소에 # 들어감, gitHub 배포시에 권장됨) as로 별칭 지정해서 사용했음 */}
      <div>
        <div className={styles.twitterLogoLayout}>
          <img src={twitter} className={styles.mainTwitLogo} />
          <h1>지금 일어나고 있는 일</h1>
        </div>
        {/* 로그인 완료된 상태라면 네비게이션 컴포넌트에 유저 정보 넣어서 보냄 */}
        {isLoggedIn && <Navigation userObj={userObj} />}
        <Routes>
          {/* 로그인 완료된 상태면 각 경로에 따라서 유저 정보와 업데이트 유저정보를 각 컴포넌트에 전달함 */}
          {isLoggedIn ? (
            <>
              <Route exact path="/" element={<Home userObj={userObj} />} />
              <Route
                exact
                path="/profile"
                element={
                  <Profile userObj={userObj} refreshUser={refreshUser} />
                }
              />
            </>
          ) : (
            // 로그인 인증이 미완료시 인증 시 해당경로에 있으면 인증 컴포넌트로 보내버림
            <>
              <Route exact path="/" element={<Auth />} />
              <Route exact path="/ResetPassword" element={<ResetPassword />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
