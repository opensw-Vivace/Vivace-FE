import LeftSide from "@/components/LeftSide";
import TopBar from "@/components/TopBar";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface NecessaryType {
  typeId: number;
  typeName: string;
}

interface Artifact {
  id: number;
  title: string;
  subtitle: string;
  status: string;
  deadline: string;
  projectId: number;
  artifactTypeId: number;
  imgPathList: string[];
  artifactCreatorIdList: number[];
  memberIdList: number[];
}

interface ArtifactType {
  name: string;
  typeId: number;
  category: string;
}

const artifacts: ArtifactType[] = [
  { name: "요구사항 명세서", typeId: 1, category: "기획" },
  { name: "플로우 차트", typeId: 2, category: "기획" },
  { name: "초안", typeId: 3, category: "디자인" },
  { name: "최종디자인", typeId: 4, category: "디자인" },
  { name: "ERD 생성", typeId: 5, category: "개발" },
  { name: "API 명세서", typeId: 6, category: "개발" },
  { name: "QA", typeId: 7, category: "QA" },
];

const ProjectArtifacts = () => {
  const [necessaryTypes, setNecessaryTypes] = useState<NecessaryType[]>([]);
  const [existingArtifacts, setExistingArtifacts] = useState<Artifact[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [newArtifactTitle, setNewArtifactTitle] = useState("");
  const [newArtifactSubtitle, setNewArtifactSubtitle] = useState("");
  const [newArtifactDeadline, setNewArtifactDeadline] = useState("");
  const [newWriterIds, setNewWriterIds] = useState<number[]>([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [selectedArtifactId, setSelectedArtifactId] = useState<number | null>(null);
  const cookies = new Cookies();

  const router = useRouter();

  const { id: projectId } = router.query;

  const fetchArtifacts = async () => {
    try {
      const token = cookies.get("accessToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${projectId}/artifacts`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setExistingArtifacts(response.data);
    } catch (error) {
      console.error("Error fetching artifacts", error);
    }
  };

  useEffect(() => {
    const fetchNecessaryTypes = async () => {
      try {
        const token = cookies.get("accessToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${projectId}/necessary`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setNecessaryTypes(response.data);
      } catch (error) {
        console.error("Error fetching necessary types", error);
      }
    };

    fetchNecessaryTypes();
    fetchArtifacts(); // Fetch artifacts when the component mounts
  }, [projectId]);

  const handleCreateArtifact = async () => {
    try {
      const token = cookies.get("accessToken");
      await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/artifacts`,
        {
          title: newArtifactTitle,
          subtitle: newArtifactSubtitle,
          deadline: newArtifactDeadline,
          projectId: Number(projectId),
          artifactTypeId: selectedTypeId,
          imgPathList: ["placeholder.jpg"], // Placeholder or dummy image path
          writerIdList: newWriterIds,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // Close the modal and refresh data
      setShowModal(false);
      resetForm();
      fetchArtifacts(); // Refresh data after posting the new artifact
    } catch (error) {
      console.error("Error creating artifact", error);
    }
  };

  const handleImageUpload = async (artifactId: number) => {
    try {
      const token = cookies.get("accessToken");
      const formData = new FormData();
      selectedImageFiles.forEach((file) => {
        formData.append("image", file);
      });

      await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/s3/upload/${artifactId}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh the artifact list after upload
      fetchArtifacts();
      setSelectedImageFiles([]);
      setSelectedArtifactId(null);
    } catch (error) {
      console.error("Error uploading images", error);
    }
  };

  const resetForm = () => {
    setNewArtifactTitle("");
    setNewArtifactSubtitle("");
    setNewArtifactDeadline("");
    setNewWriterIds([]);
    setSelectedImageFiles([]);
  };

  const matchedArtifacts = necessaryTypes
    .map((type) => {
      const artifact = artifacts.find(
        (artifact) => artifact.typeId === type.typeId
      );
      return artifact ? { ...artifact, typeName: type.typeName } : null;
    })
    .filter(Boolean);

  const renderArtifacts = (artifactTypeId: number) => {
    return existingArtifacts
      .filter((artifact) => artifact.artifactTypeId === artifactTypeId)
      .map((artifact) => (
        <div
          key={artifact.id}
          className="bg-gray-800 p-4 rounded-lg mb-4 w-full"
        >
          <div className="flex justify-between mb-[10px]">
            <h3 className="text-white font-bold">{artifact.title}</h3>
            <p className="text-gray-400">{artifact.deadline}</p>
          </div>
          <p className="text-gray-400">{artifact.subtitle}</p>
          <div className="flex space-x-2 mt-[10px]">
            {artifact.imgPathList.map((imgPath, index) => (
              <img
                key={index}
                src={imgPath}
                alt={artifact.title}
                className="w-16 h-16"
              />
            ))}
          </div>
          <button
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setSelectedArtifactId(artifact.id);
              setShowModal(true);
            }}
          >
            이미지 업로드
          </button>
        </div>
      ));
  };

  return (
    <div className="flex w-full">
      <LeftSide />
      <div className="flex flex-col w-full text-[#ffffff]">
        <TopBar />
        <div className="flex flex-col w-full gap-4 px-[30px]">
          {matchedArtifacts.map((artifact) => (
            <div
              key={artifact?.typeId}
              className="flex justify-between gap-[50px] items-center"
            >
              <div className="w-full">
                <h3 className="text-white font-bold mb-[10px]">
                 [{artifact?.category}] {artifact?.name}
                </h3>
                {renderArtifacts(artifact?.typeId!)}
              </div>
              <button
                className="text-white bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center"
                onClick={() => {
                  setSelectedTypeId(artifact?.typeId!);
                  setShowModal(true);
                }}
              >
                +
              </button>
            </div>
          ))}
          {showModal && selectedArtifactId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg">
                <h2 className="text-2xl mb-4">이미지 업로드</h2>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setSelectedImageFiles(
                      e.target.files ? Array.from(e.target.files) : []
                    )
                  }
                  className="w-full p-2 mb-4 border rounded text-[#000000]"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-[#FF8E8E] text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedArtifactId(null);
                    }}
                  >
                    취소
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleImageUpload(selectedArtifactId)}
                  >
                    업로드
                  </button>
                </div>
              </div>
            </div>
          )}
          {showModal && !selectedArtifactId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg">
                <h2 className="text-2xl mb-4">새 아티팩트 생성</h2>
                <input
                  type="text"
                  placeholder="제목"
                  value={newArtifactTitle}
                  onChange={(e) => setNewArtifactTitle(e.target.value)}
                  className="w-full p-2 mb-4 border rounded text-[#000000]"
                />
                <input
                  type="text"
                  placeholder="부제목"
                  value={newArtifactSubtitle}
                  onChange={(e) => setNewArtifactSubtitle(e.target.value)}
                  className="w-full p-2 mb-4 border rounded text-[#000000]"
                />
                <input
                  type="date"
                  placeholder="마감일"
                  value={newArtifactDeadline}
                  onChange={(e) => setNewArtifactDeadline(e.target.value)}
                  className="w-full p-2 mb-4 border rounded text-[#000000]"
                />
                <textarea
                  placeholder="작성자 ID들 (쉼표로 구분)"
                  value={newWriterIds.join(",")}
                  onChange={(e) =>
                    setNewWriterIds(e.target.value.split(",").map(Number))
                  }
                  className="w-full p-2 mb-4 border rounded text-[#000000]"
                ></textarea>
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-[#FF8E8E] text-white px-4 py-2 rounded"
                    onClick={() => setShowModal(false)}
                  >
                    취소
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleCreateArtifact}
                  >
                    생성
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ProjectArtifacts;
