import { authService } from "fbase"; // 파이어베이스 인증 기능 사용
import { useState } from "react";
import styles from "../CSS/LayOut.module.css";

const AuthForm = () => {
  // Props를 사용하는 이유 현재 상태를 정확하게 가져와서 설정할 수 있음 보다 안전함
  const toggleAccount = () => setNewAccount((prev) => !prev);
  const [email, setEmail] = useState(""); // Input 값 추가 변경 확인해서 저장 용도
  const [password, setPassword] = useState(""); // Input 값 추가 변경 확인해서 저장 용도
  const [newAccount, setNewAccount] = useState(true); // 계정 생성 사용 유무 용도
  const [error, setError] = useState(""); // 사용자에게 아이디 중복 또는 잘못된 비밀번호 확인 용도
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    // 이벤트안의 이름과 값을 저장
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault(); // Submit 이벤트는 기본적으로 새로고침이 적용되어있어 그걸 막기위해 씀
    try {
      let data;
      if (newAccount) {
        // 계정 가입을 하는 경우 이메일 회원가입에 사용하는 파이어베이스 기능
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        // 로그인을 하려는경우 사용하는 파이어베이스 기능
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      // console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
      <form onSubmit={onSubmit} className={styles.DefaultLayOut}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className={styles.InputLayOut}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className={styles.InputLayOut}
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"} // nweAccount가 true : false 인지에 따라 값이 바뀜
          className={styles.LogInBtnLayOut}
        />
        <button onClick={toggleAccount} className={styles.LogInBtnLayOut}>
          {newAccount ? "Sign In" : "Create Account"}
        </button>
        {/* 사용자에게 보려주려고 만든 에러 */}
        {error}
      </form>
    </>
  );
};

export default AuthForm;
