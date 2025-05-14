import { ModeToggle } from '@/components/shadcn-ui/mode-toggle';

export default function Home() {
  return (
    <main>
      <div className="absolute right-4 bottom-4">
        <ModeToggle />
      </div>
    </main>
  );
}
