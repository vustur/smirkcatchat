'use client';
import Message from "./components/Message";
import Channel from "./components/Channel";
import Server from "./components/Server";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import ServerSettings from "./components/SettingsServer";
import NewChannelPopup from "./components/newChannelPopup";
import React, { useState, useEffect, SetStateAction } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from 'js-cookie'
import io from "socket.io-client";
let socket: any = null;

export default function Home() {
  const [showProfile, setShowProfile] = useState(false)
  const [mouseY, setMouseY] = useState(0)
  const [profileId, setProfileId] = useState(0)
  const [isAdvButttonsEnabled, setIsAdvButttonsEnabled] = useState(false)
  const [messages, setMessages] = useState([])
  const [profileData, setProfileData] = useState({ name: "Loading...", tag: "", bio: "" })
  const [currChannelId, setCurrChannelId] = useState(0)
  const [currChannelName, setCurrChannelName] = useState("")
  const [currPerms, setCurrPerms] = useState(null)
  const [channels, setChannels] = useState([])
  const [currServerId, setCurrServerId] = useState(0)
  const [currServerName, setCurrServerName] = useState("")
  const [servers, setServers] = useState([])
  const [isMsgsLoading, setIsMsgsLoading] = useState(false)
  const [isChannelsLoading, setIsChannelsLoading] = useState(false)
  const [selfName, setSelfName] = useState("")
  const [selfTag, setSelfTag] = useState("")
  const [selfBio, setSelfBio] = useState("")
  const [selfId, setSelfId] = useState(0)
  const [msgInput, setMsgInput] = useState("")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isServerSettingsOpen, setIsServerSettingsOpen] = useState(false)
  const [isCreateChannelPopupOpen, setIsCreateChannelPopupOpen] = useState(false)

  const token = Cookies.get('token')

  useEffect(() => {
    console.log(new Date().getMonth() === 2 && new Date().getDate() === 17)
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
          setSelfBio (response.data['profile']['bio']);
          setSelfId  (response.data['profile']['id']);
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

  
  const fetchMsgs = async (msgsOffset: number) => {
    console.log("load messages with offset " + msgsOffset + " ! ");
    try {
      setIsMsgsLoading(true)
      const response = await axios.post("./api/fetchMessages", { id: currChannelId, offset: msgsOffset });
      let newMessages = response.data.map((msg: { date: string, author: string, content: string }) => ({
        date: new Date(msg.date),
        author: msg.author,
        content: msg.content,
        authorid: msg.authorid,
        id: msg.id,
        channelid: msg.channelid
      }));
      setMessages((prevMessages) => [...newMessages, ...prevMessages]);
      console.log('succ fetchMsgs:');
      console.log(response.data);
      if (msgsOffset === 0) {
        const msgElement = document.getElementById('messages');
        if (msgElement) {
          // goofy fix BUT WORKS!! 🔥🔥🔥
          setTimeout(() => { msgElement.scrollTo({ top: msgElement.scrollHeight, behavior: 'smooth' }); }, 100);
        }
      }
    } catch (error) {
      setMessages([]);
      console.error('Msg fetch error - ', error);
    }
    setIsMsgsLoading(false)
  };
  useEffect(() => {
    setMessages([])
    console.log("load msgs from channel " + currChannelId);
    fetchMsgs(0);
  }, [currChannelId]);

  useEffect(() => {
    const connectSocket = async () => {
      const response = await axios.get("./api/websocket");
      socket = io(response.data.url);
    };

    const handleNewMessage = (msg: any) => {
      if (parseInt(msg.channelid) === currChannelId) {
        setMessages((prevMessages) => [...prevMessages, msg]);
        const msgElement = document.getElementById('messages');
        if (msgElement) {
          setTimeout(() => { msgElement.scrollTo({ top: msgElement.scrollHeight, behavior: 'smooth' }); }, 100);
        }
      }
    };

    const setupSocket = () => {
      socket.on("connect", () => {
        console.log("[socket] connected to socket");
      });

      socket.on("receiveMsg", handleNewMessage);
    };

    connectSocket().then(() => {
      setupSocket();
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [currChannelId]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsChannelsLoading(true)
        const response = await axios.post("./api/fetchChannels", { id: currServerId });
        setChannels(response.data);
        console.log('succ fetchChannels:');
        console.log(response.data);
      } catch (error) {
        setChannels([]);
        console.error('Channel fetch error - ', error);
      }
      setIsChannelsLoading(false)
    };
    fetchChannels();
  }, [currServerId]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axios.post("./api/fetchServers", {token: token});
        setServers(response.data);
        console.log('succ fetchServers:');
        console.log(response.data);
      } catch (error) {
        setServers([]);
        console.error('Server fetch error - ', error);
      }
    };
    fetchServers();
  }, [currServerId]);

  const handleMouseMove = (event: any) => {
    if (showProfile) {
      return
    }
    if (event.clientY > window.innerHeight / 8 && event.clientY < (window.innerHeight / 4) * 3) {
      setMouseY(event.clientY); 
    }
  }

  const handleFetchProfile = async (userid : number) => {
    try {
      const response = await axios.post("./api/fetchProfileById", { id: userid });
      console.log('succ fetchProfileById:');
      console.log(response.data);
      if (response.data['result'] == "Profile not found" || response.data['profile'] == null) {
        setProfileData({
          name: "Unkown user",
          tag: "-",
          bio: "This user is deleted or does not exist"
        });
      } else if (response.data['result'] == "success") {
        setProfileData(response.data['profile'] as {
          name: string;
          tag: string;
          bio: string;
        }); 
      }
    }
    catch (error) {
      console.error('Profile fetch error - ', error);
    }
  }

  const handleProfileOpen = (userid : number) => {
    setShowProfile(true);
    setProfileId(userid);
    handleFetchProfile(userid);
    console.log("open profile");
  };

  const handleProfileClose = () => {
    setShowProfile(false)
  }

  const handleSendMsg = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && msgInput.length > 0) {
      e.preventDefault();
      try {
        socket.emit("sendMsg", { channelid: currChannelId, content: msgInput, token: token, id: profileId });
        console.log('succ sendMsg in channel ' + currChannelId + ":");
      } catch (error) {
        console.error('Send msg error - ', error);
      }
      setMsgInput("");
    }
  }

  const handleLogout = () => {
    Cookies.remove('token');
    document.location = "/login";
  }

  const handleServerSwitch = async (serverid : number, currServerName : string) => {
    setCurrPerms(null)
    setCurrServerId(serverid)
    setCurrServerName(currServerName)
    try {
      const response = await axios.post("./api/checkPermissions", { token, serverid })
      console.log('succ checkPermissions:');
      if (response.data['result'] != "success"){
        setCurrPerms({"mng_serv": 0, "owner_perm": 0, "mng_chnls": 0, "mng_mems": 0, "dlt_msgs": 0})
        console.log("No perms in this server")
        return
      }
      const permsArray = JSON.parse(response.data['perms']['perms'])
      setCurrPerms(permsArray);
      console.log(permsArray);
    }
    catch (error) {
      console.error("Perms check error - ", error);
    }
  }

  const handleOpenServerSettings = () => {
    if (currServerId == null || currServerId == 0 || currPerms == null) {
      return
    }
    setIsServerSettingsOpen(true)
  }

  const handleCreateChannel = async (name) => {
    try {
      if (currServerId == null || currServerId == 0 || currPerms == null) {
        return
      }
      setIsCreateChannelPopupOpen(false)
      await axios.post("./api/createChannel", { token, serverid: currServerId, name })
    }
    catch (error) {
      console.error("Create channel error - ", error.message);
    }
  }

  return (
    <div className="h-screen flex" onMouseMove={handleMouseMove}>
      <Profile
        id={profileData['id']}
        name={profileData['name']}
        tag={profileData['tag']}
        bio={profileData['bio']}
        show={showProfile} 
        mouseY={mouseY} 
        closeProfile={handleProfileClose}/>
      <div className="flex flex-row h-full w-fit relative">
        <div className="w-20 min-w-20 bg-zinc-600">
          {servers.length > 0 ? (
            servers.map((server) => (
            <Server
              name={server['name']}
              //id={server['serverid']}
              key={server['serverid']}
              onSwitch={() => handleServerSwitch(server['serverid'], server['name'])}
            />
            ))
            ) : (
            <p className="text-zinc-500 absolute pt-8 font-semibold bottom-1/4 text-xl left-[10%] text-center select-none">No servers... join or create one!</p>
          )
          }
        </div>
        <div className="w-3/12 lg:w-2/12 min-w-52 bg-zinc-700 shadow-2xl flex flex-col">
          <div className="text-white text-center font-bold bg-zinc-600/40 w-full h-12 shadow-lg mb-3 pt-2 hover:cursor-pointer"
            title={currServerName
            + "\nClick to open settings"}
            onClick={() => handleOpenServerSettings()}>
            {currServerName.length > 20 ? currServerName.slice(0, 20) + '...' : currServerName}
          </div>
          {channels && channels.length > 0 && !isChannelsLoading ? (
            channels.map((channel) => {
              return (
                <Channel
                  name={channel['name']}
                  // id={channel['id']}
                  key={channel['id']}
                  onSwitch={() => {setCurrChannelId(channel['id']); setCurrChannelName(channel['name'])}} />
              );
            })
            ) : currServerId === 0 ? (
              <p className="text-zinc-500 pt-8 font-semibold bottom-1/4 text-xl text-center select-none">Select a server</p>
            ) : isChannelsLoading ? (
              <p className="text-zinc-500 pt-8 font-semibold bottom-1/4 text-xl text-center select-none">Loading channels...</p>
            ) : (
            <p className="text-zinc-500 pt-8 font-semibold bottom-1/4 text-xl text-center select-none">No channels to display? <br></br>Weird...</p>
          )
          }
          { currServerId != 0 && !isChannelsLoading && currPerms != null && (currPerms['mng_chnls'] == 1 || currPerms['owner_perm'] == 1) ? (
            <button className="w-full h-12 text-zinc-500 text-xl font-semibold hover:cursor-pointer"
            onClick={() => setIsCreateChannelPopupOpen(true)}
            >+ Create channel</button>
          ): null}
        </div>
        <div className="absolute w-full bottom-0 left-0 h-14">
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
              <Image src="/icons/settings.svg" width={30} height={30} alt="settings" onClick={() => setIsSettingsOpen(true)} title="Settings"></Image>
            </button>
            <button className="w-10 h-10 ml-2 bg-zinc-600 rounded-lg text-white p-1"
            onClick={() => setIsAdvButttonsEnabled(!isAdvButttonsEnabled)}
            >
              {isAdvButttonsEnabled 
              ? <Image src="/icons/arrow-right.svg" width={30} height={30} alt="arrowRight" title="Hide fast buttons"></Image> 
              : <Image src="/icons/arrow-left.svg"  width={30} height={30} alt="arrowLeft"  title="Show fast buttons"></Image>
              }
            </button>
          { isAdvButttonsEnabled 
          ? ( /* эво глупо но JSX expression allows only one element!! */
            <div className="h-full w-max flex flex-row">
              <button 
                className="w-10 h-10 ml-2 bg-zinc-600 rounded-lg text-white p-1"
                onClick={() => handleLogout()}
                >
                <Image src="/icons/door.svg" width={30} height={30} alt="door" title="Logout"></Image>
              </button>
              <button className="w-10 h-10 ml-2 bg-zinc-600 rounded-lg text-white p-1">
                <Image src="/icons/hand.svg" width={30} height={30} alt="hand" title="Add friend"></Image>
              </button>
              <button className="w-10 h-10 ml-2 bg-zinc-600 rounded-lg text-white p-1">
                <Image src="/icons/plus.svg" width={30} height={30} alt="plus" title="Create server"></Image>
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
      <div className="w-8/12 lg:w-10/12 bg-zinc-600 shadow-2xl flex flex-col rounded-t-lg">
        <h1 className="text-2xl text-white text-center font-bold bg-zinc-600 w-full h-14 shadow-lg rounded-md">{currChannelName}</h1>
        <div className="h-full mr-4 ml-4 overflow-scroll overflow-x-hidden mb-4 items-center" id="messages">
          {messages && messages.length > 0 && !isMsgsLoading ? (
            <button className="text-zinc-200 bg-zinc-700/30 my-4 p-2 rounded-md font-semibold text-center text-xl" onClick={() => fetchMsgs(messages.length)}>
            Load more messages
            </button>
          ) : null}
          {messages && messages.length > 0 && !isMsgsLoading ? (
            messages.map((message) => (
            <Message
              id={message['id']}
              content={message['content']}
              author={message['author']}
              date={new Date(message['date'])}
              openProfile={() => handleProfileOpen(message['authorid'])}
              key={message['id']}
            />
            ))
            ) : currChannelId === 0 ? (  
              <p className="text-zinc-500 mx-auto my-60 h-8 pt-8 font-semibold text-center bottom-1/4 text-2xl left-[52%] select-none">Select a channel</p>
            ) : isMsgsLoading ? (  
              <p className="text-zinc-500 mx-auto my-60 h-8 pt-8 font-semibold text-center bottom-1/4 text-2xl left-[52%] select-none">Loading messages...</p>
            ) : messages.length === 0 ? (
            <p className="text-zinc-500 mx-auto my-60 h-8 pt-8 font-semibold text-center bottom-1/4 text-2xl left-[52%] select-none">This channel is empty? <br></br><span className="text-sm">uh, u can be first...</span></p>
            ) : (
            <p className="text-zinc-500 mx-auto my-60 h-8 pt-8 font-semibold text-center bottom-1/4 text-2xl left-[52%] select-none">Error ocured!<br></br>Unable to display messages :(</p>
          )}
        </div>
        <div className="h-12 mb-2 flex bg-zinc-600">
          { currChannelId !== 0 ? (
            <input
              onChange={(e) => setMsgInput(e.target.value)}
              className="h-full flex-grow bg-zinc-500 rounded-lg mx-5 pl-2 text-white"
              type="text"
              placeholder="Введите сообщение..."
              value={msgInput}
              onKeyDown={(e) => handleSendMsg(e)}
            />
          ) : null
          }
        </div>
      </div>
      <Settings isEnabled={isSettingsOpen} username={selfName} tag={selfTag} bio={selfBio} handleClose={() => setIsSettingsOpen(false)}></Settings>
      <ServerSettings isEnabled={isServerSettingsOpen} serverid={currServerId} perms={currPerms} handleClose={() => setIsServerSettingsOpen(false)} openProfile={(userid) => handleProfileOpen(userid)} userid={selfId}></ServerSettings>
      <NewChannelPopup isEnabled={isCreateChannelPopupOpen} handleClose={() => setIsCreateChannelPopupOpen(false)} handleConfirm={(name) => handleCreateChannel(name)}></NewChannelPopup>
    </div>
  );
}
