import { useRouter } from "next/router";
import React, { useState } from "react";
import CreateBar from "../../../components/projects/CreateBar";
import Cookies from "universal-cookie";

interface User {
  id: number;
  email: string;
}

interface InviteData {
  id: string[] | undefined | string;
  receiverId: number;
}

const Index = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, email: "user1@example.com" },
    { id: 2, email: "user2@example.com" },
    { id: 3, email: "user3@example.com" },
  ]);

  const router = useRouter();
  const cookies = new Cookies();

  const availablePositions = ["front", "back", "pm", "app", "designer"];

  const { id } = router.query;
  const handleInvite = async (receiverId: number) => {
    const inviteData: InviteData = {
      id,
      receiverId,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/invitations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${cookies.get("accessToken")}`,
          },
          body: JSON.stringify(inviteData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        return;
      }

      const data = await response.json();
      console.log("Success:", data);
      // 성공적으로 초대된 경우 후속 작업 추가 가능
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex h-[100vh] w-full text-[#ffffff]">
      <CreateBar />
      <div className="w-full h-full">
        <div className="flex h-[calc(100%-96px)] flex-row mt-[96px] border-t border-[#465069]">
          <div className="w-[300px] border-r border-[#465069]">
            <ul className="px-[20px] mt-[20px]">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center px-2 gap-3 py-2 border-b border-gray-300"
                >
                  <span>{user.email}</span>
                  <button
                    onClick={() => handleInvite(user.id)}
                    className="bg-blue-500 text-white px-2 py-1 text-[12px] rounded hover:bg-blue-600"
                  >
                    Invite
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full h-full px-[16px] py-[16px] text-[18px]"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
