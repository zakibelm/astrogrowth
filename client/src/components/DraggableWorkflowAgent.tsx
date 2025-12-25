import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, GripVertical } from "lucide-react";
import type { AgentData } from "@/../../shared/agents-data";

interface DraggableWorkflowAgentProps {
  agent: AgentData;
  index: number;
  onRemove: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

export const DraggableWorkflowAgent: React.FC<DraggableWorkflowAgentProps> = ({
  agent,
  index,
  onRemove,
  onMove,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "workflow-agent",
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "workflow-agent",
    drop: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => drag(drop(node)) as any}
      className={`transition-all ${isDragging ? "opacity-50 scale-95" : "opacity-100"} ${
        isOver ? "scale-105" : ""
      }`}
    >
      <Card className="bg-primary/5 border-primary hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Step Number */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              {index + 1}
            </div>

            {/* Agent Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{agent.emoji}</span>
                <h4 className="font-semibold text-base truncate">{agent.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {agent.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {agent.department}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {agent.model}
                </Badge>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  Rôle: {agent.role}
                </Badge>
              </div>
            </div>

            {/* Drag Handle & Remove Button */}
            <div className="flex flex-col gap-1 items-center">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
