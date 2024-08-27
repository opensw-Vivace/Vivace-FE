import { useRouter } from "next/router";
import React, { useState } from "react";
import CreateBar from "../../components/projects/CreateBar";
import Cookies from "universal-cookie";

interface ProjectData {
  title: string;
  teamName: string;
  deadline: string;
  description: string;
  iterationLen: number;
  positionName: string[];
}

const Index = () => {
  const [formData, setFormData] = useState<ProjectData>({
    title: "",
    teamName: "",
    deadline: "",
    description: "",
    iterationLen: 1,
    positionName: [],
  });

  const router = useRouter();
  const cookies = new Cookies();

  const availablePositions = ["front", "back", "pm", "app", "designer"];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setFormData((prevFormData) => {
      const newPositionName = checked
        ? [...prevFormData.positionName, value]
        : prevFormData.positionName.filter((position) => position !== value);
      return {
        ...prevFormData,
        positionName: newPositionName,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const sanitizedFormData = {
      ...formData,
      positionName: formData.positionName.filter((position) => position !== ""),
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: cookies.get("accessToken"),
          },
          body: JSON.stringify(sanitizedFormData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        return;
      }

      const data = await response.json();
      console.log("Success:", data);
      router.push(`/projects/${data.id}/teammates`);
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
            <div className="text-[20px] mt-[20px] flex gap-[10px] flex-col">
              <div className="py-[10px] px-[16px] w-full bg-[#132147] text-[#ffffff]">
                기본정보 입력
              </div>
            </div>
          </div>
          <div className="w-full h-full px-[16px] py-[16px] text-[18px]">
            <form
              onSubmit={handleSubmit}
              className="relative h-full flex gap-[20px] w-full flex-col"
            >
              <div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="제목"
                  className="mb-[30px] bg-[#0A1123] w-full text-center text-[30px] py-[10px] border-b border-[#465069]"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row">
                <div className="w-[100px]">팀명</div>
                <input
                  className="bg-[#0A1123] w-full px-[10px]"
                  type="text"
                  id="teamName"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row">
                <div className="w-[100px]">마감일</div>
                <input
                  className="bg-[#0A1123] w-full px-[10px] text-[#d9d9d9] text-[15px]"
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row">
                <div className="w-[100px]">설명</div>
                <textarea
                  className="bg-[#0A1123] w-full px-[10px] h-[150px]"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row">
                <div className="w-[100px]">반복 날짜</div>
                <input
                  className="bg-[#0A1123] w-full px-[10px] text-center"
                  type="number"
                  id="iterationLen"
                  name="iterationLen"
                  value={formData.iterationLen}
                  onChange={handleChange}
                  min={1}
                />
              </div>
              <div className="flex flex-row">
                <div className="w-[100px]">참여 역할</div>
                <div>
                  {availablePositions.map((position) => (
                    <div key={position} className="flex gap-[10px]">
                      <input
                        className="bg-[#d9d9d9]"
                        type="checkbox"
                        id={position}
                        value={position}
                        checked={formData.positionName.includes(position)}
                        onChange={handleCheckboxChange}
                      />
                      <label className="text-[#d9d9d9]" htmlFor={position}>
                        {position}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className=" absolute bottom-[20px] cursor-pointer bg-[#264FF9] w-full py-[10px] rounded-[8px] text-[20px] text-center text-[#ffffff]"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
