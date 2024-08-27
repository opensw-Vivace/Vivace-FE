import LeftSide from "@/components/LeftSide";
import TopBar from "@/components/TopBar";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface Project {
  project_id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
  team_name: string;
}

interface Member {
  name: string;
  role: string;
  positionList: string[];
}

interface Progress {
  totalPercent: number;
  uppercent: number;
}

interface ProjectData extends Project {
  members: Member[];
  progress: Progress;
}

const Dashboard = () => {
  const router = useRouter();
  const cookies = new Cookies();
  const { id } = router.query;

  const [project, setProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    if (!id) return; // id가 없으면 실행하지 않음

    const fetchProjectData = async () => {
      try {
        const projectResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}`,
          {
            headers: {
              Authorization: cookies.get("accessToken"),
            },
          }
        );

        const membersResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/members`,
          {
            headers: {
              Authorization: cookies.get("accessToken"),
            },
          }
        );

        const progressResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/progress`,
          {
            headers: {
              Authorization: cookies.get("accessToken"),
            },
          }
        );

        const projectData: ProjectData = {
          ...projectResponse.data,
          members: membersResponse.data,
          progress: progressResponse.data,
        };

        setProject(projectData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProjectData();
  }, [id]); // id가 변경될 때마다 실행

  // Deadline까지 남은 일수 계산 함수
  const calculateDaysUntilDeadline = (deadline: string) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
  };

  if (!project) return <div>Loading...</div>; // 데이터를 불러오기 전에는 로딩 상태 표시

  return (
    <div className="flex w-full">
      <LeftSide />
      <div className="flex flex-col w-full text-[#ffffff]">
        <TopBar />
        <div className="ml-[10px] rounded-[10px] border-[#465069] bg-[#141B2C] p-[15px] h-full">
          <div
            key={project.project_id}
            className="cursor-pointer relative w-[50%] bg-[#132147] rounded-[15px] p-[25px]"
          >
            <h2 className="font-bold text-[30px] flex justify-between mb-[10px]">
              {project.title}
              <div className="text-[#FF8E8E] ">
                {calculateDaysUntilDeadline(project.deadline)}
              </div>
            </h2>
            <div className="flex gap-[10px] items-center mb-[20px]">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-[#7FDB70] h-4 rounded-full"
                  style={{ width: `${project.progress.totalPercent}%` }}
                ></div>
              </div>
              <p>{project.progress.totalPercent}%</p>
            </div>
            <div className="text-[20px] flex">
              <div className="w-[50px]">팀명</div>
              <span className="text-[#ABF99E]">{project.team_name}</span>
            </div>
            <div className="flex ml-[50px] mb-[30px] flex-wrap">
              {project.members.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center flex-row flex-wrap"
                >
                  <div className="mr-[10px]">{member.name}</div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {member.positionList.map((position) => {
                      return (
                        <span
                          key={position}
                          className="border border-[#1B37A6] text-[#1B37A6] px-2 py-1 rounded-lg text-[12px]"
                        >
                          {position}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="absolute bottom-[15px] text-[15px]">
              ~ {project.deadline}
            </p>
          </div>
          <div className="mt-[50px]">
            <div className="text-[30px] p-[12px] border-b border-[#727680]">
              산출물
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
