import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // 컴포넌트가 클라이언트에서 마운트된 것을 표시
  }, []);

  const handleSignUp = async () => {
    if (pw !== confirmPw) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("https://api.devhelp.p-e.kr/signup", {
        email: email,
        name: name,
        pw: pw,
        confirmPw: confirmPw,
      });
      console.log(response.data); // 회원가입 성공 시 응답 처리
      // 필요한 경우 추가 로직을 여기에 작성합니다.
    } catch (error) {
      console.error("회원가입 실패:", error);
      // 회원가입 실패 시 처리 로직 작성
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
          type="text"
          placeholder="이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      <div className="flex text-white font-bold w-full justify-center items-center mt-2">
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          className="w-full h-[44px] rounded-[4px] px-[10px] bg-gray-800 text-white"
        />
      </div>
      <div
        className=" h-[44px] rounded-[4px] flex bg-[#284798] mt-[20px] w-full cursor-pointer"
        onClick={handleSignUp}
      >
        <div className="flex text-white font-bold w-full justify-center items-center">
          회원가입
        </div>
      </div>
      <div
        className="mt-[15px] mb-[50px] text-[14px] text-[#868686] cursor-pointer"
        onClick={() => router.replace("/auth/login")}
      >
        로그인
      </div>
    </div>
  );
};

export default SignUp;
