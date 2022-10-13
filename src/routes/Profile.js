import { authService } from "fbase"; // 파이어베이스 인증 기능 사용
import { useState } from "react"; // 17버전 이후부터는 React 명시는 최상단에 한번만 해주면 생략가능
import { Link, useNavigate } from "react-router-dom"; // 네이게이트와 링크 사용할려는 용도

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ refreshUser, userObj }) => {
  // 기존 사용자 정보와 업데이트 정보 받아옴
  const history = useNavigate();
  // 이전 버전에서는 history기능이 있었으나 지금은 사용 불가로 useNavigate()사용
  // 닉네임 변경하기위해 사용
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut(); // 소셜 및 이메일 인증 로그아웃 공통 기능
    history.push("/"); // 메인 화면으로 이동
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
    // 닉네임 변경
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      // 닉네임이 기존이랑 다를 경우 전체 업데이트
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
      setNewDisplayName("");
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
        <button onClick={onLogOutClick}>
          <Link to="/">Log Out</Link>
        </button>
      </form>
    </>
  );
};
