import { useEffect, useState } from "react"; // 17버전 이후부터는 최상위에 React가 추가되어 있을 시 생략 가능
import AppRouter from "components/Router"; // 상황별 라우팅하기위한 라우팅 파일 추가
import { authService } from "fbase"; // 파이어베이스 설정 파일에서 인증 기능을 export 시켜 사용 (구글 및 이메일 인증)

function App() {
  const [init, setInit] = useState(false); // 로그인 여부 상태 감시
  const [userObj, setUserObj] = useState(null); // 원하는 정보를 상태(수정/추가) 하기 위해 씀
  useEffect(() => {
    // 현재 로그인 된 사용자의 정보를 객체로 저장
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        // 로그아웃등과 같이 props의 값이 없다면 초기화
        setUserObj(null);
      }
      // 파이어베이스 연동 여부에 따른 값 변경
      setInit(true);
    });
  }, []);

  // 사용자 정보가 업데이트 시 변경을 위해 사용
  const refreshUser = () => {
    const user = authService.currentUser; // 현재 인증된 사용자 최신 상태 오브젝트 저장
    setUserObj({
      // 필요한 정보만 저장
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <div>
      {/* 로그인 상태라면 init이 True 로그아웃 상태라면 false [setInit과 useState(기본값 확인)] */}
      {init ? (
        // AppRouter에서 중복이 발생하는 인증을 피하기위해 props로 인증 상태 및 정보 전달
        <AppRouter
          refreshUser={refreshUser} // 정보 업데이트 시 전체 업데이트
          isLoggedIn={Boolean(userObj)} // 로그인 되어있는지 불린(true:false) 값으로 전달
          userObj={userObj} // 인증된 유저 정보 객체 전달
        />
      ) : (
        "Initializing..."
      )}
    </div>
  );
}

export default App;
