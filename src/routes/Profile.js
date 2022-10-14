import { authService } from "fbase"; // 파이어베이스 인증 기능 사용
import { useState, useEffect } from "react"; // 17버전 이후부터는 React 명시는 최상단에 한번만 해주면 생략가능
import { Link, useNavigate } from "react-router-dom"; // 네이게이트와 링크 사용할려는 용도

import Nweet from "components/Nweet"; // 트위터 수정 삭제 취소시에 보여줄 레이아웃 및 기능
import { dbService } from "fbase"; //파이어스토어 사용
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
// 컬렉션 : 파이어스토어 파이어베이스의 테이블명이라고 생각하면 됨
// onSnapshot : 사용자가 컬렉션 안에 있는 내용들을 작성하면 실시간으로 반영 해주는 기능
// query : sql 쿼리와 같이 여기서 이걸 해주세요라고 명령 해주는 기능
// orderBy : sql 쿼리와 같고 (desc, asc) 옵션이 있음
import styles from "../CSS/LayOut.module.css";

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

  const [nweets, setNweets] = useState([]); // 데이터 타입은 배열 명시

  // 한번만 가져와서 불필요한 렌더링을 줄이려는 목적으로 쓰임
  useEffect(() => {
    // 쿼리문을 변수로 담았고 파이어스토어에 컬렉션에라는 곳에서 "nweets"라는 테이블을
    // select * from nweets 처럼 테이블 안에 있는 내용을 작성일자가 최근을 위로 올려달라고 요청
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );

    // 실시간으로 반영하기위해 스냅샷 기능을 사용
    onSnapshot(q, (snapshot) => {
      // 해당 쿼리로 요청해서 받은 값들을 map으로 원하는 목록만 재배열하여 변수에 담음
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id, // 데이터 베이스 아이디라고 생각하면 됨
        ...doc.data(), // 컬렉션 테이블 정보 및 값들 이라고 생각하면 됨
      }));
      setNweets(nweetArr); // 배열 변수에 정보 넣기
    });
  }, []);

  return (
    <div className={styles.twitterBoard}>
      <form onSubmit={onSubmit} className={styles.twitCreateForm}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          style={{ width: "58vh", padding: 4 }}
        />
        <input type="submit" value="Update Profile" />
        <button onClick={onLogOutClick}>
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            Log Out
          </Link>
        </button>
      </form>
      <div className={styles.BorderLayOut}>
        {/* 배열인 변수라서 map을 써서 풀어서 그 안에 사용하고자 하는 내용들 빼내서 Nweet 컴포넌트에 저장 */}
        {nweets.map((nweet) => (
          <>
            {/* 본인 게시물만 받아오게 만들려고 삼항 연산자 추가 */}
            {userObj.uid === nweet.creatorId ? (
              <Nweet
                // 순차적으로 맵으로 빼낸 정보를 넣기때문에 리스트 타입이 되어서 키를 꼭 넣어 줘야하고 고유값인 id사용
                key={nweet.id}
                // 빼낸 정보 전체를 전달
                nweetObj={nweet}
                // 작성자가 맞는지 확인하기 위해 사용
                isOwner={nweet.creatorId === userObj.uid}
              />
            ) : null}
          </>
        ))}
      </div>
    </div>
  );
};
