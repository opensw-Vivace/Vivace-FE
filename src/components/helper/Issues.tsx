import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface Issue {
  id: number;
  title: string;
  name: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  created_at: string;
}

interface IssuesProps {
  id: string | string[];
}

const Issues = ({ id }: IssuesProps) => {
  const [issueData, setIssueData] = useState<Issue[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueContent, setNewIssueContent] = useState("");
  const cookies = new Cookies();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = cookies.get("accessToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/issues`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setIssueData(response.data.list);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if (typeof id === "string") {
      fetchData();
    }
  }, [id]);

  const handleCreateIssue = async () => {
    try {
      const token = cookies.get("accessToken");
      await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/issues`,
        {
          title: newIssueTitle,
          content: newIssueContent,
          project_id: id,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // Close the modal and refresh data
      setShowModal(false);
      setNewIssueTitle("");
      setNewIssueContent("");
      fetchData(); // Refresh data after posting the new issue
    } catch (error) {
      console.error("Error creating issue", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = cookies.get("accessToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/issues`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setIssueData(response.data.list);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const renderIssuesByStatus = (status: string) => {
    if (!issueData) return;
    return issueData
      .filter((issue) => issue.status === status)
      .map((issue) => (
        <div key={issue.id} className="bg-gray-800 p-4 rounded-lg mb-4">
          <h3 className="text-white font-bold">{issue.title}</h3>
          <p className="text-gray-400">By: {issue.name}</p>
          <p className="text-gray-400">Created: {issue.created_at}</p>
        </div>
      ));
  };

  return (
    <div className="flex w-full gap-4 px-[10px]">
      <div className="w-1/3">
        <div className="flex justify-between ">
          <h2 className="text-white font-bold mb-4 flex">시작 전</h2>
          <button
            className="text-white bg-blue-500 rounded-full w-4 h-4 mr-[5px] flex items-center justify-center"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>
        {renderIssuesByStatus("NOT_STARTED")}
      </div>
      <div className="w-1/3">
        <h2 className="text-white font-bold mb-4">진행 중</h2>
        {renderIssuesByStatus("IN_PROGRESS")}
      </div>
      <div className="w-1/3">
        <h2 className="text-white font-bold mb-4">완료</h2>
        {renderIssuesByStatus("COMPLETED")}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl mb-4">새 이슈 생성</h2>
            <input
              type="text"
              placeholder="제목"
              value={newIssueTitle}
              onChange={(e) => setNewIssueTitle(e.target.value)}
              className="w-full p-2 mb-4 border rounded text-[#000000]"
            />
            <textarea
              placeholder="내용"
              value={newIssueContent}
              onChange={(e) => setNewIssueContent(e.target.value)}
              className="w-full p-2 mb-4 border rounded  text-[#000000]"
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
                onClick={handleCreateIssue}
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;
