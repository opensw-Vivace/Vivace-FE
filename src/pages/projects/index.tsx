import LeftSide from "@/components/projects/LeftSide";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface Project {
  id: string;
  title: string;
  description: string;
  deadline: string;
}

const Index = () => {
  const router = useRouter();
  const cookies = new Cookies();

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects`,
          {
            headers: {
              Authorization: cookies.get("accessToken"), // Assuming the token is stored in cookies
            },
          }
        );

        setProjects(response.data); // Assuming `list` contains the project data
      } catch (err) {
        console.log(err);
      }
    };

    fetchProjects();
  }, []);
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
        <div className="flex flex-row h-[calc(100%-96px)]">
          <div className="w-[400px] h-full border-r border-[#465069]">
            <ul>
              {projects?.map((project) => (
                <li key={project.id}>
                  <h2>{project.title}</h2>
                  <p>Deadline: {project.deadline}</p>
                </li>
              ))}
            </ul>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
