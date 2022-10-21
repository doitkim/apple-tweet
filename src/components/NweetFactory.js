/* eslint-disable jsx-a11y/alt-text */
import { dbService, storageService } from "fbase"; // 파이어스토어, 스토리지 사용
import { useState } from "react"; // 17버전 이후부터는 최상위에만 React 표기
import { ref, uploadString, getDownloadURL } from "firebase/storage"; // 스토리지에서 해당 게시글에 맞는 이미지를 업로드하거나 다운로드하기 위해 사용
import { v4 } from "uuid"; // 스토리지에 있는 이미지 데이터들 각각에 id를 부여하기위해 사용
import { addDoc, collection } from "firebase/firestore";
// 컬렉션 : sql의 테이블이라 생각하면 됨
// 컬렉션에 게시글을 추가 할려고 할때 사용

import styles from "../CSS/LayOut.module.css";
import uploadIcon from "../Image/uploadicon.png";

const NweetFactory = ({ userObj }) => {
  // 유저 정보를 받음
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    if (nweet !== "") {
      // submit의 기본적인 기능 제거
      let attachmentUrl = ""; // 이미지가 자주바뀌고 이를 저장하기위해 let으로 변수 지정후 초기화
      if (attachment !== "") {
        // 이미지가 있으면 스토리지서비스에 유저 정보의 id폴더 안에 이미지에 id를 부여하고 저장
        const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
        const response = await uploadString(
          attachmentRef, // 이미지가 저장될 주소지정
          attachment, // 이미지 url이 담긴 변수
          "data_url"
        );
        attachmentUrl = await getDownloadURL(response.ref); // 업로드하고 나면 저장된 주소를 URL 형식으로 받음
      }
      // 공백 입력 불가 조건
      try {
        await addDoc(collection(dbService, "nweets"), {
          // 컬렉션(테이블이라고 생각하셈)
          // 파이어베이스에 "nweets" 테이블에다가 추가할 거임
          text: nweet, // 작성한 트윗의 텍스트 정보
          createdAt: Date.now(), // 작성된 일자 (컴퓨터의 시간을 씀)
          creatorId: userObj.uid, // 작성자 고유 ID (이메일 아님 고유 부여 번호가 있음)
          createName:
            userObj.displayName !== null ? userObj.displayName : userObj.email,
          // 닉네임이 있으면 사용하고 없으면 이메일을 사용하라
          createPhoto: userObj.userPhoto !== null ? userObj.userPhoto : null,
          // 사용자 프로필 사진이 있으면 사용하고 없으면 널 값 줌
          attachmentUrl, // 키와 값의 변수가 동일하다면 하나만 써도 됨
        });
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }

    setNweet(""); // 게시글 작성 이후 초기화 (새로고침 되는 것처럼)
    setAttachment(""); // 게시글 작성 이후 초기화 (새로고침 되는 것처럼)
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    // 단일 파일 업로드 기능만 있어서 제일 첫 배열임 0번만 쓰지만 묶어서 업로드라면 얘기가 달라짐
    const reader = new FileReader(); // 파일 읽는 기능
    reader.onloadend = (finishedEvent) => {
      // 파일을 업로드 시킨 상태라면 값이 존재 할 것 이고 없으면 Null
      const {
        currentTarget: { result },
      } = finishedEvent;

      setAttachment(result);
    };
    reader.readAsDataURL(theFile); // URL 형식의 값이 들어가 있으므로 리더로 읽어야함
  };
  const onClearAttachment = () => setAttachment(null);

  return (
    <form onSubmit={onSubmit} className={styles.twitCreateForm}>
      <input
        value={nweet}
        onChange={onChange}
        type="text"
        maxLength={120}
        placeholder="What's happening"
        style={{
          width: "57vw",
          height: "8vh",
          border: "0",
          fontSize: 20,
          marginBottom: 20,
        }}
      />
      {attachment && (
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <img src={attachment} width="408vw" height="400vh" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
      <hr style={{ width: "57vw", marginBottom: 20 }} />
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "stretch" }}
      >
        <label htmlFor="fileUpload">
          <img
            src={uploadIcon}
            width="35"
            height="35"
            style={{ marginRight: 20 }}
          />
        </label>
        <input
          id="fileUpload"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
        <input
          type="submit"
          value="Tweet"
          className={
            nweet !== "" ? styles.enrollBtnNotBlank : styles.enrollBtnBlank
            // 트윗터 공백 유무에 따라 버튼 색 활성화 됨
          }
        />
      </div>
      {/* 이미지가 있으면 해당 태그가 생성되서 이미지가 보이게 됨 */}
    </form>
  );
};

export default NweetFactory;
