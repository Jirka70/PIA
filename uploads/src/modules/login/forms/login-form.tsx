"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { signIn } from "@/server/users"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { googleSignIn } from "@/lib/auth/google-sign-in"

export function LoginForm() {
  const t = useTranslations("auth.login")

  const formSchema = useMemo(
    () =>
      z.object({
        email: z.email(t("validation.emailInvalid")),
        password: z.string().min(8, t("validation.passwordMin"))
      }),
    [t]
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const { success, message } = await signIn(values.email, values.password)
      if (success) {
        toast.success(message as string)
        router.replace("/")
      } else {
        toast.error(message as string)
      }
    } catch {
      toast.error(t("toasts.genericError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Logo and Header */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-accent-foreground rounded-sm transform rotate-45"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full"></div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-balance">{t("header.title")}</h1>
          <p className="text-muted-foreground text-balance">{t("header.subtitle")}</p>
        </div>
      </div>

      {/* Login Card */}
      <Card className="border-0 shadow-2xl shadow-black/5">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-xl font-semibold">{t("card.title")}</CardTitle>
          <CardDescription>{t("card.description")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.email.label")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type="email"
                            placeholder={t("fields.email.placeholder")}
                            className="pl-10 h-11"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel htmlFor="password" className="text-sm font-medium">
                          {t("fields.password.label")}
                        </FormLabel>
                      </div>

                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("fields.password.placeholder")}
                            className="pl-10 pr-10 h-11"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full h-11 font-medium group" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {t("actions.signingIn")}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {t("actions.signIn")}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t("divider.orContinueWith")}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button type="button" variant="outline" className="h-11 bg-transparent" onClick={async () => { await googleSignIn() }}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t("providers.google")}
            </Button>


          </div>
          <div className="space-y-2">
            <div className="text-center text-sm text-muted-foreground">
              {t("footer.noAccount")}
              <Link href="/sign-up" className="text-accent">
                {t("footer.signUp")}
              </Link>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {t("footer.translatorCta")}
              <Link href="/translator-sign-up" className="text-accent">
                {t("footer.translator-sign-up")}
              </Link>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  )
}
