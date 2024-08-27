import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CreateBar from "../../../components/projects/CreateBar";
import Cookies from "universal-cookie";
import axios from "axios";

interface User {
  memberId: number;
  email: string;
  name: string;
}

interface InviteData {
  projectId: number;
  receiverId: number;
}

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);

  const router = useRouter();
  const cookies = new Cookies();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/members`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: cookies.get("accessToken"),
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  const { id } = router.query;
  const handleInvite = async (user: User) => {
    const inviteData: InviteData = {
      projectId: id ? parseInt(id as string, 10) : 0,
      receiverId: user.memberId,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/invitations`,
        inviteData, // Body data
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: cookies.get("accessToken"),
          },
        }
      );

      alert(
        `${user.name}님께 초대장 발송을 완료하였습니다. 초대장을 수락할 경우, 오른쪽 화면에서 확인하실 수 있습니다.`
      );
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
                  key={user.memberId}
                  className="flex justify-between items-center px-2 gap-3 py-2 border-b border-gray-300"
                >
                  <span>
                    {user.name} <br />{" "}
                    <span className="text-[#d9d9d9]"> {user.email}</span>
                  </span>
                  <button
                    onClick={() => handleInvite(user)}
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
