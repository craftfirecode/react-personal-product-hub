import {Link} from "react-router";
import {Button} from "@/components/ui/button.tsx";
import {ArrowRight} from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Personal Product Hub
            </h1>
            <div className="flex gap-4">
                <Button variant="outline">
                    <Link to="/login">
                        <div className="flex items-center justify-center">
                            Login <ArrowRight className="ml-2 h-5 w-5"/>
                        </div>
                    </Link>
                </Button>
            </div>
        </div>
    );
}