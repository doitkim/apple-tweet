/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react"; // 17버전 이후부터는 최상위에 명시해주면 자식부분들은 React 생략 가능
import { dbService, storageService } from "fbase"; // 파이어스토어 (게시글)와 스토리지서비스 (이미지)
import { doc, deleteDoc, updateDoc } from "firebase/firestore"; // 파이어스토어에 컬럼(게시글)을 조작 (수정 삭제)
import { deleteObject, ref } from "firebase/storage"; // 이미지의 url을 저장하고 삭제하는 용도

// 게시글 정보와 소유자인지 아닌지에 대한 정보 받음
const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false); // 수정 기능 사용 유무 감시
  const [newNweet, setNewNweet] = useState(nweetObj.text); // 수정 기능을 사용해서 값이 수정했을때 받아서 업데이트하는 용도
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`); // 게시글 정보 참조해서 삭제하기 위한 용도(파이어스토어의 "nweets" 테이블에 해당 게시글의 id 확인)
  const desertRef = ref(storageService, nweetObj.attachmentUrl); // 스토리지에 이미지 url을 저장하기위한 용도

  const onDeleteClick = () => {
    const answer = window.confirm("진짜 삭제 하시겠습니까?"); // 컨펌 기능은 취소를 누르면 false 확인을 누르면 true로 바뀜
    if (answer) {
      deleteDoc(NweetTextRef); // 해당 게시글 삭제
      if (nweetObj.attachmentUrl !== "") {
        deleteObject(desertRef);
        // 해당 게시글에 있는 이미지를 연쇄적으로 삭제하기위해 스토리지의 이미지를 아이디로 찾아 삭제
        // mysql의 cascade? 살짝 비슷한 기능
      }
    }
  };
  // 수정 / 비수정 상태를 토글로 만듬
  // prev, current 로 Props를 받는 이유는 현재 상태값을 정확히 받을 수 있기에 안전하다 함
  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (e) => {
    e.preventDefault(); // Submit 이벤트는 기본적으로 새로고침이 있어 그걸 막는 용도
    //수정 선택한 게시글의 정보를 참조해서 텍스트를 새로운 값으로 변경
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    setEditing(false);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    // const abc = e.target.value 이것과 같은데 다른 방식으로도 써봤음
    //onChange 이벤트는 수정버튼을 눌렀을때 나오는 Input 태그의 이벤트임
    setNewNweet(value);
  };

  return (
    <div key={nweetObj.id}>
      {/* 오브젝트로 값을 전달받았기에 리스트형식으로 타입이 변경되어 키를 넣어야함 */}
      <div>
        {editing ? (
          <>
            <form onSubmit={onSubmit}>
              <input
                value={newNweet}
                placeholder="Edit your nweet"
                required
                onChange={onChange}
              />
              <input type="submit" value="Update Nweet" />
              {/* 수정 할래 말래 여부를 토글키로 구현 */}
              <button onClick={toggleEditing}>취소</button>
            </form>
          </>
        ) : (
          // 수정을 취소하거나 또는 수정이 완료가 되면 보여지는 내용
          <div style={{ margin: 5 }}>
            {/* 게시글 작성자 이름 */}
            <div>🥕 {nweetObj.createName}</div>
            {/* 게시글 등록 시 이미지 업로드 여부에 따른 게시글 표기 달라짐 */}
            {nweetObj.attachmentUrl !== "" ? (
              // 이미지가 있으면 이미지 태그가 같이 나감
              <>
                <hr />
                <img src={nweetObj.attachmentUrl} width="300" height="300" />
                <hr />
                <div>{nweetObj.text}</div>
              </>
            ) : (
              <div>{nweetObj.text}</div>
            )}
          </div>
        )}

        {/* 작성자가 맞다면 수정 / 삭제 버튼이 생기고 없으면 안생김 */}
        {isOwner && (
          <>
            <button onClick={toggleEditing}>수정</button>
            <button onClick={onDeleteClick}>삭제</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Nweet;
