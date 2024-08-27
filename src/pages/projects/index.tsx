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
  email: string;
  name: string;
  memberId: number;
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
                    className="w-[50%] bg-[#1B37A6] rounded-[15px] p-[16px]"
                  >
                    <h2 className="font-bold text-[30px]">{project.title}</h2>
                    <p>{project.progress.totalPercent}</p>
                    <p>Deadline: {project.deadline}</p>
                    <p>Status: {project.status}</p>
                    <p>Team: {project.team_name}</p>

                    {/* Members 데이터 표시 */}
                    <div>
                      <h3>Team Members:</h3>
                      <div>
                        {project.members.map((member) => (
                          <div key={member.memberId}>{member.name}</div>
                        ))}
                      </div>
                    </div>
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
