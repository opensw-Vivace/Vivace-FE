import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface Todo {
  id: number;
  title: string;
  description: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  created_at: string;
}

interface TodosProps {
  id: string | string[];
}

const Todos = ({ id }: TodosProps) => {
  const [todoData, setTodoData] = useState<Todo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoContent, setNewTodoContent] = useState("");
  const cookies = new Cookies();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = cookies.get("accessToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/todos`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setTodoData(response.data.todolist);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if (typeof id === "string") {
      fetchData();
    }
  }, [id]);

  const handleCreateTodo = async () => {
    try {
      const token = cookies.get("accessToken");
      await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/todos`,
        {
          title: newTodoTitle,
          content: newTodoContent,
          status: "NOT_STARTED",
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
      setNewTodoTitle("");
      setNewTodoContent("");
      fetchData(); // Refresh data after posting the new todo
    } catch (error) {
      console.error("Error creating todo", error);
    }
  };

  const fetchData = async () => {
    try {
      const token = cookies.get("accessToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/todos`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setTodoData(response.data.todolist);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const renderTodosByStatus = (status: string) => {
    if (!todoData) return;
    return todoData
      .filter((todo) => todo.status === status)
      .map((todo) => (
        <div key={todo.id} className="bg-gray-800 p-4 rounded-lg mb-4">
          <h3 className="text-white font-bold">{todo.title}</h3>
          <p className="text-gray-400">Created: {todo.created_at}</p>
          <p className="text-gray-400">{todo.description}</p>
        </div>
      ));
  };

  return (
    <div className="flex w-full gap-4 px-[10px]">
      <div className="w-1/3">
        <div className="flex justify-between">
          <h2 className="text-white font-bold mb-4">시작 전</h2>
          <button
            className="text-white bg-blue-500 rounded-full w-4 h-4 mr-[5px] flex items-center justify-center"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>
        {renderTodosByStatus("NOT_STARTED")}
      </div>
      <div className="w-1/3">
        <h2 className="text-white font-bold mb-4">진행 중</h2>
        {renderTodosByStatus("IN_PROGRESS")}
      </div>
      <div className="w-1/3">
        <h2 className="text-white font-bold mb-4">완료</h2>
        {renderTodosByStatus("COMPLETED")}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl mb-4">새 할 일 생성</h2>
            <input
              type="text"
              placeholder="제목"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="w-full p-2 mb-4 border rounded text-[#000000]"
            />
            <textarea
              placeholder="내용"
              value={newTodoContent}
              onChange={(e) => setNewTodoContent(e.target.value)}
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
                onClick={handleCreateTodo}
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

export default Todos;
