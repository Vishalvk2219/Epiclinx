import { SingleJob } from "@/components/creator/dashboard/ApplyForJob/SingleJob";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";


export default function Home() {
    return (
        <>
            <main className="py-3 px-4">
                <div className="max-w-7xl mx-auto w-full">
                    <SingleJob />
                </div>
            </main>
            <Newsletter />
        </>
    )
}
