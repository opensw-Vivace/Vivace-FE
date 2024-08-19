import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const cookies = new Cookies();

  useEffect(() => {
    setIsMounted(true); // 컴포넌트가 클라이언트에서 마운트된 것을 표시
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/login`,
        {
          email: email,
          pw: pw,
        }
      );

      const accessToken = response.headers["authorization"];
      if (accessToken) {
        cookies.set("accessToken", accessToken); // 쿠키에 accessToken 저장
        console.log("Access Token 저장 성공:", accessToken);
        router.push("/projects");
      } else {
        console.error("Access Token이 응답에 포함되지 않았습니다.");
        alert("로그인에 실패하였습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      // 로그인 실패 시 처리 로직 작성
    }
  };

  if (!isMounted) {
    return null; // 서버에서 렌더링되는 동안 아무것도 렌더링하지 않음
  }

  return (
    <div className="h-[100vh] mx-auto flex justify-center items-center flex-col px-[20px]">
      <div className="flex text-[50px] text-white font-bold w-full justify-start items-center mb-1">
        DEV-HELPER
      </div>
      <div className="flex text-white font-bold w-full justify-center items-center">
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[44px] rounded-[4px] px-[10px] bg-gray-800 text-white"
        />
      </div>
      <div className="flex text-white font-bold w-full justify-center items-center mt-2">
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full h-[44px] rounded-[4px] px-[10px] bg-gray-800 text-white"
        />
      </div>
      <div
        className=" h-[44px] rounded-[4px] flex bg-[#284798] mt-[20px] w-full  cursor-pointer"
        onClick={handleLogin}
      >
        <div className="flex text-white font-bold w-full justify-center items-center">
          로그인
        </div>
      </div>
      <div
        className="mt-[15px] mb-[50px] text-[14px] text-[#868686] cursor-pointer"
        onClick={() => router.replace("/auth/sign-up")}
      >
        회원가입
      </div>
    </div>
  );
};

export default Login;
