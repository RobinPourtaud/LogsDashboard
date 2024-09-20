"use client";

import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { TableRow, TableCell } from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

type LogRowProps = {
    severity: string
    timestamp: string
    message: string
    source: string
    logId: number
    reloadLogs: () => void
}

export default function LogRow({
    severity,
    timestamp,
    message,
    source,
    logId,
    reloadLogs
}: LogRowProps) {
    const color = severity === 'error' ? 'red' : severity === 'warning' ? 'orange' : 'blue'
    const cleanDate = new Date(timestamp).toDateString()
    return (
        <TableRow>
            <TableCell>
                <Badge variant="secondary" style={{ backgroundColor: color }}
                    className="text-secondary rounded-lg px-2 py-1 text-md capitalize"
                >{severity}</Badge>
            </TableCell>
            <TableCell>{cleanDate}</TableCell>
            <TableCell>{message}</TableCell>
            <TableCell>{source}</TableCell>
            <TableCell>

                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger >
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Add Log
                                </DropdownMenuItem>
                            </DialogTrigger>

                            <AddRow {...{ severity, timestamp: cleanDate, message, logId, source, reloadLogs }} />
                        </Dialog>
                        <DropdownMenuItem onClick={() => deleteLog({ logId: logId, reloadLogs })}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>

                </DropdownMenu>

            </TableCell>
        </TableRow>
    )
}


import axios from 'axios'
import AddRow from "./addrow";
import { Dialog, DialogTrigger } from "./ui/dialog";




async function deleteLog({ logId, reloadLogs }: { logId: number, reloadLogs: () => void }) {
    console.log('delete')
    const response = await axios.delete(`http://localhost:8000/logs/${logId}`)
    reloadLogs()
    return response.data
}
