'use client';
import Message from "./components/Message";
import Channel from "./components/Channel";
import Server from "./components/Server";
import Profile from "./components/Profile";
import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const [showProfile, setShowProfile] = useState(false)
  const [mouseY, setMouseY] = useState(0)
  const [profileId, setProfileId] = useState(0)
  const profile = useRef(null)

  const handleMouseMove = (event) => {
    if (showProfile) {
      return
    }
    setMouseY(event.clientY);
  }

  const handleProfileOpen = (userid : number) => {
    setShowProfile(true)
    setProfileId(userid)
  }

  const handleProfileClose = () => {
    setShowProfile(false)
  }

  return (
    <div className="h-screen flex" onMouseMove={handleMouseMove}>
      <Profile id={profileId} show={showProfile} mouseY={mouseY} closeProfile={handleProfileClose}/>
      <div className="w-20 bg-zinc-600">
        <Server name="ServerName"></Server>
        <Server name="Second server"></Server>
      </div>
      <div className="mt-3 w-4/12 lg:w-2/12 bg-zinc-700 shadow-2xl flex flex-col">
        <Channel name="ChatName"></Channel>
        <Channel name="Additional"></Channel>
        <Channel name="Another one"></Channel>
      </div>
      <div className="w-8/12 lg:w-10/12 bg-zinc-600 shadow-2xl flex flex-col rounded-t-lg">
        <h1 className="text-2xl text-white text-center font-bold bg-zinc-600 w-full h-[6%] shadow-lg rounded-md">ChatName</h1>
        <div className="h-[87%] mr-4 ml-4 overflow-scroll">
          <Message content="Сложно сказать, почему непосредственные участники технического прогресса объявлены нарушающими общечеловеческие нормы этики и морали!" author="Someone" date={new Date()} id="0" onProfileOpen={() => handleProfileOpen(0)}/>
          <Message content="Разнообразный и богатый опыт говорит нам, что сплочённость команды профессионалов однозначно фиксирует необходимость глубокомысленных рассуждений." author="Fish" date={new Date()} id="1" onProfileOpen={() => handleProfileOpen(1)} />
        </div>
        <div className="h-[6%] mb-[1%] flex bg-zinc-600">
          <input
            className="h-full flex-grow bg-zinc-500 rounded-lg ml-5 pl-2 text-white"
            type="text"
            placeholder="Введите сообщение..."
          />
          <button
            className="h-full w-10 ml-2 mr-2 bg-zinc-500 rounded-lg text-white"
            type="button"
          >
            S
          </button>
        </div>
      </div>
    </div>
  );
}
