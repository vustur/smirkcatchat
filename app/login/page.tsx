'use client';
import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [isReg, setIsReg] = useState(false);

    //form variables
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const onLogin = (e) => {
        e.preventDefault();
        console.log("login")
    }
    const onReg = async (e) => {
        e.preventDefault();
        console.log("reg")
        try {
            const response = await axios.post("./api/createUser", { mail: mail, password: password, username: username });
            console.log(response.data);
        }
        catch (error) {
            console.error('Reg error - ', error);
        }
    }

    return (
        <div className="absolute inset-0 flex justify-center items-center">
            <div className="flex flex-col bg-zinc-800 rounded-lg p-8 px-6">
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
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text"
                            placeholder="Username"
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