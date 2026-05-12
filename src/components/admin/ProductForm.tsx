"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
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
import { GripVertical, ImagePlus, RefreshCw, Trash2, Upload } from "lucide-react";

import { uploadProductImage } from "@/lib/actions/admin/products";
import { slugify } from "@/lib/utils";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CategoryOption = {
  id: string;
  name: string;
};

type ProductImageItem = {
  uid: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
};

type ProductFormData = {
  id?: string;
  name: string;
  slug: string;
  brand: string;
  model_code: string;
  category_id: string;
  short_description: string;
  long_description: string;
  specifications: Record<string, string>;
  tags: string[];
  featured: boolean;
  in_stock: boolean;
  sort_order: number;
  meta_title: string;
  meta_description: string;
  images: ProductImageItem[];
};

type ProductFormProps = {
  mode: "create" | "edit";
  categories: CategoryOption[];
  existingTags: string[];
  initialData?: ProductFormData;
  submitAction: (formData: FormData) => Promise<void>;
};

function SortableImage({
  item,
  onAltChange,
  onRemove,
  onPrimary,
}: {
  item: ProductImageItem;
  onAltChange: (uid: string, value: string) => void;
  onRemove: (uid: string) => void;
  onPrimary: (uid: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.uid,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-md border bg-white p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="cursor-grab text-muted-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <img src={item.url} alt={item.alt_text || "Product image"} className="size-16 rounded-md object-cover" />
        <div className="min-w-0 flex-1 space-y-2">
          <Input
            value={item.alt_text}
            onChange={(event) => onAltChange(item.uid, event.target.value)}
            placeholder="Alt text"
          />
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="primary-image"
              checked={item.is_primary}
              onChange={() => onPrimary(item.uid)}
            />
            Set as primary
          </label>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(item.uid)}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function ProductForm({
  mode,
  categories,
  existingTags,
  initialData,
  submitAction,
}: ProductFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [brand, setBrand] = useState(initialData?.brand ?? "");
  const [modelCode, setModelCode] = useState(initialData?.model_code ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? "");
  const [shortDescription, setShortDescription] = useState(initialData?.short_description ?? "");
  const [longDescription, setLongDescription] = useState(initialData?.long_description ?? "<p></p>");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [inStock, setInStock] = useState(initialData?.in_stock ?? true);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [specRows, setSpecRows] = useState(
    Object.entries(initialData?.specifications ?? {}).map(([key, value]) => ({
      key,
      value,
    })),
  );
  const [images, setImages] = useState<ProductImageItem[]>(initialData?.images ?? []);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const payload = useMemo(() => {
    const specifications = specRows.reduce<Record<string, string>>((acc, row) => {
      if (row.key.trim() && row.value.trim()) acc[row.key.trim()] = row.value.trim();
      return acc;
    }, {});

    return {
      name,
      slug,
      brand,
      model_code: modelCode,
      category_id: categoryId,
      short_description: shortDescription,
      long_description: longDescription,
      specifications,
      tags,
      featured,
      in_stock: inStock,
      sort_order: sortOrder,
      meta_title: metaTitle,
      meta_description: metaDescription,
      images: images.map((image, index) => ({
        url: image.url,
        alt_text: image.alt_text,
        is_primary: image.is_primary,
        sort_order: index,
      })),
    };
  }, [
    name,
    slug,
    brand,
    modelCode,
    categoryId,
    shortDescription,
    longDescription,
    tags,
    featured,
    inStock,
    sortOrder,
    metaTitle,
    metaDescription,
    specRows,
    images,
  ]);

  function regenerateSlug() {
    setSlug(slugify(name));
  }

  function addSpecRow() {
    setSpecRows((prev) => [...prev, { key: "", value: "" }]);
  }

  function updateSpecRow(index: number, field: "key" | "value", value: string) {
    setSpecRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  }

  function removeSpecRow(index: number) {
    setSpecRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
  }

  function addTag(value: string) {
    const normalized = value.trim();
    if (!normalized) return;
    setTags((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
    setTagInput("");
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.set("file", file);

      try {
        const uploaded = await uploadProductImage(formData);
        setImages((prev) => [
          ...prev,
          {
            uid: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            url: uploaded.url,
            alt_text: "",
            is_primary: prev.length === 0,
          },
        ]);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Image upload failed.");
      }
    }

    setUploading(false);
  }

  function onDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    const activeId = String(event.active.id);
    const overId = String(event.over.id);
    setImages((prev) => {
      const oldIndex = prev.findIndex((item) => item.uid === activeId);
      const newIndex = prev.findIndex((item) => item.uid === overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  async function submit(formData: FormData) {
    if (!name.trim() || !slug.trim()) {
      toast.error("Name and slug are required.");
      return;
    }
    formData.set("payload", JSON.stringify(payload));
    if (initialData?.id) {
      formData.set("productId", initialData.id);
    }

    startTransition(async () => {
      try {
        await submitAction(formData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save product.");
      }
    });
  }

  return (
    <form action={submit} className="space-y-8 rounded-lg border bg-white p-6">
      <input type="hidden" name="payload" value={JSON.stringify(payload)} readOnly />
      {initialData?.id ? <input type="hidden" name="productId" value={initialData.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <div className="flex gap-2">
            <Input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
            <Button type="button" variant="outline" onClick={regenerateSlug}>
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" value={brand} onChange={(event) => setBrand(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="modelCode">Model Code</Label>
          <Input id="modelCode" value={modelCode} onChange={(event) => setModelCode(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDesc">Short Description</Label>
        <Textarea
          id="shortDesc"
          rows={2}
          value={shortDescription}
          onChange={(event) => setShortDescription(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Long Description</Label>
        <RichTextEditor value={longDescription} onChange={setLongDescription} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Specifications</Label>
          <Button type="button" variant="outline" size="sm" onClick={addSpecRow}>
            Add row
          </Button>
        </div>
        <div className="space-y-2">
          {specRows.map((row, index) => (
            <div key={`${index}-${row.key}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <Input
                placeholder="Key (e.g. power)"
                value={row.key}
                onChange={(event) => updateSpecRow(index, "key", event.target.value)}
              />
              <Input
                placeholder="Value"
                value={row.value}
                onChange={(event) => updateSpecRow(index, "value", event.target.value)}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecRow(index)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="rounded-full border px-3 py-1 text-xs hover:border-accent"
              onClick={() => setTags((prev) => prev.filter((current) => current !== tag))}
            >
              {tag} ×
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            placeholder="Add tag"
            list="existing-tags"
          />
          <Button type="button" variant="outline" onClick={() => addTag(tagInput)}>
            Add
          </Button>
        </div>
        <datalist id="existing-tags">
          {existingTags.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          In Stock
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title ({metaTitle.length}/60)</Label>
          <Input id="metaTitle" value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description ({metaDescription.length}/160)</Label>
          <Textarea
            id="metaDescription"
            rows={3}
            value={metaDescription}
            onChange={(event) => setMetaDescription(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Product Images</Label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:border-accent">
            <Upload className="size-4" />
            {uploading ? "Uploading..." : "Upload images"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => void handleUpload(event.target.files)}
            />
          </label>
        </div>
        {images.length === 0 ? (
          <div className="flex min-h-28 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            <ImagePlus className="mr-2 size-4" />
            No images uploaded yet.
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={images.map((item) => item.uid)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {images.map((item) => (
                  <SortableImage
                    key={item.uid}
                    item={item}
                    onAltChange={(uid, value) =>
                      setImages((prev) => prev.map((img) => (img.uid === uid ? { ...img, alt_text: value } : img)))
                    }
                    onRemove={(uid) => setImages((prev) => prev.filter((img) => img.uid !== uid))}
                    onPrimary={(uid) =>
                      setImages((prev) =>
                        prev.map((img) => ({ ...img, is_primary: img.uid === uid })),
                      )
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending || uploading}>
          {pending ? "Saving..." : mode === "create" ? "Save Product" : "Update Product"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <a href="/admin/products">Cancel</a>
        </Button>
      </div>
    </form>
  );
}
