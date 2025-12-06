'use client';

import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { ArrowRightIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import type { TextsConfig } from '../lib/theme-types';

interface ContactFormProps {
  texts: TextsConfig;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm({ texts }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = texts.form.validation?.nameRequired || 'お名前を入力してください';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = texts.form.validation?.emailRequired || 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = texts.form.validation?.emailInvalid || '有効なメールアドレスを入力してください';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = texts.form.validation?.messageRequired || 'メッセージを入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    // 静的サイトなので、実際の送信はできませんが、
    // メールリンクを開く、または成功メッセージを表示します
    try {
      // 送信処理のシミュレーション（実際の環境ではAPIエンドポイントに送信）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功時
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // 5秒後にステータスをリセット
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 入力時にエラーをクリア
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-md w-full mx-auto">
      {/* 成功メッセージ */}
      {submitStatus === 'success' && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
          <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{texts.form.success || 'お問い合わせを送信しました。'}</p>
        </div>
      )}
      
      {/* エラーメッセージ */}
      {submitStatus === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{texts.form.error || '送信に失敗しました。'}</p>
        </div>
      )}

      {/* 名前 */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-mono text-gray-500 uppercase">
          {texts.form.labels.name}
        </label>
        <input 
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all ${
            errors.name ? 'border-red-500' : 'border-dark-700'
          }`}
          placeholder={texts.form.placeholders.name}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-400">{errors.name}</p>
        )}
      </div>
      
      {/* メールアドレス */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-mono text-gray-500 uppercase">
          {texts.form.labels.email}
        </label>
        <input 
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all ${
            errors.email ? 'border-red-500' : 'border-dark-700'
          }`}
          placeholder={texts.form.placeholders.email}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email}</p>
        )}
      </div>
      
      {/* メッセージ */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-mono text-gray-500 uppercase">
          {texts.form.labels.message}
        </label>
        <textarea 
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all resize-none ${
            errors.message ? 'border-red-500' : 'border-dark-700'
          }`}
          placeholder={texts.form.placeholders.message}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-red-400">{errors.message}</p>
        )}
      </div>
      
      {/* 送信ボタン */}
      <Button 
        type="submit"
        variant="primary" 
        size="lg" 
        className="w-full justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            {texts.buttons.sending || '送信中...'}
          </>
        ) : (
          <>
            {texts.buttons.submit}
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </>
        )}
      </Button>
      
      {/* 注意書き */}
      <p className="text-xs text-gray-600 text-center">
        ※ 現在、お問い合わせフォームはデモ版です。実際のお問い合わせはメールでお願いします。
      </p>
    </form>
  );
}
