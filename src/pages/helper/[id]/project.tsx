import Issues from "@/components/helper/Issues";
import Tests from "@/components/helper/Tests";
import Todos from "@/components/helper/Todos";
import LeftSide from "@/components/LeftSide";
import TopBar from "@/components/TopBar";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("할 일");

  const router = useRouter();

  const { id } = router.query;

  if (!id) return;

  const renderContent = () => {
    switch (activeTab) {
      case "할 일":
        return <Todos id={id} />;
      case "이슈":
        return <Issues id={id} />;
      case "테스트":
        return <Tests id={id} />;
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
