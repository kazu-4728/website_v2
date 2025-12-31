"use client";

import React, { useState } from 'react';
import { Button } from '../../modern/ui/Button';

interface ContactFormProps {
    texts: {
        labels: {
            name: string;
            email: string;
            message: string;
            [key: string]: string;
        };
        placeholders: {
            name: string;
            email: string;
            message: string;
            [key: string]: string;
        };
        [key: string]: any;
    };
    submitLabel: string;
}

export function ContactForm({ texts, submitLabel }: ContactFormProps) {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            // Reset after a while
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg mx-auto">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    {texts.labels.name}
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder={texts.placeholders.name}
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    {texts.labels.email}
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder={texts.placeholders.email}
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    {texts.labels.message}
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder={texts.placeholders.message}
                />
            </div>

            <Button
                type="submit"
                disabled={status === 'submitting' || status === 'success'}
                className="w-full"
                size="lg"
            >
                {status === 'submitting' ? '送信中...' : status === 'success' ? '送信完了！' : submitLabel}
            </Button>
        </form>
    );
}
