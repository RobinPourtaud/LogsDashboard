import { useState } from 'react'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import axios from 'axios'
import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
const addLog = async (logData: any) => {
    const response = await axios.post('http://localhost:8000/logs', logData)
    return response.data
}
const editRow = async (logData: any) => {
    console.log(logData)
    const response = await axios.put(`http://localhost:8000/logs/${logData.logId}`, logData)
    return response.data
}

type AddRowProps = {
    reloadLogs: () => void
    logId?: number
    severity?: string
    timestamp?: string
    message?: string
    source?: string
}
export default function AddRow({ reloadLogs, logId, severity, timestamp, message, source }: AddRowProps) {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        severity: 'error',
        timestamp: new Date().toISOString().slice(0, 16),
        message: '',
        source: ''
    })
    const mutFn = logId ? editRow : addLog
    useEffect(() => {
        if (logId) {
            const correctTimestamp = timestamp?.slice(0, 16)
            setFormData({ severity, timestamp: correctTimestamp, message, source } as any)
        }
    }, [logId, severity, timestamp, message, source])


    const mutation = useMutation({
        mutationFn: mutFn,
        onSuccess: () => {
            // Handle success (e.g., close dialog, show success message)
            console.log('Log added successfully')
            toast({
                title: 'Log added',
                description: 'The log entry was added successfully.',

            })
            reloadLogs()
        }

    })

    const handleInputChange = (e: any) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, severity: value }))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (!logId) {
            mutation.mutate(formData)
        }
        else {
            mutation.mutate({ ...formData, logId })
        }
    }

    return (
        <>
            <DialogContent className="sm:max-w-[425px] bg-primary-foreground">
                {
                    logId && <DialogHeader>
                        <DialogTitle>Edit Log</DialogTitle>
                        <DialogDescription>Update the log entry.</DialogDescription>
                    </DialogHeader>
                }
                {!logId &&
                    <DialogHeader>
                        <DialogTitle>Add New Log</DialogTitle>
                        <DialogDescription>Fill out the form to add a new log entry.</DialogDescription>
                    </DialogHeader>
                }
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="severity" className="text-right">
                                Severity
                            </Label>
                            <Select value={formData.severity} onValueChange={handleSelectChange} >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="error">Error</SelectItem>
                                    <SelectItem value="warning">Warning</SelectItem>
                                    <SelectItem value="info">Info</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="timestamp" className="text-right">
                                Date
                            </Label>
                            <Input
                                id="timestamp"
                                type="datetime-local"
                                value={formData.timestamp}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="message" className="text-right">
                                Text
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Enter log text"
                                value={formData.message}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="source" className="text-right">
                                Source
                            </Label>
                            <Input
                                id="source"
                                placeholder="Enter source"
                                value={formData.source}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" disabled={(mutation as any).isLoading}>
                                {(mutation as any).isLoading ? 'Saving...' : 'Save Log'}
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
                {mutation.isError && (
                    <div className="text-red-500 mt-2">
                        An error occurred: {mutation.error.message}
                    </div>
                )}
            </DialogContent>
        </>

    )
}