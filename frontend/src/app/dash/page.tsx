"use client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useMutation } from "@tanstack/react-query"
import axios from 'axios'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartConfig = {
    warning: {
        label: "Warning",
        color: "orange"
    },
    error: {
        label: "Error",
        color: "red"
    },
    info: {
        label: "Info",
        color: "blue"
    }
} satisfies ChartConfig
export default function Dash() {
    const [chartData, setChartData] = useState(null);
    const [formData, setFormData] = useState({
        start_date: '1000-01-01',
        end_date: Date.now(),
        severity: 'all',
        source: 'all',
        group_by: 'month'
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            console.log(data)
            const response = await axios.post('http://localhost:8000/logs/aggregate', data);
            return response.data;
        },
        onSuccess: (data) => {
            setChartData(data);
        }
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        mutation.mutate(formData as any);
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 p-4 sm:p-6">
                <div className="grid gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Filters</CardTitle>
                                <CardDescription>Select filters to view log data.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full flex flex-col gap-2">
                                    <DateRangePicker
                                        label="From"
                                        value={formData.start_date}
                                        onChange={(date: any) => handleInputChange('start_date', date)}
                                    />
                                    <DateRangePicker
                                        label="To"
                                        value={formData.end_date}
                                        onChange={(date: any) => handleInputChange('end_date', date)}
                                    />
                                    <SelectField
                                        label="Severity"
                                        value={formData.severity}
                                        onChange={(value: any) => handleInputChange('severity', value)}
                                        options={[
                                            { value: 'all', label: 'All' },
                                            { value: 'error', label: 'Error' },
                                            { value: 'warning', label: 'Warning' },
                                            { value: 'info', label: 'Info' }
                                        ]}
                                    />
                                    <SelectField
                                        label="Source"
                                        value={formData.source}
                                        onChange={(value: any) => handleInputChange('source', value)}
                                        options={[
                                            { value: 'all', label: 'All' },
                                            { value: 'api-server', label: 'API Server' },
                                            { value: 'web-server', label: 'Web Server' },
                                            { value: 'auth-service', label: 'Auth Service' }
                                        ]}
                                    />
                                    <SelectField
                                        label="Group By"
                                        value={formData.group_by}

                                        onChange={(value: any) => handleInputChange('group_by', value)}
                                        options={[
                                            { value: 'full_date', label: 'Day' },
                                            { value: 'month', label: 'Month' },
                                            { value: 'year', label: 'Year' },
                                        ]}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSubmit}>Apply Filters</Button>
                            </CardFooter>
                        </Card>
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Log Trends</CardTitle>
                                <CardDescription>View log count trends over time for the selected filters.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LineChartComp data={chartData} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
import { format } from 'date-fns';

function DateRangePicker({ label, value, onChange }: any) {
    const date = typeof value === 'number' ? new Date(value) : value;

    // Format the date for display
    const formattedDate = date ? format(date, 'PPP') : 'Select date';

    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`date-${label.toLowerCase()}`} className="text-right">
                {label}
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id={`date-${label.toLowerCase()}`}
                        variant="outline"
                        className="col-span-3 justify-start text-left font-normal"
                    >

                        {formattedDate}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={onChange}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

function SelectField({ label, value, onChange, options }: any) {
    return (
        <div className="grid grid-cols-4 items-center gap-4 w-full">
            <Label htmlFor={label.toLowerCase()} className="text-right">
                {label}
            </Label>
            <Select value={value} onValueChange={onChange} >
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option: any) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}




function LineChartComp({ data }: any) {
    if (!data) {
        return <div>Please select a filter</div>
    }
    if (data.length === 0) {
        return <div>No data available</div>
    }
    console.log(data)
    return (
        <div className="aspect-[4/3]">

            <ChartContainer config={chartConfig}>
                <BarChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        left: 1,
                        right: 1,
                    }}
                >
                    <CartesianGrid vertical={true} />

                    <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                    <Bar
                        dataKey="info"
                        type="monotone"
                        fill="var(--color-info)"
                        stackId='a'


                    />
                    <Bar
                        dataKey="error"
                        type="monotone"
                        fill="var(--color-error)"
                        stackId='a'


                    />
                    <Bar
                        dataKey="warning"
                        stackId='a'
                        fill="var(--color-warning)"


                    />
                    <YAxis />
                    <XAxis dataKey="period" fontSize={12} />
                </BarChart>
            </ChartContainer>
        </div>
    )
}

