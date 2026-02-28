import { Bot } from "lucide-react"

export const Thinking = () => {
    return (
        <div className="flex justify-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                    <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0.1s" }}
                    />
                    <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                                style={{ animationDelay: "0.2s" }}
                    />
                </div>
            </div>
        </div>
    )
}
