"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Download } from "lucide-react"

export function FilesSection({
  hasSourceFile,
  hasTranslatedFile,
  onViewSource,
  onDownloadSource,
  onViewTranslated,
  onDownloadTranslated,
  isSourceLoading,
  isTranslatedLoading,
}: {
  hasSourceFile: boolean
  hasTranslatedFile: boolean
  onViewSource: () => void
  onDownloadSource: () => void
  onViewTranslated: () => void
  onDownloadTranslated: () => void
  isSourceLoading?: boolean
  isTranslatedLoading?: boolean
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">Project Files</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FileCard
          title="Source File"
          iconClass="text-blue-500"
          hasFile={hasSourceFile}
          onView={onViewSource}
          onDownload={onDownloadSource}
          isLoading={isSourceLoading}
        />

        <FileCard
          title="Translated File"
          iconClass="text-green-500"
          hasFile={hasTranslatedFile}
          onView={onViewTranslated}
          onDownload={onDownloadTranslated}
          isLoading={isTranslatedLoading}
          emptyText="Not uploaded yet"
        />
      </div>
    </div>
  )
}

function FileCard({
  title,
  iconClass,
  hasFile,
  onView,
  onDownload,
  isLoading,
  emptyText = "No file uploaded",
}: {
  title: string
  iconClass: string
  hasFile: boolean
  onView: () => void
  onDownload: () => void
  isLoading?: boolean
  emptyText?: string
}) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <FileText className={`h-5 w-5 ${iconClass}`} />
          <span className="font-medium">{title}</span>
        </div>
        {hasFile ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={onView}
              disabled={isLoading}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={onDownload}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  )
}
