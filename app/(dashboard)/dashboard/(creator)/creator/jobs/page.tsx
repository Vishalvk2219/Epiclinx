import { JobsList } from "@/components/creator/dashboard/JobList";
import Footer from "@/components/Footer";

export default function Jobs() {
  return (
    <div className="min-h-screen px-4">
      <main className="max-w-7xl mx-auto py-6">
        <JobsList />
      </main>
    </div>
  )
}
