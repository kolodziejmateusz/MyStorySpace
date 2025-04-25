import Navbar from "@/components/layout/Navbar";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  return (
    <main className="w-full xl:w-[60%] mx-auto">
      <div className="absolute bottom-4 right-4">
        <ModeToggle />
      </div>
      <Navbar />
    </main>
  );
}
