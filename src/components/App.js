import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
      setInit(true);
    });
  }, []);

  const refreshCurrentUser = () => {
    setCurrentUser(Object.assign({}, auth.currentUser));
    // 위와 같이 하기도 하지만, 아래처럼 필요한 부분만 선택해서 바꿈으로서 react 에게 render 가 필요함을 빨리 알린다.
    // setCurrentUser({
    //   uid: auth.currentUser.uid,
    //   displayName: auth.currentUser.displayName,
    //   updateProfile: (args) => auth.currentUser.updateProfile(args),
    // });
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshCurrentUser={refreshCurrentUser}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
        />
      ) : (
        "Initializing...."
      )}
      <footer>&copy; Twitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
