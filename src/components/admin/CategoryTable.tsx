"use client";

import Link from "next/link";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmActionButton } from "@/components/admin/ConfirmActionButton";
import { Button } from "@/components/ui/button";
import { deleteCategory, reorderCategories } from "@/lib/actions/admin/categories";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number | null;
  product_count: number;
};

function SortableRow({
  category,
}: {
  category: CategoryRow;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-t hover:bg-muted/40">
      <td className="px-3 py-3">
        <button type="button" className="cursor-grab text-muted-foreground" {...attributes} {...listeners}>
          <GripVertical className="size-4" />
        </button>
      </td>
      <td className="px-3 py-3">
        {category.image_url ? (
          <img src={category.image_url} alt={category.name} className="size-12 rounded object-cover" />
        ) : (
          <div className="size-12 rounded bg-muted" />
        )}
      </td>
      <td className="px-3 py-3 font-medium">{category.name}</td>
      <td className="px-3 py-3 text-muted-foreground">{category.slug}</td>
      <td className="px-3 py-3">{category.product_count}</td>
      <td className="px-3 py-3">{category.sort_order ?? 0}</td>
      <td className="px-3 py-3">
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/admin/categories/${category.id}/edit`}>Edit</Link>
          </Button>
          <ConfirmActionButton
            label="Delete"
            message={
              category.product_count > 0
                ? `This category has ${category.product_count} products. They will be uncategorized. Continue?`
                : "Delete this category?"
            }
            action={deleteCategory}
            values={{ id: category.id }}
            variant="destructive"
          />
        </div>
      </td>
    </tr>
  );
}

export function CategoryTable({ categories }: { categories: CategoryRow[] }) {
  const [rows, setRows] = useState(categories);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    const activeId = String(event.active.id);
    const overId = String(event.over.id);

    setRows((previous) => {
      const oldIndex = previous.findIndex((item) => item.id === activeId);
      const newIndex = previous.findIndex((item) => item.id === overId);
      const reordered = arrayMove(previous, oldIndex, newIndex).map((item, index) => ({
        ...item,
        sort_order: index,
      }));

      startTransition(async () => {
        const formData = new FormData();
        formData.set(
          "items",
          JSON.stringify(
            reordered.map((item, index) => ({
              id: item.id,
              sort_order: index,
            })),
          ),
        );
        try {
          await reorderCategories(formData);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Could not save order.");
        }
      });

      return reordered;
    });
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-3">Sort</th>
                <th className="px-3 py-3">Image</th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Slug</th>
                <th className="px-3 py-3">Products</th>
                <th className="px-3 py-3">Order</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((category) => (
                <SortableRow key={category.id} category={category} />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
      {pending ? <p className="px-4 py-2 text-xs text-muted-foreground">Saving order...</p> : null}
    </div>
  );
}
