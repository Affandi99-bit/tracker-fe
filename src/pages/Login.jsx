import React, { useState, useEffect } from "react";
import { user } from "../constant/constant";
import { Background } from '../components';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- Add this line

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (storedUsername) setUsername(storedUsername);
    if (storedPassword) setPassword(storedPassword);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = user.find(
      (u) => u.user === username && u.password === password
    );

    if (foundUser) {
      console.log("Login successfull!");
      if (rememberMe) {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
      }
      onLoginSuccess();
      setRememberMe(true)
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <main className="w-full h-screen relative select-none">
      <Background
        particleColors={['#f8f8f8', '#202020']}
        particleCount={350}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <section className="w-96 overflow-hidden rounded-2xl bg-dark relative flex flex-col p-8 z-10">
          <img
            src="/PM.webp"
            className="absolute left-0 top-16 opacity-30"
            alt=""
          />
          <header className="flex items-center gap-3 mb-4">
            <img src="/logo.webp" className="size-9" alt="Logo" />
            <p className="text-2xl text-gray-300 font-body tracking-widest font-black">
              Project Manager
            </p>
          </header>
          <form className="flex flex-col gap-2" onSubmit={handleLogin}>
            <input
              className="font-body tracking-widest text-light glass w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="relative">
              <input
                className="font-body tracking-widest text-light glass w-full rounded-lg border border-gray-300 px-4 py-3 outline-none pr-12"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye open icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  // Eye closed icon (your original SVG)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                )}
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className=" inline-block cursor-pointer rounded-md bg-light px-4 py-3.5 text-center text-sm font-semibold uppercase text-dark transition duration-200 ease-in-out hover:bg-opacity-70 outline-none active:scale-95"
            >
              Log In
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Login;
