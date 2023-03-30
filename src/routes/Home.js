import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";

const Home = ({ currentUser }) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    setTweets([]);

    // const getTweets = async () => {
    //   const tweetArray = [];
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "tweets"));
    //     querySnapshot.forEach((doc) => {
    //       const { text, createdAt, creator } = doc.data();
    //       tweetArray.push({ id: doc.id, text, createdAt, creator });
    //       // 간단히 이렇게 쓸수도 있다.
    //       // tweetArray.push({ id: doc.id, ...doc.data() });
    //     });
    //     setTweets(tweetArray);
    //   } catch (e) {
    //     console.log(e.message);
    //   }
    // };

    // getTweets();

    onSnapshot(collection(db, "tweets"), (snapshot) => {
      // const tweetList = snapshot.forEach() 와 같은 형태도 가능. 하지만 map 을 돌리면 re-render 가 줄어듬
      const tweetList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetList);
    });
  }, []);

  return (
    <div className="container">
      <TweetFactory currentUser={currentUser} />
      <div style={{ marginTop: 30 }}>
        {tweets &&
          tweets.map((tweet, idx) => (
            <Tweet
              key={`${idx}-${tweet.id}`}
              tweet={tweet}
              currentUser={currentUser.uid}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;
