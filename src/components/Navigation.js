import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => (
  // 유저 정보 받아서 처리
  <nav>
    <span style={{ marginRight: 20 }}>
      <Link to="/">Home</Link>
    </span>
    <span>
      <Link to="/profile">
        {userObj.displayName !== null ? userObj.displayName : "Anonymous"}'s
        Profile
        {/* 받은 유저 정보에서 displayName : 닉네임의 존재 유무에 따라 있으면 보여주고 없으면 어나니머스로 설정 */}
      </Link>
    </span>
  </nav>
);

export default Navigation;
