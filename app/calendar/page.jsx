import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function CalendarPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Twój Kalendarz</h1>
      <p>Tutaj w przyszłości będzie edytor kalendarza.</p>
    
    <div>
    <h2> wygenerowj tlo za pomoca ai</h2>

<div className="flex w-full max-w-sm items-center gap-2">
      <Input type="email" placeholder="Email" />
      <Button type="submit" variant="outline">
        Subscribe
      </Button>
    </div>

    </div>
    
    </div>
  )
}
