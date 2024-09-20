'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query";

export default function DatabaseActions() {
    const { toast } = useToast()
    const [isPopulating, setIsPopulating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const populateMutation = useMutation({
        mutationFn: () => fetch('http://localhost:8000/populate_logs', { method: 'POST' }),
        onSuccess: () => {
            setIsPopulating(false)
            toast({
                title: "Database Populated",
                description: "The database has been successfully populated with sample data.",
            })
        },
        onError: (error) => {
            setIsPopulating(false)
            toast({
                title: "Error",
                description: "Failed to populate the database. Please try again.",
                variant: "destructive",
            })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: () => fetch('http://localhost:8000/logs?force=true', { method: 'DELETE' }),
        onSuccess: () => {
            setIsDeleting(false)
            toast({
                title: "Logs Deleted",
                description: "All log records have been successfully deleted.",
            })
        },
        onError: (error) => {
            setIsDeleting(false)
            toast({
                title: "Error",
                description: "Failed to delete logs. Please try again.",
                variant: "destructive",
            })
        }
    })

    const handlePopulateDatabase = () => {
        setIsPopulating(true)
        populateMutation.mutate()
    }

    const handleDeleteLogs = () => {
        setIsDeleting(true)
        deleteMutation.mutate()
    }

    return (
        <div className="mt-36 flex flex-col items-center justify-center space-y-4 p-4">
            <h1 className="text-2xl font-bold mb-4">Database Actions</h1>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                    onClick={handlePopulateDatabase}
                    disabled={isPopulating || isDeleting}
                    aria-busy={isPopulating}
                >
                    {isPopulating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Populating...
                        </>
                    ) : (
                        'Populate Database with 10000 records'
                    )}
                </Button>
                <Button
                    onClick={handleDeleteLogs}
                    variant="destructive"
                    disabled={isPopulating || isDeleting}
                    aria-busy={isDeleting}
                >
                    {isDeleting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        'Delete All Log Records'
                    )}
                </Button>
            </div>
        </div>
    )
}