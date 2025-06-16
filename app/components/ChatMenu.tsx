"use client";

import React from "react";

type LogoutHeaderProps = {
  room: string;
  sender: string;
  onLogout: () => void;
};

const LogoutHeader = ({ room, sender, onLogout }: LogoutHeaderProps) => {
  return (
    <header className="p-4 text-sm flex justify-between items-center">
      <div>
        <strong>Room {room}</strong> ｜ {sender}
      </div>
      <button
        className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
        onClick={onLogout}
      >
        ログアウト
      </button>
    </header>
  );
};

export default LogoutHeader;