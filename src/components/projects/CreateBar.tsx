import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const CreateBar = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");
  let id = 0; // Declare id variable outside the useEffect

  const handleNavigation = (tab: string, path: string) => {
    setActiveTab(tab);
    router.push(path);
  };

  useEffect(() => {
    if (router.pathname.includes("/teammates")) {
      setActiveTab("팀원 추가");
      id = parseInt(router.query.id as string, 10); // Extract id from router.query
    } else if (router.pathname.includes("/outputs")) {
      setActiveTab("산출물 선택");
      id = parseInt(router.query.id as string, 10); // Extract id from router.query
    }else{
      setActiveTab("기본정보 입력")
    }
  }, [router.pathname, router.query]); // Add router.query to dependencies to react to query changes

  return (
    <nav className="h-full w-[300px] border-r border-[#465069] py-[16px]">
      <div className="flex flex-col text-white">
        <div className="flex items-center text-[28px] h-[80px] px-[16px] border-b border-[#465069]">
          DEV-HELPER
        </div>
        <div className="text-[20px] mt-[20px] flex gap-[10px] flex-col">
          <div className={`py-[10px] px-[16px] w-full ${
              activeTab === "기본정보 입력" ? "bg-[#132147]" : ""
          }`}>
            기본정보 입력
          </div>
          <div
            className={`py-[10px] px-[16px] w-full cursor-pointer ${
              activeTab === "팀원 추가" ? "bg-[#132147]" : ""
            }`}
            onClick={() => handleNavigation("팀원 추가", `/projects/${id}/teammates`)}
          >
            팀원 추가
          </div>
          <div
            className={`py-[10px] px-[16px] w-full cursor-pointer ${
              activeTab === "산출물 선택" ? "bg-[#132147]" : ""
            }`}
            onClick={() => handleNavigation("산출물 선택", `/projects/${id}/outputs`)}
          >
            산출물 선택
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CreateBar;
