import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth/login");
  }, [router]); // router 객체가 변경될 때마다 실행
  return <></>;
}
