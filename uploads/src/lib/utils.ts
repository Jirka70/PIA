import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { authClient } from "./auth-client"
import { ProjectFileType } from "@/db/schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function logOutSignedUser() {
  await authClient.signOut()
}


export async function performDownload(projectFile: ProjectFileType) {
      try {
        const res = await fetch(projectFile.url, {
          method: "GET",
        })  

        if (!res.ok) {
          const msg = await res.text()
          throw new Error(`Stažení selhalo (${res.status}): ${msg}`);
        }

        const blob = await res.blob();

        const filename = projectFile.fileName;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

      } catch (err) {
        // TODO doplnit
      } 
}

export async function performPreview(projectFile: ProjectFileType) {
  try {
    const res = await fetch(projectFile.url, { method: "GET" });

    if (!res.ok) {
      throw new Error(`Načtení selhalo (${res.status})`);
    }

    const blob = await res.blob();
    const fileUrl = URL.createObjectURL(blob);
    
    window.open(fileUrl, "_blank");

    // memory revoke...
    setTimeout(() => URL.revokeObjectURL(fileUrl), 10000);
  } catch (err) {
    // TODO doplnit
  }
}

export async function uploadFile(fd: FormData) {
  const res = await fetch("/api/upload/project-file", {
        method: "POST",
        body: fd
      })

      if (!res.ok) {
          throw new Error("Upload failed")
      }

      return await res.json()
}
