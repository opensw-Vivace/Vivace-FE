import React from "react";

const CreateBar = () => {
  return (
    <nav className=" h-full w-[300px] border-r border-[#465069] py-[16px]">
      <div className="flex flex-col text-white ">
        <div className="flex items-center text-[28px] h-[80px] px-[16px] border-b border-[#465069] ">
          DEV-HELPER
        </div>
        <div className="text-[20px] mt-[20px] flex gap-[10px] flex-col">
          <div className="py-[10px] px-[16px] w-full bg-[#132147]">
            기본정보 입력
          </div>
          <div className="py-[10px] px-[16px] w-full ">팀원 추가</div>
          <div className="py-[10px] px-[16px] w-full ">산출물 선택</div>
        </div>
      </div>
    </nav>
  );
};

export default CreateBar;
