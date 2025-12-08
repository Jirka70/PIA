// components/reviews/ReviewForm.tsx
"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Building2, CheckCircle2 } from "lucide-react"
import { CompanyFormData, ReviewFormData, TranslatorFormData } from "@/lib/validators/review-schemas"
import { TranslatorReview } from "./translator-review"
import { CompanyReview } from "./company-review"
import { ProjectType } from "@/db/schema"



interface ReviewFormProps {
  onTranslatorReviewSubmit: (data: TranslatorFormData) => Promise<void>
  onCompanyReviewSubmit: (data: CompanyFormData) => Promise<void>
  onCancel: () => Promise<void>,

  translator: boolean
  company: boolean
  
}

export function ReviewForm({ onTranslatorReviewSubmit, onCompanyReviewSubmit, onCancel, translator, company }: ReviewFormProps) {
  const [activeTab, setActiveTab] = useState<"translator" | "company">("translator")


  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "translator" | "company")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="translator" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Překladatel</span>
            <span className="sm:hidden">Překlad.</span>
            {translator && <CheckCircle2 className="h-3 w-3 text-green-600" />}
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span>Firma</span>
            {company && <CheckCircle2 className="h-3 w-3 text-green-600" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="translator" className="mt-4">
          <TranslatorReview
            onSubmit={onTranslatorReviewSubmit}
            onCancel={onCancel}
            isSubmitted={translator}
          />
        </TabsContent>

        <TabsContent value="company" className="mt-4">
          <CompanyReview
            onSubmit={onCompanyReviewSubmit}
            onCancel={onCancel}
            isSubmitted={company}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
