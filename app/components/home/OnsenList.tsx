'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { OnsenListSection } from '../../lib/content';
import type { OnsenDocPage } from '../../lib/onsen-types';
import { loadContent } from '../../lib/content';

interface OnsenListProps {
  data: OnsenListSection;
  onsenPages: OnsenDocPage[];
  texts: {
    pages: {
      home?: {
        onsenList?: {
          searchPlaceholder: string;
          filters: {
            allAreas: string;
            allSpringTypes: string;
            allEfficacies: string;
            dayTrip: string;
          };
          resultsCount: string;
          noResults: string;
        };
      };
    };
  };
}

export function OnsenList({ data, onsenPages, texts }: OnsenListProps) {
  const onsenListTexts = texts.pages.home?.onsenList || {
    searchPlaceholder: '温泉地名で検索...',
    filters: {
      allAreas: 'すべてのエリア',
      allSpringTypes: 'すべての泉質',
      allEfficacies: 'すべての効能',
      dayTrip: '日帰り可',
    },
    resultsCount: '{count}件の温泉地が見つかりました',
    noResults: '条件に一致する温泉地が見つかりませんでした',
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedSpringType, setSelectedSpringType] = useState<string>('');
  const [selectedEfficacy, setSelectedEfficacy] = useState<string>('');
  const [dayTripOnly, setDayTripOnly] = useState(false);

  // Extract unique values for filters
  const areas = useMemo(() => {
    const areaSet = new Set<string>();
    onsenPages.forEach((page) => {
      if (page.onsen?.region.area) {
        areaSet.add(page.onsen.region.area);
      }
    });
    return Array.from(areaSet).sort();
  }, [onsenPages]);

  const springTypes = useMemo(() => {
    const typeSet = new Set<string>();
    onsenPages.forEach((page) => {
      page.onsen?.onsen.springTypes.forEach((type) => typeSet.add(type));
    });
    return Array.from(typeSet).sort();
  }, [onsenPages]);

  const efficacies = useMemo(() => {
    const efficacySet = new Set<string>();
    onsenPages.forEach((page) => {
      page.onsen?.onsen.effects.forEach((effect) => efficacySet.add(effect));
    });
    return Array.from(efficacySet).sort();
  }, [onsenPages]);

  // Filter onsen pages
  const filteredPages = useMemo(() => {
    return onsenPages.filter((page) => {
      if (!page.onsen) return false;

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          page.title.toLowerCase().includes(query) ||
          page.onsen.name.toLowerCase().includes(query) ||
          page.onsen.nameKana.toLowerCase().includes(query) ||
          page.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Area filter
      if (selectedArea && page.onsen.region.area !== selectedArea) {
        return false;
      }

      // Spring type filter
      if (
        selectedSpringType &&
        !page.onsen.onsen.springTypes.includes(selectedSpringType)
      ) {
        return false;
      }

      // Efficacy filter
      if (
        selectedEfficacy &&
        !page.onsen.onsen.effects.includes(selectedEfficacy)
      ) {
        return false;
      }

      // Day trip filter
      if (dayTripOnly && !page.onsen.accommodation.dayTripAvailable) {
        return false;
      }

      return true;
    });
  }, [
    onsenPages,
    searchQuery,
    selectedArea,
    selectedSpringType,
    selectedEfficacy,
    dayTripOnly,
  ]);

  return (
    <section id="onsen-list" className="py-20 px-4 bg-dark-950">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          {data.subtitle && (
            <p className="text-primary-400 text-sm uppercase tracking-wider mb-2">
              {data.subtitle}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {data.description}
            </p>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder={onsenListTexts.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-dark-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center">
            {data.filters?.area && (
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-4 py-2 rounded-lg bg-dark-900 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{onsenListTexts.filters.allAreas}</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            )}

            {data.filters?.springType && (
              <select
                value={selectedSpringType}
                onChange={(e) => setSelectedSpringType(e.target.value)}
                className="px-4 py-2 rounded-lg bg-dark-900 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{onsenListTexts.filters.allSpringTypes}</option>
                {springTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}

            {data.filters?.efficacy && (
              <select
                value={selectedEfficacy}
                onChange={(e) => setSelectedEfficacy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-dark-900 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{onsenListTexts.filters.allEfficacies}</option>
                {efficacies.map((efficacy) => (
                  <option key={efficacy} value={efficacy}>
                    {efficacy}
                  </option>
                ))}
              </select>
            )}

            {data.filters?.dayTrip && (
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-900 border border-gray-800 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={dayTripOnly}
                  onChange={(e) => setDayTripOnly(e.target.checked)}
                  className="w-4 h-4 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                />
                <span>{onsenListTexts.filters.dayTrip}</span>
              </label>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center text-gray-400">
          {onsenListTexts.resultsCount.replace('{count}', filteredPages.length.toString())}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page, index) => (
            <motion.div
              key={page.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/${page.slug}`}>
                <motion.div
                  className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image */}
                  <Image
                    src={page.image}
                    alt={page.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/50 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {page.title}
                    </h3>
                    {page.description && (
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {page.description}
                      </p>
                    )}
                    {page.onsen?.region.area && (
                      <p className="text-primary-400 text-xs mt-2">
                        {page.onsen.region.area}
                      </p>
                    )}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredPages.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            {onsenListTexts.noResults}
          </div>
        )}
      </div>
    </section>
  );
}
