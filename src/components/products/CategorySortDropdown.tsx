"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Name A-Z", value: "name-az" },
  { label: "Newest", value: "newest" },
] as const;

type Props = {
  slug: string;
  activeSort: string;
  currentSort: string;
};

export function CategorySortDropdown({ slug, activeSort, currentSort }: Props) {
  const router = useRouter();

  function navigate(value: string) {
    const href =
      value === "featured"
        ? `/products/category/${slug}`
        : `/products/category/${slug}?sort=${value}`;
    router.push(href, { scroll: false });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between sm:w-40">
          {activeSort}
          <ChevronRight className="size-4 rotate-90" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => navigate(option.value)}
            className={cn(
              "cursor-pointer",
              option.value === currentSort && "font-semibold text-primary",
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}