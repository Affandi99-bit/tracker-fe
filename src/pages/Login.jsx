import { useState, useEffect } from "react";
import { user } from "../constant/constant";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

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
      console.log("Login successf tracking-widestul!");
      if (rememberMe) {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        setTimeout(() => {
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }, 7200000);
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
      }
      onLoginSuccess();
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <main className="flex w-full h-screen justify-center items-center p-3 select-none">
      <section className="w-96 rounded-2xl bg-dark">
        <div className="flex flex-col p-8">
          <header className="flex items-center gap-3 mb-4">
            <img src="/logo.png" className="size-9" alt="Logo" />
            <p className="text-2xl text-gray-300 sf tracking-widest  font-black">
              Project Manager
            </p>
          </header>
          <form className="flex flex-col gap-2" onSubmit={handleLogin}>
            <input
              className="sf tracking-widest text-light bg-dark w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="sf tracking-widest text-light bg-dark w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="helvetica inline-block cursor-pointer rounded-md bg-light px-4 py-3.5 text-center text-sm font-semibold uppercase text-dark transition duration-200 ease-in-out hover:bg-opacity-70 outline-none active:scale-95"
            >
              Log In
            </button>
            <label
              htmlFor="hr"
              className="flex flex-row items-center gap-2.5 dark:text-white light:text-black sf tracking-widest"
            >
              <input
                id="hr"
                type="checkbox"
                className="peer hidden"
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <div
                htmlFor="hr"
                className="h-5 w-5 flex rounded-md border border-[#a2a1a833] light:bg-[#e8e8e8] dark:bg-[#212121] peer-checked:bg-[#8e8e8e] transition"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 light:stroke-[#e8e8e8] dark:stroke-[#212121]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12.6111L8.92308 17.5L20 6.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
              Remember Me
            </label>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;
