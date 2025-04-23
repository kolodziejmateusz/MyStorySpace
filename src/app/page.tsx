import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  return (
    <main>
      <div className="m-4">
        <ModeToggle></ModeToggle>
      </div>

      <Button className="m-4">Button</Button>
      <Button variant="secondary" className="m-4">
        Secondary
      </Button>
      <Button variant="destructive" className="m-4">
        Destructive
      </Button>
    </main>
  );
}
