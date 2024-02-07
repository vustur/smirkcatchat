'use client';
import Message from "./components/Message";
import Channel from "./components/Channel";
import Server from "./components/Server";
import Profile from "./components/Profile";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [showProfile, setShowProfile] = useState(false)
  const [mouseY, setMouseY] = useState(0)
  const [profileId, setProfileId] = useState(0)
  const profile = useRef(null)
  const [isAdvButttonsEnabled, setIsAdvButttonsEnabled] = useState(false)

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
          <Message content="Сложно сказать, почему непосредственные участники технического прогресса объявлены нарушающими общечеловеческие нормы этики и морали!" author="Someone" date={new Date(1707037200000)} id="0" onProfileOpen={() => handleProfileOpen(0)}/>
          <Message content="Разнообразный и богатый опыт говорит нам, что сплочённость команды профессионалов однозначно фиксирует необходимость глубокомысленных рассуждений." author="Fish" date={new Date(1707037200000)} id="1" onProfileOpen={() => handleProfileOpen(1)} />
        </div>
        <div className="h-[6%] mb-[1%] flex bg-zinc-600">
          <input
            className="h-full flex-grow bg-zinc-500 rounded-lg ml-5 pl-2 text-white"
            type="text"
            placeholder="Введите сообщение..."
          />
          <button
            className="h-full w-10 ml-2 mr-2 bg-zinc-500 rounded-lg text-white p-1"
            type="button"
          >
            <Image src="/icons/send.svg" width={35} height={35} alt="send message" ></Image>
          </button>
        </div>
      </div>
      <div className="absolute w-[calc(41.6666%)] md:w-[calc(33.3333%+3rem)] lg:w-[calc(16.7777%+3.75rem)] bottom-0 left-0 h-14">
        <div className="w-full h-full bg-gradient-to-r from-zinc-600 to-zinc-700 shadow-lg flex flex-row">
        { !isAdvButttonsEnabled 
        ? ( <div className="w-2/5 h-full mt-1">
            <h1 className="text-xl text-white font-semibold ml-2 -mb-1">Usename</h1>
            <h1 className="text-sm text-zinc-200 ml-2">@username</h1>
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
