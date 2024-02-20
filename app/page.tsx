'use client';
import Message from "./components/Message";
import Channel from "./components/Channel";
import Server from "./components/Server";
import Profile from "./components/Profile";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from 'js-cookie'
import io from "socket.io-client";
let chatsocket

export default function Home() {
  const [showProfile, setShowProfile] = useState(false)
  const [mouseY, setMouseY] = useState(0)
  const [profileId, setProfileId] = useState(0)
  const [isAdvButttonsEnabled, setIsAdvButttonsEnabled] = useState(false)
  const [messages, setMessages] = useState([])
  const [profileData, setProfileData] = useState({})
  const [currChannelId, setCurrChannelId] = useState(1)
  const [channels, setChannels] = useState([])
  const [currServerId, setCurrServerId] = useState(1)
  const [servers, setServers] = useState([])
  const [isMsgsLoading, setIsMsgsLoading] = useState(false)
  const [isChannelsLoading, setIsChannelsLoading] = useState(false)
  const [selfName, setSelfName] = useState("")
  const [selfTag, setSelfTag] = useState("")
  const [msgInput, setMsgInput] = useState("")

  const token = Cookies.get('token')

  useEffect(() => {
    if (token) {
      console.log("token exists! Its " + token)
    }
    else {
      document.location = "/login";
    }
    const fetchSelf = async () => {
      try {
        const response1 = await axios.post("./api/fetchIdByToken", { token: token });
        console.log('succ fetchSelf(tokentoid):');
        console.log(response1.data);
        if (response1.data['result'] != "success"){
          throw new Error(response1.data['result']);
        }
        const response = await axios.post("./api/fetchProfileById", { id: response1.data['id'] });
        if (response.data['result'] === "success"){
          console.log('succ fetchSelf(login):');
          console.log(response.data);
          setSelfName(response.data['profile']['name']);
          setSelfTag (response.data['profile']['tag']);
        }
        else {
          throw new Error(response.data['result']);
        }
      }
      catch (error) {
        console.error('Profile fetch error - ', error);
        alert("Login failed - " + error + ". Going back to login 😿");
        document.location = "/login";
      }
    }
    fetchSelf();
  }, [token]);

  useEffect(() => {
  const fetchMsgs = async () => {
    try {
      setIsMsgsLoading(true)
      const response = await axios.post("./api/fetchMessages", { id: currChannelId });
      setMessages(response.data);
      console.log('succ fetchMsgs:');
      console.log(response.data);
    } catch (error) {
      setMessages(null);
      console.error('Msg fetch error - ', error);
    }
    setIsMsgsLoading(false)
  };
  fetchMsgs();
  }, [currChannelId]);

  useEffect(() => {
    const connSocket = async () => {
      await axios.get("./api/websocket")
      chatsocket = io();
  
      chatsocket.on("connect", () => {
        console.log("[socket] connected to socket");
      });

      chatsocket.on("receiveMsg", (msg) => {
        console.log("[socket] newMessage:");
        console.log(msg);
        if (parseInt(msg['channelid']) === parseInt(currChannelId)) {
          setMessages((prevMessages) => [...prevMessages, msg]);
        }
      })
    }
    connSocket();
  }, [])

useEffect(() => {
  const fetchChannels = async () => {
    try {
      setIsChannelsLoading(true)
      const response = await axios.post("./api/fetchChannels", { id: currServerId });
      setChannels(response.data);
      console.log('succ fetchChannels:');
      console.log(response.data);
    } catch (error) {
      setChannels(null);
      console.error('Channel fetch error - ', error);
    }
    setIsChannelsLoading(false)
  };
  fetchChannels();
}, [currServerId]);

useEffect(() => {
  const fetchServers = async () => {
    try {
      const response = await axios.get("./api/fetchServers");
      setServers(response.data);
      console.log('succ fetchServers:');
      console.log(response.data);
    } catch (error) {
      setServers(null);
      console.error('Server fetch error - ', error);
    }
  };
  fetchServers();
}, [currServerId]);

  const handleMouseMove = (event) => {
    if (showProfile) {
      return
    }
    setMouseY(event.clientY);
  }

  const handleFetchProfile = async (userid : number) => {
    try {
      const response = (await axios.post("./api/fetchProfileById", { id: userid }));
      console.log('succ fetchProfileById:');
      console.log(response.data);
      setProfileData(response.data['profile']);
    }
    catch (error) {
      console.error('Profile fetch error - ', error);
    }
  }

  const handleProfileOpen = (userid : number) => {
    setShowProfile(true);
    setProfileId(userid);
    handleFetchProfile(userid);
    // console.log("open profile");
  };

  const handleProfileClose = () => {
    setShowProfile(false)
  }

  const handleSendMsg = async (e) => {
    if (e.key === "Enter" && msgInput.length > 0) {
      e.preventDefault();
      try {
        chatsocket.emit("sendMsg", { channelid: currChannelId, content: msgInput, token: token });
        console.log('succ sendMsg:');
      } catch (error) {
        console.error('Send msg error - ', error);
      }
      setMsgInput("");
    }
  }

  return (
    <div className="h-screen flex" onMouseMove={handleMouseMove}>
      <Profile 
        id={profileId}
        name={profileData['name']}
        tag={profileData['tag']}
        bio={profileData['bio']}
        show={showProfile} 
        mouseY={mouseY} 
        closeProfile={handleProfileClose}/>
      <div className="w-20 bg-zinc-600">
        {servers ? (
          servers.map((server) => (
          <Server
            name={server.name}
            id={server.serverid}
            key={server.serverid}
            onSwitch={() => setCurrServerId(server.serverid)}
          />
          ))
          ) : (
          <p className="text-zinc-500 absolute pt-8 font-semibold bottom-1/4 text-xl left-[10%] text-center select-none">No servers... join or create one!</p>
        )
        }
      </div>
      <div className="mt-3 w-4/12 lg:w-2/12 bg-zinc-700 shadow-2xl flex flex-col">
        {channels && channels.length > 0 && !isChannelsLoading ? (
          channels.map((channel) => (
          <Channel
            name={channel.name}
            id={channel.id}
            key={channel.id}
            onSwitch={() => setCurrChannelId(channel.id)}
          />
          ))
          ) : isChannelsLoading ? (
            <p className="text-zinc-500 pt-8 font-semibold bottom-1/4 text-xl text-center select-none">Loading channels...</p>
          ) : (
          <p className="text-zinc-500 pt-8 font-semibold bottom-1/4 text-xl text-center select-none">No channels to display? <br></br>Weird...</p>
        )
        }
      </div>
      <div className="w-8/12 lg:w-10/12 bg-zinc-600 shadow-2xl flex flex-col rounded-t-lg">
        <h1 className="text-2xl text-white text-center font-bold bg-zinc-600 w-full h-[6%] shadow-lg rounded-md">ChatName</h1>
        <div className="h-[87%] mr-4 ml-4 overflow-scroll">
          {messages && messages.length > 0 && !isMsgsLoading ? (
            messages.map((message) => (
            <Message
              id={message.id}
              content={message.content}
              author={message.author}
              date={new Date(message.date)}
              openProfile={() => handleProfileOpen(message.authorid)}
              key={message.id}
            />
            ))
            ) : isMsgsLoading ? (  
              <p className="text-zinc-500 mx-auto my-60 h-8 pt-8 font-semibold text-center bottom-1/4 text-2xl left-[52%] select-none">Loading messages...</p>
            ) : messages.length === 0 ? (
            <p className="text-zinc-500 mx-auto my-60 h-8 pt-8 font-semibold text-center bottom-1/4 text-2xl left-[52%] select-none">This channel is empty? <br></br><span className="text-sm">uh, u can be first...</span></p>
            ) : (
            <p className="text-zinc-500 mx-auto my-60 h-8 pt-8 font-semibold text-center bottom-1/4 text-2xl left-[52%] select-none">Error ocured!<br></br>Unable to display messages :(</p>
          )}
        </div>
        <div className="h-[6%] mb-[1%] flex bg-zinc-600">
          <input
            onChange={(e) => setMsgInput(e.target.value)}
            className="h-full flex-grow bg-zinc-500 rounded-lg mx-5 pl-2 text-white"
            type="text"
            placeholder="Введите сообщение..."
            value={msgInput}
            onKeyDown={(e) => handleSendMsg(e)}
          />
          {/* <button
            className="h-full w-10 ml-2 mr-2 bg-zinc-500 rounded-lg text-white p-1"
            type="button"
          >
            <Image src="/icons/send.svg" width={35} height={35} alt="send message" ></Image>
          </button> */}
        </div>
      </div>
      <div className="absolute w-[calc(41.6666%)] md:w-[calc(33.3333%+3rem)] lg:w-[calc(16.7777%+3.75rem)] bottom-0 left-0 h-14">
        <div className="w-full h-full bg-gradient-to-r from-zinc-600 to-zinc-700 shadow-lg flex flex-row">
        { !isAdvButttonsEnabled 
        ? ( <div className="w-2/5 h-full mt-1">
            <h1 className="text-xl text-white font-semibold ml-2 -mb-1">{ selfName ? selfName : "Loading..." }</h1>
            <h1 className="text-sm text-zinc-200 ml-2">{selfTag ? "@" +selfTag : null }</h1>
          </div>
        )
        : null
        }
          <div className={`w-${isAdvButttonsEnabled ? 'full' : '3/5'} w-full h-full mt-2 flex flex-row-reverse mr-2`}>
            <button className="w-10 h-10 ml-2 bg-zinc-600 rounded-lg text-white p-1">
              <Image src="/icons/settings.svg" width={30} height={30} alt="settings"></Image>
            </button>
            <button className="w-10 h-10 ml-2 bg-zinc-600 rounded-lg text-white p-1"
            onClick={() => setIsAdvButttonsEnabled(!isAdvButttonsEnabled)}
            >
              {isAdvButttonsEnabled 
              ? <Image src="/icons/arrow-right.svg" width={30} height={30} alt="arrowRight"></Image> 
              : <Image src="/icons/arrow-left.svg"  width={30} height={30} alt="arrowLeft"></Image>
              }
            </button>
          { isAdvButttonsEnabled 
          ? ( /* эво глупо но JSX expression allows only one element!! */
            <div className="h-full w-max flex flex-row">
              <button className="w-10 h-10 ml-2 bg-zinc-600 rounded-lg text-white p-1">
                <Image src="/icons/door.svg" width={30} height={30} alt="plus" ></Image>
              </button>
              <button className="w-10 h-10 ml-2 bg-zinc-600 rounded-lg text-white p-1">
                <Image src="/icons/hand.svg" width={30} height={30} alt="plus"></Image>
              </button>
              <button className="w-10 h-10 ml-2 bg-zinc-600 rounded-lg text-white p-1">
                <Image src="/icons/plus.svg" width={30} height={30} alt="plus"></Image>
              </button>
              <p className="text-zinc-500 ml-2 mt-1 text-2xl">|</p>
            </div>
          )
          : null
          }
          </div>
        </div>
      </div>
    </div>
  );
}
