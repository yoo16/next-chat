"use client";

import { User } from "@prisma/client";
import React from "react";

type LogoutHeaderProps = {
  room: string;
  user: User;
  onLogout: () => void;
};

const LogoutHeader = ({ room, user, onLogout }: LogoutHeaderProps) => {
  return (
    <header className="p-4 text-sm flex justify-between items-center">
      <div>
        <strong>Room {room}</strong> | {user.name} さん | { user.lang }
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