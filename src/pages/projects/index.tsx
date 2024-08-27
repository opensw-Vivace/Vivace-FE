import LeftSide from "@/components/projects/LeftSide";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  return (
    <div className="flex w-full">
      <LeftSide />
      <div className="w-full">
        <div className="flex justify-end items-center h-[96px]  px-[16px] border-b border-[#465069]">
          <div
            className="cursor-pointer bg-[#264FF9] w-[250px] py-[10px] rounded-[8px] text-[20px] text-center text-[#ffffff]"
            onClick={() => router.push("/projects/create")}
          >
            Create Project
          </div>
        </div>
        <div className="flex flex-row h-full">
          <div className="w-[400px] h-full border-r border-[#465069]"></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
