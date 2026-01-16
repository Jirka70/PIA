import { Header } from "@/modules/dashboard/header";
import { ReactNode } from "react";

export default function HomeLayout({ children } : { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
