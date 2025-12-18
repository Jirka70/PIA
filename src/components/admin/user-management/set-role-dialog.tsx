import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface SetRoleDialogProps {
    onOpenChange: (v: boolean) => void
    isOpen: boolean
    role: string
    userId: string
    onRoleChange: (newRole: string) => void
    onDialogSubmitted: (userId: string, role: string) => Promise<void>
}

export const SetRoleDialog = ({ onOpenChange, isOpen, role, userId, onRoleChange, onDialogSubmitted } : SetRoleDialogProps) => {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const onSubmit = async () => {
        setIsSubmitting(true)
        await onDialogSubmitted(userId, role)
        onOpenChange(false);
        setIsSubmitting(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Change User Role</DialogTitle>
                <DialogDescription>Update the role for TODO fill user-name</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="role">New Role</Label>
                    <Select value={role} onValueChange={onRoleChange}>
                    <SelectTrigger id="role">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="translator">Translator</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
                <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button onClick={async () => { await onSubmit() }} disabled={isSubmitting}>
                    <span>
                        {isSubmitting 
                            ? "Applying changes..."
                            : "Save changes"}
                    </span>
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}