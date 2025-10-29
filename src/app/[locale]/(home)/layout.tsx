import { Footer } from "@/modules/dashboard/footer";
import { Header } from "@/modules/dashboard/header";
import { ReactNode } from "react";

export default function HomeLayout({ children } : { children: ReactNode }) {
    return (
        <>
            <Header />
                {children}
            <Footer />
        </>
    )
}