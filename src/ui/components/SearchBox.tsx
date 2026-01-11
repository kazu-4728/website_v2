/**
 * UI Layer: Search Box Component
 * 
 * 検索ボックス
 */

'use client';

import { useState, FormEvent } from 'react';

interface SearchBoxProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function SearchBox({
  placeholder = '温泉名、地域で検索...',
  onSearch,
  initialValue = '',
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors text-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          検索
        </button>
      </div>
    </form>
  );
}
