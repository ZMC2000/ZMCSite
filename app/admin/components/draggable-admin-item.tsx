"use client";

import type { ReactNode } from "react";
import { GripVertical } from "lucide-react";

const dragDataType = "text/x-zmc-admin-index";

export default function DraggableAdminItem({
  index,
  onMove,
  children,
  className = "",
  disabled = false,
}: {
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={className}
      onDragOver={(event) => {
        if (disabled) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        if (disabled) return;
        event.preventDefault();
        const fromIndex = Number(event.dataTransfer.getData(dragDataType));
        if (Number.isInteger(fromIndex)) onMove(fromIndex, index);
      }}
    >
      {!disabled ? (
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            draggable
            title="Drag to reorder"
            aria-label={`Drag item ${index + 1} to reorder`}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData(dragDataType, String(index));
            }}
            className="flex h-8 cursor-grab items-center gap-1 rounded-full border border-gray-200 bg-white px-3 text-xs font-bold text-gray-500 shadow-sm transition hover:border-main-100 hover:text-main-100 active:cursor-grabbing"
          >
            <GripVertical size={15} />
            Drag
          </button>
        </div>
      ) : null}
      {children}
    </div>
  );
}
