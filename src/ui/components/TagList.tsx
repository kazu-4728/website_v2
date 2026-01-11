/**
 * UI Layer: Tag List Component
 * 
 * タグ表示
 */

interface TagListProps {
  tags: string[];
  className?: string;
  maxTags?: number;
}

export function TagList({ tags, className = '', maxTags }: TagListProps) {
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;

  if (displayTags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayTags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
