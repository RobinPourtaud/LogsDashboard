import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FilterDropdownContent } from './filter';
export default function HomeControls() {
    const router = useRouter();
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('date');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!(router as any).isReady) return;
        const { filt: filterParam, sort: sortParam, search: searchParam, page: pageParam } = (router as any).query;
        setFilter(filterParam || '');
        setSort(sortParam || 'date');
        setSearch(searchParam || '');
        setPage(parseInt(pageParam) || 1);
    }, [(router as any).isReady, (router as any).query]);

    const updateURL = (newParams: any) => {
        console.log(newParams)
        const query = {
            ...(sort !== 'date' && { sort }),
            ...(search && { search }),
            ...(page > 1 && { page }),
            ...({ filt: filter }),
            ...newParams,
        };
        router.push(`?${new URLSearchParams(query).toString()}`);
    };

    const handleChange = (type: string, value: any) => {
        switch (type) {
            case 'page':
                console.log('page', value);
                setPage(value);
                updateURL({ page: value });
                break;
            case 'filter':
                setFilter(value);
                updateURL({ filt: value });
                break;
            case 'sort':
                setSort(value);
                updateURL({ sort: value, page: 1 });
                break;
            case 'search':
                setSearch(value);
                updateURL({ search: value, page: 1 });
                break;

            default:
                console.error('Unknown change type:', type);
        }
    };

    return (
        <CardHeader className="flex items-center justify-between flex-row">
            <div className="flex items-center gap-4">
                <div>
                    <CardTitle>Logs</CardTitle>
                    <CardDescription>View and manage your application logs. (Please go to the settings first to add data).</CardDescription>
                </div>
            </div>
            <div className="flex items-center gap-4 shrink-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-sm">
                            <FilterIcon className="h-4 w-4" />
                            <span>Filter</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <FilterDropdownContent handleFilterChange={handleChange} />
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-sm">
                            <ListOrderedIcon className="h-4 w-4" />
                            <span>Sort by</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={sort} onValueChange={(value) => handleChange('sort', value)}>
                            <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="source">Source</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="severity">Severity</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-2">
                    <Input
                        type="search"
                        placeholder="Search logs..."
                        className="max-w-[200px] rounded-md bg-muted px-3 py-1 text-sm"
                        value={search}
                        onChange={(e) => handleChange('search', e.target.value)}
                    />
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={() => handleChange('page', Math.max(1, page - 1))}
                                    className="cursor-pointer" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext onClick={() => handleChange('page', page + 1)} className="cursor-pointer" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </CardHeader>
    );
}

function FilterIcon(props: any) {
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
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    )
}


function ListOrderedIcon(props: any) {
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
            <line x1="10" x2="21" y1="6" y2="6" />
            <line x1="10" x2="21" y1="12" y2="12" />
            <line x1="10" x2="21" y1="18" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </svg>
    )
}
