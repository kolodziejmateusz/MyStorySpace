import Navbar from '@/components/layout/Navbar';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function Home() {
  return (
    <main className="mx-auto w-full xl:w-[60%]">
      <div className="absolute right-4 bottom-4">
        <ModeToggle />
      </div>
      <Navbar />
    </main>
  );
}
