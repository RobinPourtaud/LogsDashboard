import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { format } from 'date-fns';


type FilterProps = {
    handleFilterChange: (newFilter: string, type: string) => void
}

export function FilterDropdownContent({ handleFilterChange }: FilterProps) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [severity, setSeverity] = useState('');
    const [source, setSource] = useState('');

    useEffect(() => {
        const filterString = `start_date:${startDate ? format(startDate, 'yyyy-MM-dd') : ''},end_date:${endDate ? format(endDate, 'yyyy-MM-dd') : ''
            },severity:${severity},source:${source}`;
        if (startDate || endDate || severity || source) {
            handleFilterChange('filter', filterString);
        }
    }, [startDate, endDate, severity, source, handleFilterChange]);

    return (
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="date-range">Date Range</Label>
                    <div className="flex gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start font-normal">
                                    <CalendarDaysIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, 'PP') : 'Start Date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate as any}
                                    onSelect={setStartDate as any}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start font-normal">
                                    <CalendarDaysIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, 'PP') : 'End Date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate as any}
                                    onSelect={setEndDate as any}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select onValueChange={(value) => setSeverity(value)}>
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
                <div className="grid gap-2">
                    <Label htmlFor="source">Source</Label>
                    <Select onValueChange={(value) => setSource(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="app">App</SelectItem>
                            <SelectItem value="web">Web Server</SelectItem>
                            <SelectItem value="db">Data Base</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </DropdownMenuContent>
    );
}


function CalendarDaysIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M12 18h.01" />
            <path d="M16 18h.01" />
        </svg>
    )
}