import React, { useState } from "react";
import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Tweet = ({ tweet, currentUser }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet.text);

  const deleteTweet = async () => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (ok) {
      const tweetDoc = doc(db, "tweets", tweet.id);
      try {
        await deleteDoc(tweetDoc);
      } catch (e) {
        console.log(e);
      }
    } else {
      return;
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const tweetDoc = doc(db, "tweets", tweet.id);
    const newData = { ...tweet, text: newTweet };
    try {
      await updateDoc(tweetDoc, newData);
    } catch (e) {
      console.log(e);
    }
    setEditing(false);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
              required
              className="formInput"
            />
            <input type="submit" value="수정완료" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            수정취소
          </span>
        </>
      ) : (
        <div>
          <h4>{tweet.text}</h4>
          {tweet.downloadUrl && (
            <img src={tweet.downloadUrl} width="50px" alt="upload" />
          )}
          {currentUser === tweet.creator && (
            <div class="nweet__actions">
              <span onClick={deleteTweet}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tweet;
