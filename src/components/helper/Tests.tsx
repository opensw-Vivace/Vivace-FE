import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface TestsProps {
  id: string | string[]; // Depending on your route configuration, id might be a string or an array of strings
}

const Tests = ({ id }: TestsProps) => {
  const [testData, setTestData] = useState(null);

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
        setTestData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);
  return <div></div>;
};

export default Tests;
