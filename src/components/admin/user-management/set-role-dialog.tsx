import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SetRoleDialogProps {
    onOpenChange: (v: boolean) => void
    isOpen: boolean
    role: string
    onRoleChange: (newRole: string) => void
    onDialogSubmitted: () => void
}

export const SetRoleDialog = ({ onOpenChange, isOpen, role, onRoleChange, onDialogSubmitted } : SetRoleDialogProps) => {
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
                        <SelectItem value="user">Customer</SelectItem>
                        <SelectItem value="translator">Translator</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
                <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button onClick={onDialogSubmitted}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}