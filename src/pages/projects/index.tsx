import LeftSide from "@/components/projects/LeftSide";
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

const Index = () => {
  const router = useRouter();
  const cookies = new Cookies();

  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects`,
          {
            headers: {
              Authorization: cookies.get("accessToken"),
            },
          }
        );

        const projectList: Project[] = response.data;

        // 각 프로젝트에 대해 members와 progress 데이터를 가져옴
        const projectDataPromises = projectList.map(async (project) => {
          const membersResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${project.project_id}/members`,
            {
              headers: {
                Authorization: cookies.get("accessToken"),
              },
            }
          );

          const progressResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${project.project_id}/progress`,
            {
              headers: {
                Authorization: cookies.get("accessToken"),
              },
            }
          );

          return {
            ...project,
            members: membersResponse.data,
            progress: progressResponse.data,
          };
        });

        const projectsWithAdditionalData = await Promise.all(
          projectDataPromises
        );

        setProjects(projectsWithAdditionalData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProjects();
  }, []);

  const calculateDaysUntilDeadline = (deadline: string) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 밀리초에서 일수로 변환
    return diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
  };

  return (
    <div className="flex w-full text-[#ffffff]">
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
        <div className="flex flex-row h-[calc(100%-96px)]">
          <div className="w-full h-full p-[20px] border-r border-[#465069]">
            <div className="flex gap-[30px]">
              {projects?.map((project) => {
                return (
                  <div
                    key={project.project_id}
                    className="relative w-[50%] bg-[#132147] rounded-[15px] p-[16px]"
                  >
                    <h2 className="font-bold text-[30px] flex justify-between">
                      {project.title}{" "}
                      <div className="text-[#FF8E8E]">
                        {calculateDaysUntilDeadline(project.deadline)}
                      </div>
                    </h2>
                    <div className="flex gap-[10px] items-center mb-[10px]">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-[#7FDB70] h-4 rounded-full"
                          style={{ width: `${project.progress.totalPercent}%` }}
                        ></div>
                      </div>
                      <p>{project.progress.totalPercent}%</p>
                    </div>
                    <div className="text-[20px] flex">
                      <div className="w-[50px]">팀명 </div>
                      <span className="text-[#ABF99E]">
                        {project.team_name}
                      </span>
                    </div>
                    <div className="flex ml-[50px] mb-[30px]">
                      {project.members.map((member) => (
                        <div
                          key={member.name}
                          className="flex items-center flex-row flex-wrap"
                        >
                          <div className="mr-[10px]">{member.name}</div>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              marginTop: "4px",
                            }}
                          >
                            {member.positionList.map((position, index) => {
                              return (
                                <span
                                  key={position}
                                  style={{
                                    border: "1px solid #1B37A6",
                                    color: "#fff",
                                    padding: "2px 4px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {position}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="absolute bottom-[10px] text-[15px]">
                      ~ {project.deadline}
                    </p>
                    {/* <p>Status: {project.status}</p> */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
