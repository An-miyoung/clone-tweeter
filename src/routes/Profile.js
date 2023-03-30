import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { signOut } from "firebase/auth";
import Tweet from "components/Tweet";

const Profile = ({ refreshCurrentUser, currentUser }) => {
  const navigator = useNavigate();
  const [myTweets, setMyTweets] = useState([]);
  const [myProfile, setMyProfile] = useState(currentUser.displayName);

  const onLogOut = async () => {
    await signOut(auth);
    navigator("/");
  };

  const updateMyProfile = async () => {
    await updateProfile(currentUser, {
      displayName: myProfile,
    });
    refreshCurrentUser();
  };

  const profileChange = (e) => {
    setMyProfile(e.target.value);
  };

  const onSubmitProfileChange = (e) => {
    e.preventDefault();
    if (currentUser.displayName === myProfile) return;
    updateMyProfile();
  };

  useEffect(() => {
    const getMyTweets = async () => {
      try {
        const q = query(
          collection(db, "tweets"),
          where("creator", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const tweets = await getDocs(q);
        // setState 안에서 map 을 돌며 data를 빼내 배열로 만든 후 그걸 한번에 넣을 수 있다.
        // setMyTweets(prev => ...) 라는 형태보다 훨씬 에러가 적은 듯
        setMyTweets(tweets.docs.map((doc) => doc.data()));
      } catch (e) {
        console.log(e);
      }
    };
    getMyTweets();
  }, [currentUser.uid]);

  return (
    <div className="container">
      <form onSubmit={onSubmitProfileChange} className="profileForm">
        <input
          type="text"
          placeholder="사용할 나의 별명"
          value={myProfile || ""}
          onChange={profileChange}
          className="formInput"
        />
        <input
          type="submit"
          value="수정"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOut}>
        로그아웃
      </span>
      <div style={{ height: "50px" }} />
      {myTweets &&
        myTweets.map((tweet, idx) => (
          <Tweet
            key={`${idx}-${tweet.id}`}
            tweet={tweet}
            currentUser={currentUser.uid}
          />
        ))}
    </div>
  );
};

export default Profile;
