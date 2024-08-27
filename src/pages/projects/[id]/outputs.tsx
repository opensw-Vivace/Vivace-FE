import { useRouter } from "next/router";
import React, { useState } from "react";
import CreateBar from "../../../components/projects/CreateBar";
import Checkbox from "@/components/projects/Checkbox";

interface Artifact {
  name: string;
  typeId: number;
  category: string;
}

const artifacts: Artifact[] = [
  { name: "요구사항 명세서", typeId: 1, category: "기획" },
  { name: "플로우 차트", typeId: 2, category: "기획" },
  { name: "초안", typeId: 3, category: "디자인" },
  { name: "최종디자인", typeId: 4, category: "디자인" },
  { name: "ERD 생성", typeId: 5, category: "개발" },
  { name: "API 명세서", typeId: 6, category: "개발" },
  { name: "QA", typeId: 7, category: "QA" },
];

const Index = () => {
  const router = useRouter();
  const [selectedArtifacts, setSelectedArtifacts] = useState<Artifact[]>([]);

  const handleArtifactChange = (artifact: Artifact, checked: boolean) => {
    setSelectedArtifacts((prev) => {
      if (checked) {
        return [...prev, artifact];
      } else {
        return prev.filter((a) => a.typeId !== artifact.typeId);
      }
    });
  };

  return (
    <div className="flex h-[100vh] w-full text-[#ffffff]">
      <CreateBar />
      <div className="w-full h-full">
        <div className="flex h-[calc(100%-96px)] flex-row mt-[96px] border-t border-[#465069]">
          <div className="w-[300px] border-r border-[#465069]">
            {artifacts.map((artifact) => (
              <Checkbox
                key={artifact.typeId}
                artifact={artifact}
                onChange={handleArtifactChange}
              />
            ))}
          </div>
          <div className="w-full h-full px-[16px] py-[16px] text-[18px]">
            {selectedArtifacts.map((artifact) => (
              <div key={artifact.typeId} style={{ margin: "10px 0" }}>
                {artifact.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
