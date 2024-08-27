import LeftSide from "@/components/LeftSide";
import TopBar from "@/components/TopBar";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("할 일");

  const cookies = new Cookies();

  const renderContent = () => {
    switch (activeTab) {
      case "할 일":
        return (
          <div className="flex flex-col w-full p-4 bg-gray-800 rounded-lg">
            <h2 className="text-white">할 일 리스트</h2>
            {/* Render 할 일 data here */}
            <pre>{JSON.stringify(todoData, null, 2)}</pre>
          </div>
        );
      case "이슈":
        return (
          <div className="flex flex-col w-full p-4 bg-gray-800 rounded-lg">
            <h2 className="text-white">이슈 리스트</h2>
            {/* Render 이슈 data here */}
            <pre>{JSON.stringify(issueData, null, 2)}</pre>
          </div>
        );
      case "테스트":
        return (
          <div className="flex flex-col w-full p-4 bg-gray-800 rounded-lg">
            <h2 className="text-white">테스트 리스트</h2>
            {/* Render 테스트 data here */}
            <pre>{JSON.stringify(testData, null, 2)}</pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full">
      <LeftSide />
      <div className="flex flex-col w-full text-[#ffffff]">
        <TopBar />
        <div className="flex space-x-2 ml-[10px]">
          <button
            className={`px-[30px] py-[8px] rounded-t-lg ${
              activeTab === "할 일" ? "bg-[#1F2536]" : "bg-[#0D1426]"
            }`}
            onClick={() => setActiveTab("할 일")}
          >
            할 일
          </button>
          <button
            className={`px-[30px] py-[8px] rounded-t-lg ${
              activeTab === "이슈" ? "bg-[#1F2536]" : "bg-[#0D1426]"
            }`}
            onClick={() => setActiveTab("이슈")}
          >
            이슈
          </button>
          <button
            className={`px-[30px] py-[8px] rounded-t-lg ${
              activeTab === "테스트" ? "bg-[#1F2536]" : "bg-[#0D1426]"
            }`}
            onClick={() => setActiveTab("테스트")}
          >
            테스트
          </button>
        </div>
        <div className="p-4 bg-[#1F2536]  h-full ">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
