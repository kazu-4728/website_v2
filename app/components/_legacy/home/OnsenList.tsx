'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import type { OnsenListSection } from '../../../lib/content';
import type { OnsenDocPage } from '../../../lib/onsen-types';

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

  const filteredPages = useMemo(() => {
    return onsenPages.filter((page) => {
      if (!page.onsen) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          page.title.toLowerCase().includes(query) ||
          page.onsen.name.toLowerCase().includes(query) ||
          page.onsen.nameKana.toLowerCase().includes(query) ||
          page.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (selectedArea && page.onsen.region.area !== selectedArea) return false;
      if (selectedSpringType && !page.onsen.onsen.springTypes.includes(selectedSpringType)) return false;
      if (selectedEfficacy && !page.onsen.onsen.effects.includes(selectedEfficacy)) return false;
      if (dayTripOnly && !page.onsen.accommodation.dayTripAvailable) return false;

      return true;
    });
  }, [onsenPages, searchQuery, selectedArea, selectedSpringType, selectedEfficacy, dayTripOnly]);

  return (
    <section id="onsen-list" className="px-6 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          {data.subtitle && (
            <motion.p
              className="section-kicker mb-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {data.subtitle}
            </motion.p>
          )}
          <motion.h2
            className="text-4xl leading-[1.12] text-[#2f241c] sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {data.title}
          </motion.h2>
          {data.description && (
            <motion.p
              className="mt-6 text-base leading-8 text-[#68564a] sm:text-lg"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {data.description}
            </motion.p>
          )}
        </div>

        <div className="paper-panel rounded-[32px] p-5 sm:p-6 md:p-7">
          <div className="grid gap-4 md:grid-cols-[1.2fr,1fr,1fr,1fr,auto] md:items-center">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9f7753]" />
              <input
                type="text"
                placeholder={onsenListTexts.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[#dbc6af] bg-white/75 py-3 pl-11 pr-4 text-sm text-[#2f241c] outline-none transition focus:border-[#bf8748]"
              />
            </label>

            {data.filters?.area && (
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="rounded-full border border-[#dbc6af] bg-white/75 px-4 py-3 text-sm text-[#2f241c] outline-none transition focus:border-[#bf8748]"
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
                className="rounded-full border border-[#dbc6af] bg-white/75 px-4 py-3 text-sm text-[#2f241c] outline-none transition focus:border-[#bf8748]"
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
                className="rounded-full border border-[#dbc6af] bg-white/75 px-4 py-3 text-sm text-[#2f241c] outline-none transition focus:border-[#bf8748]"
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
              <label className="flex items-center justify-center gap-2 rounded-full border border-[#dbc6af] bg-white/75 px-4 py-3 text-sm text-[#5f4a3b]">
                <input
                  type="checkbox"
                  checked={dayTripOnly}
                  onChange={(e) => setDayTripOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-[#bf8748] text-[#8e6231] focus:ring-[#bf8748]"
                />
                <span>{onsenListTexts.filters.dayTrip}</span>
              </label>
            )}
          </div>
        </div>

        <div className="mt-5 text-sm text-[#7d6a5b]">
          {onsenListTexts.resultsCount.replace('{count}', filteredPages.length.toString())}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPages.map((page, index) => (
            <motion.div
              key={page.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
            >
              <Link href={`/${page.slug}`} className="group block h-full">
                <article className="overflow-hidden rounded-[30px] border border-[#dac7b1] bg-[#fcf8f1] shadow-[0_18px_50px_rgba(53,37,27,0.08)] transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={page.image}
                      alt={page.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,12,9,0.05),rgba(18,12,9,0.45))]" />
                  </div>

                  <div className="p-6 sm:p-7">
                    {page.onsen?.region.area && (
                      <p className="section-kicker mb-3 text-[0.7rem]">{page.onsen.region.area}</p>
                    )}
                    <h3 className="text-2xl leading-tight text-[#2f241c] sm:text-[1.9rem]">{page.title}</h3>
                    {page.description && (
                      <p className="mt-4 text-[15px] leading-7 text-[#68564a] line-clamp-3">{page.description}</p>
                    )}
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredPages.length === 0 && (
          <div className="py-12 text-center text-[#7d6a5b]">{onsenListTexts.noResults}</div>
        )}
      </div>
    </section>
  );
}
