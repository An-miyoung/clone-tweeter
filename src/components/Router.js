import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "routes/Home";
import Auth from "routes/Auth";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";
// import EditProfile from "routes/EditProfile";

const AppRouter = ({ refreshCurrentUser, isLoggedIn, currentUser }) => {
  return (
    <>
      {isLoggedIn && <Navigation currentUser={currentUser} />}
      <div
        style={{
          maxWidth: 890,
          width: "100%",
          margin: "0 auto",
          marginTop: 80,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home currentUser={currentUser} />} />
              <Route
                path="/profile"
                element={
                  <Profile
                    currentUser={currentUser}
                    refreshCurrentUser={refreshCurrentUser}
                  />
                }
              />
            </>
          ) : (
            <Route path="/" element={<Auth />} />
          )}
        </Routes>
      </div>
    </>
  );
};

export default AppRouter;
