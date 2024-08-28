import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface Test {
  id: number;
  title: string;
  name: string;
  created_at: string;
}
interface TestsProps {
  id: string | string[];
}

const Tests = ({ id }: TestsProps) => {
  const [notStartedTests, setNotStartedTests] = useState<Test[]>([]);
  const [completedTests, setCompletedTests] = useState<Test[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTestTitle, setNewTestTitle] = useState("");
  const [newTestContent, setNewTestContent] = useState("");
  const cookies = new Cookies();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = cookies.get("accessToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/tests`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setNotStartedTests(response.data.notStartedTestList);
        setCompletedTests(response.data.completedTestList);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if (typeof id === "string") {
      fetchData();
    }
  }, [id]);

  const handleCreateTest = async () => {
    try {
      const token = cookies.get("accessToken");
      await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/tests`,
        {
          title: newTestTitle,
          content: newTestContent,
          status: "NOT_STARTED",
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // Close the modal and refresh data
      setShowModal(false);
      setNewTestTitle("");
      setNewTestContent("");
      fetchData(); // Refresh data after posting the new test
    } catch (error) {
      console.error("Error creating test", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = cookies.get("accessToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/tests`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setNotStartedTests(response.data.notStartedTestList);
      setCompletedTests(response.data.completedTestList);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderTests = (tests: Test[]) => {
    if (!tests) return;
    return tests.map((test) => (
      <div key={test.id} className="relative bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-white font-bold mb-[30px]">{test.title}</h3>
        <p className="text-gray-400 text-[15px] absolute  top-4 right-4">
          {formatDate(test.created_at)}
        </p>
        <p className="text-gray-400 absolute bottom-4">{test.name}</p>
      </div>
    ));
  };

  return (
    <div className="flex w-full gap-4 px-[10px]">
      <div className="w-1/2">
        <div className="flex justify-between">
          <h2 className="text-white font-bold mb-4">테스트 중</h2>
          <button
            className="text-white bg-blue-500 rounded-full w-4 h-4 mr-[5px] flex items-center justify-center"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>
        {renderTests(notStartedTests)}
      </div>

      <div className="w-1/2">
        <h2 className="text-white font-bold mb-4">테스트 통과</h2>
        {renderTests(completedTests)}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl mb-4">새 테스트 생성</h2>
            <input
              type="text"
              placeholder="제목"
              value={newTestTitle}
              onChange={(e) => setNewTestTitle(e.target.value)}
              className="w-full p-2 mb-4 border rounded text-[#000000]"
            />
            <textarea
              placeholder="내용"
              value={newTestContent}
              onChange={(e) => setNewTestContent(e.target.value)}
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
                onClick={handleCreateTest}
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

export default Tests;
