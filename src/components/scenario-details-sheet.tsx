
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Pencil, FileText } from "lucide-react";
import { Separator } from "./ui/separator";

export type SubTask = {
    category: string;
    task: string;
    completed: boolean;
};

export type Requirement = {
    id: string;
    title: string;
    description: string;
    version: string;
    type: string;
    deliverables: string;
    source: string;
    testCases: number;
    projectName: string;
    status: string;
    subTasks: SubTask[];
};

interface ScenarioDetailsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    requirement: Requirement;
}

export function ScenarioDetailsSheet({ isOpen, onClose, requirement }: ScenarioDetailsSheetProps) {
    const groupedTasks = requirement.subTasks.reduce((acc, task) => {
        (acc[task.category] = acc[task.category] || []).push(task);
        return acc;
    }, {} as Record<string, SubTask[]>);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-[600px] p-0 flex flex-col">
                <SheetHeader className="p-6">
                    <div className="flex justify-between items-start">
                        <SheetTitle className="text-lg font-semibold">Scenario Details</SheetTitle>
                        {/* The default close button is rendered by SheetContent, so this one is removed. */}
                    </div>

                    <div className="space-y-2 text-left pt-4">
                        <div className="flex items-center gap-2">
                           <p className="font-semibold text-primary text-sm">{requirement.id}</p>
                           <Badge variant="outline">{requirement.type}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-foreground">{requirement.title}</h2>
                            <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </div>
                        <SheetDescription>{requirement.description}</SheetDescription>
                    </div>
                </SheetHeader>

                <div className="px-6 space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Project Name</span>
                        <span className="font-semibold text-foreground">{requirement.projectName}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Requirement Source</span>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{requirement.source}</span>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">WBS Deliverables</span>
                        <span className="font-semibold text-foreground max-w-[60%] truncate">{requirement.deliverables}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{requirement.status}</Badge>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="px-6 flex-1 overflow-y-auto pb-6">
                     <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">Work flow</Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">Attachments</Button>
                        <Button variant="default" size="sm">Sub Tasks</Button>
                    </div>
                    
                    <div className="space-y-6">
                        {Object.entries(groupedTasks).map(([category, tasks]) => (
                            <div key={category}>
                                <h4 className="font-semibold text-foreground mb-3">{category}</h4>
                                <div className="space-y-3">
                                    {tasks.map((subtask, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Checkbox id={`${category}-${index}`} checked={subtask.completed} className="mt-1" />
                                            <label htmlFor={`${category}-${index}`} className="text-sm text-muted-foreground">{subtask.task}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    )
}
