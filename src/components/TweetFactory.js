import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TweetFactory = ({ currentUser }) => {
  const [tweet, setTweet] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [file, setFile] = useState("");

  const handleChange = (e) => {
    setTweet(e.target.value);
  };

  const uploadFile = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setImageFile(result);
    };
    reader.readAsDataURL(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const uploadCancel = () => {
    setImageFile("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (imageFile === "") return;
    const storageRef = ref(storage, `${currentUser.uid}/${uuidv4()}`);
    // e.target.files[0] 에는 blob 형태로 이미지가 저장되어 있다. 이경우는 uploadBytes를 사용
    // await uploadBytes(storageRef, file)
    // 이미지파일이 문자로 변환된 경우 uploadString 을 이용해 upload 한다.

    await uploadString(storageRef, imageFile, "data_url");
    const downloadUrl = await getDownloadURL(storageRef);
    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creator: currentUser.uid || null,
      downloadUrl: downloadUrl,
    };
    try {
      await addDoc(collection(db, "tweets"), tweetObj);
      setTweet("");
      setImageFile("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <form className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          type="text"
          value={tweet}
          placeholder="What's on?"
          maxLength={120}
          onChange={handleChange}
        />
        <input
          type="submit"
          onClick={onSubmit}
          value="&rarr;"
          className="factoryInput__arrow"
        />
      </div>

      <label for="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={uploadFile}
        style={{
          opacity: 0,
        }}
      />

      {imageFile && (
        <div className="factoryForm__attachment">
          <img src={imageFile} width="50px" height="50px" alt="upload" />
          <div className="factoryForm__clear" onClick={uploadCancel}>
            <span>upload 취소</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
