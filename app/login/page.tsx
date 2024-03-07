'use client';
import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [isReg, setIsReg] = useState(false);

    //form variables
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errLabel, setErrLabel] = useState("");

    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("login")
        try {
            const response = await axios.post("./api/login", { mail: mail, password: password });
            // console.log(response.data);
            if (response.data['result'] === "success"){
                document.cookie = "token=" + response.data['token'];
                document.location = "/";
            }
            else {
                throw new Error("Login failed - " + response.data['result']);
            }
        }
        catch (error: any) {
            console.error('Login error - ', error);
            setErrLabel(error.message);
        }
    }

    const onReg = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("reg")
        try {
            const response = await axios.post("./api/createUser", { mail: mail, password: password, username: username });
            // console.log(response.data);
            if (response.data['result'] === "success"){
                document.cookie = "token=" + response.data['token'];
                document.location = "/";
            }
            else {
                throw new Error("Register failed - " + response.data['result']);
            }
        }
        catch (error: any) {
            console.error('Reg error - ', error);
            setErrLabel(error.message);
        }
    }

    return (
        <div className="absolute inset-0 flex justify-center items-center">
            <div className="flex flex-col bg-zinc-800 rounded-lg p-6">
                {errLabel == '' ? (
                    <></>
                ) : (
                    <h1 className="text-red-500 text-md font-bold mb-3 p-2 rounded-md">
                        Error: {errLabel}
                    </h1>
                )

                }
                <h1 className="text-zinc-200 text-2xl font-bold">
                    {isReg ? "Register" : "Login"}
                </h1>
                {isReg ? (
                    <form className="flex flex-col" onSubmit={(e) => onReg(e) }>
                        <input
                            onChange={(e) => setMail(e.target.value)}
                            value={mail}
                            type="text"
                            placeholder="Mail"
                            className="bg-zinc-700 rounded-lg p-2 mt-3 text-zinc-300"
                        />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Password"
                            className="bg-zinc-700 rounded-lg p-2 mt-3 text-zinc-300"
                        />
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text"
                            placeholder="Username"
                            className="bg-zinc-700 rounded-lg p-2 mt-3 text-zinc-300"
                        />
                        <input type="submit" value="Register" className="bg-indigo-700 font-bold rounded-lg p-2 mt-3 text-zinc-300"/>
                    </form>
                ) : (
                    <form className="flex flex-col" onSubmit={(e) => onLogin(e) }>
                        <input
                            onChange={(e) => setMail(e.target.value)}
                            value={mail}
                            type="text"
                            placeholder="Mail"
                            className="bg-zinc-700 rounded-lg p-2 mt-3 text-zinc-300"
                        />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Password"
                            className="bg-zinc-700 rounded-lg p-2 mt-3 text-zinc-300"
                        />
                        <input type="submit" value="Login" className="bg-indigo-700 font-bold rounded-lg p-2 mt-3 text-zinc-300"/>
                    </form>
                )}
                <button
                    onClick={() => setIsReg(!isReg)}
                    className="font-semibold rounded-lg p-2 mt-1 text-zinc-300"
                >
                    {isReg ? "Switch to login" : "Switch to register"}
                </button>
            </div>
        </div>
    )
}