"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import CategoryFilter from "@/components/ui/CategoryFilter";
import GalleryGrid from "@/components/ui/GalleryGrid";
import type { GalleryImage } from "@/components/ui/GalleryGrid";

export interface SurfGalleryImage extends GalleryImage {
  category: string;
}

interface SurfGalleryProps {
  images: SurfGalleryImage[];
}

export default function SurfGallery({ images }: SurfGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const t = useTranslations("Surf");

  const CATEGORIES = [
    { label: t("categoryAll"), value: "all" },
    { label: t("categoryAction"), value: "action" },
    { label: t("categoryLifestyle"), value: "lifestyle" },
    { label: t("categoryDestinations"), value: "destinations" },
    { label: t("categoryBehindTheLens"), value: "behind-the-lens" },
  ];

  const filtered =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.category === activeCategory);

  if (!images || images.length === 0) return null;

  return (
    <section className="py-section">
      <div className="max-w-wide mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-h2 font-heading font-bold text-black text-center mb-8">
          {t("portfolioTitle")}
        </h2>

        <div className="mb-8">
          <CategoryFilter
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <GalleryGrid
          images={filtered}
          columns={3}
          gap="tight"
        />
      </div>
    </section>
  );
}
