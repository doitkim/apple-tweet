/* eslint-disable jsx-a11y/alt-text */
import { authService, firebaseInstance } from "fbase"; // 파이어베이스 인증, 파이어베이스 불러오는용도
import AuthForm from "components/AuthForm"; // 로그인 폼 불러옴
import styles from "../CSS/LayOut.module.css";
import google from "../Image/gogleImg.png";

const Auth = () => {
  const onSocialClick = async (event) => {
    // Async Await는 프로미스로 값을 받아오기 때문에 씀
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
      // 구글 로그인 시도일 경우 파이어베이스의 인증기능에 구글 제공업체 함수 클래스 생성
    }
    await authService.signInWithPopup(provider);
  };
  return (
    <div>
      <button
        onClick={onSocialClick}
        name="google"
        className={styles.SNSLogInBtnLayOut}
      >
        <img src={google} className={styles.LogoImg} />
        Continue with Google
      </button>
      <AuthForm />
      {/* 로그인 폼 불러오기 */}
    </div>
  );
};
export default Auth;
