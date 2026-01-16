import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface StatsProps {
    title: string
    value: string | number,
    changeType: "positive" | "negative",
    change: number | string,
    description: string,
    icon: LucideIcon
}

export const StatsCard = ({ title, value, changeType, change, description, icon: Icon } : StatsProps) => {
    return (
        <Card
            className="bg-card/50 backdrop-blur-md border-border/50 transition-all hover:shadow-lg hover:bg-card/70"
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center gap-2 text-xs">
                    <span
                    className={
                        changeType === "positive"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                    >
                    {change}
                    </span>
                    <span className="text-muted-foreground">{description}</span>
                </div>
            </CardContent>
        </Card>
    )
}

const ShimmerBar = ({ className }: { className?: string }) => (
    <div className={cn("relative overflow-hidden rounded-md bg-accent/40", className)}>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/70 to-transparent animate-[shimmer_1.4s_linear_infinite]" />
    </div>
)

export const StatsCardSkeleton = () => {
    return (
        <Card className="bg-card/50 backdrop-blur-md border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <ShimmerBar className="h-4 w-24" />
                <ShimmerBar className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-3">
                <ShimmerBar className="h-8 w-28" />
                <div className="flex items-center gap-2">
                    <ShimmerBar className="h-4 w-16" />
                    <ShimmerBar className="h-4 w-32" />
                </div>
            </CardContent>
        </Card>
    )
}
