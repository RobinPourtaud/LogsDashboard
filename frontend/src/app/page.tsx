"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LogRow from "@/components/logrow"
import AddRow from "@/components/addrow";
import HomeControls from "@/components/home/controls";
import { useSearchParams } from 'next/navigation'; // Added import statement
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";


export default function Main() {
  const searchParams = useSearchParams();
  const params = "?" + searchParams.toString() || "?page=1";
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ['logs/' + params],
    enabled: !!params,
  });

  const reloadLogs = () => {
    queryClient.invalidateQueries({ queryKey: ['logs/' + params] });
  };

  return (

    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 p-4 sm:p-6">
        <div className="grid gap-4">
          <Card>
            <HomeControls />
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Severity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Text</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading logs...</TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-red-500">Error loading logs. Please try again.</TableCell>
                    </TableRow>
                  ) : data && (data as any).length > 0 ? (
                    (data as any).map((log: any) => (
                      <LogRow key={log.id} reloadLogs={reloadLogs} logId={log.id} {...log} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center gap-3">
                        <div>No logs found</div>
                        <Link href="/settings" className="text-destructive hover:underline font-bold">Add samples here</Link>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Edit Log</Button>
                </DialogTrigger>
                <AddRow reloadLogs={reloadLogs} />
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>

  )
}
