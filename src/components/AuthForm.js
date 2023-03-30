import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const {
      target: { name, value },
    } = e;
    name === "email" && setEmail(value);
    name === "password" && setPassword(value);
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newAccount) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
      <form className="container">
        <input
          name="email"
          type="email"
          placeholder="이메일"
          value={email}
          required
          onChange={handleChange}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={password}
          required
          onChange={handleChange}
          className="authInput"
        />
        <input
          type="submit"
          value={newAccount ? "회원가입" : "로그인"}
          onClick={onSubmit}
          className="authInput authSubmit"
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "로그인" : "회원가입"}
      </span>
    </>
  );
};

export default AuthForm;
