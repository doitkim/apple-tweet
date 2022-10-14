import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../CSS/LayOut.module.css";

const ResetPassword = () => {
  const [send, setSend] = useState("");
  const auth = getAuth();
  const sendEmail = (e) => {
    e.preventDefault();
    setSend(e.target[0].value);

    sendPasswordResetEmail(auth, send)
      .then(() => {
        alert("이메일이 전송 되었으며 최대 10분 지연 예상됩니다.");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>비밀번호 재설정 메일 전송</h1>
      <form onSubmit={sendEmail} className={styles.ResetPassword}>
        <input type="email" placeholder="email" />
        <button>비밀번호 재설정</button>
        <span>
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            <h2>🏠</h2>
          </Link>
        </span>
      </form>
    </>
  );
};

export default ResetPassword;
