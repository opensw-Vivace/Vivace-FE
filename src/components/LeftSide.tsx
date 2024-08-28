import Image from "next/image";
import HomeIcon from "../../public/homebutton.png";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LeftSide = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("대시보드");


  const { id } = router.query;


  const handleNavigation = (tab: string, path: string) => {
    setActiveTab(tab);
    router.push(path);
  };

  useEffect(() => {
    if (router.pathname.includes("/dashboard")) {
      setActiveTab("대시보드");
    } else if (router.pathname.includes("/project")) {
      setActiveTab("프로젝트");
    } else if (router.pathname.includes("/outputs")) {
      setActiveTab("산출물 관리");
    }
  }, [router.pathname]);


  return (
    <nav className="h-[100vh] w-[300px] border-r border-[#465069] py-[16px]">
      <div className="flex flex-col text-white">
        <Image
          className="w-[20px] h-[20px] ml-[16px] cursor-pointer"
          src={HomeIcon}
          alt=""
          onClick={() => router.push("/projects")}
        />
        <div className="text-[28px] py-[10px] px-[16px]">Vivace Project</div>
        <div className="text-[20px] mt-[40px] flex gap-[10px] flex-col">
          <div
            className={`py-[10px] px-[16px] w-full cursor-pointer ${
              activeTab === "대시보드" ? "bg-[#132147]" : ""
            }`}
            onClick={() => handleNavigation("대시보드", `/helper/${id}/dashboard`)}
          >
            대시보드
          </div>
          <div
            className={`py-[10px] px-[16px] w-full cursor-pointer ${
              activeTab === "프로젝트" ? "bg-[#132147]" : ""
            }`}
            onClick={() => handleNavigation("프로젝트", `/helper/${id}/project`)}
          >
            프로젝트
          </div>
          <div
            className={`py-[10px] px-[16px] w-full cursor-pointer ${
              activeTab === "산출물 관리" ? "bg-[#132147]" : ""
            }`}
            onClick={() => handleNavigation("산출물 관리", `/helper/${id}/outputs`)}
          >
            산출물 관리
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LeftSide;
