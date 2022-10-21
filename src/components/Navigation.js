import React from "react";
import { Link } from "react-router-dom";
import styles from "../CSS/LayOut.module.css";

const Navigation = ({ userObj }) => (
  // 유저 정보 받아서 처리
  <nav className={styles.navigation}>
    <span>
      <Link to="/" className={styles.navigaionLink}>
        Home
      </Link>
    </span>
    <span>
      <Link to="/profile" className={styles.navigaionLink}>
        {userObj.userPhoto !== null ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img src={userObj.userPhoto} width="30vw" height="30vh" />
        ) : null}
        {userObj.displayName !== null ? userObj.displayName : "Anonymous"}'s
        Profile
        {/* 받은 유저 정보에서 displayName : 닉네임의 존재 유무에 따라 있으면 보여주고 없으면 어나니머스로 설정 */}
      </Link>
    </span>
  </nav>
);

export default Navigation;
