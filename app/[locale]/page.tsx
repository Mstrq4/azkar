import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import CategoriesPage from "./components/CardHomePage";
// import CategoriesPage from "./components/CardHomePage";
export default function HomePaeg() {
  return (
    <main className="relative w-full bg-white-100 dark:bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full md:mb-5 grid justify-center">
        <Hero />
        <CategoriesPage />
      </div>
    </main>
  );
}
