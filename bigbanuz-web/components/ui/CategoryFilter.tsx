"use client";

interface CategoryFilterProps {
  categories: Array<{ label: string; value: string }>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2 justify-center"
      role="tablist"
      aria-label="Gallery categories"
    >
      {categories.map((cat) => (
        <button
          key={cat.value}
          type="button"
          role="tab"
          aria-selected={activeCategory === cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`px-4 py-2 text-small font-medium rounded-full transition-all duration-normal focus:outline-none focus:ring-2 focus:ring-accent ${
            activeCategory === cat.value
              ? "bg-charcoal text-white shadow-md"
              : "bg-gray-light text-gray-warm dark:text-gray-mid border border-gray-300 dark:border-white/10 hover:bg-accent-soft hover:border-accent"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
