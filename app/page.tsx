import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import HomePaeg from "./[locale]/page";

export default function Home() {
  return (
    <main className="relative bg-white-100 dark:bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <HomePaeg />
      </div>
    </main>
  );
}
