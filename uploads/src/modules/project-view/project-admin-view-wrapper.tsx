interface ProjectAdminWrapperProps {
    children: React.ReactNode,
    title: string,
    description: string
}

export const ProjectAdminViewWrapper = ({ children, title, description } : ProjectAdminWrapperProps) => {
    return (
        <main className="min-h-screen p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                    </div>
                    
                    {children}
                </div>
            </main>
    )
}