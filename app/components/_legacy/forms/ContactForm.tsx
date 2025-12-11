'use client';

import { useState, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { ArrowRightIcon } from 'lucide-react';

interface ContactFormProps {
  texts: {
    labels: {
      name: string;
      email: string;
      message: string;
    };
    placeholders: {
      name: string;
      email: string;
      message: string;
    };
  };
  submitLabel: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm({ texts, submitLabel }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'お名前は必須です';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'メッセージは必須です';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'メッセージは10文字以上入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Formspree を使用する場合
      // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // 現在はクライアントサイドでのみ処理（実際の送信は実装しない）
      // 実際の送信が必要な場合は、Formspree や mailto を使用
      
      // シミュレーション: 送信成功
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // 3秒後にステータスをリセット
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-md w-full mx-auto">
      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-mono text-gray-500 uppercase">
          {texts.labels.name}
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary-500 outline-none transition-all ${
            errors.name
              ? 'border-red-500 focus:border-red-500'
              : 'border-dark-700 focus:border-primary-500'
          }`}
          placeholder={texts.placeholders.name}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-red-400" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-mono text-gray-500 uppercase">
          {texts.labels.email}
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary-500 outline-none transition-all ${
            errors.email
              ? 'border-red-500 focus:border-red-500'
              : 'border-dark-700 focus:border-primary-500'
          }`}
          placeholder={texts.placeholders.email}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-400" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-mono text-gray-500 uppercase">
          {texts.labels.message}
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={handleChange('message')}
          className={`w-full bg-dark-900 border rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary-500 outline-none transition-all resize-none ${
            errors.message
              ? 'border-red-500 focus:border-red-500'
              : 'border-dark-700 focus:border-primary-500'
          }`}
          placeholder={texts.placeholders.message}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-red-400" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center btn-neon"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            送信中...
          </>
        ) : (
          <>
            {submitLabel} <ArrowRightIcon className="ml-2 w-5 h-5" />
          </>
        )}
      </Button>

      {/* Success Message */}
      {submitStatus === 'success' && (
        <div
          className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-center"
          role="alert"
        >
          ✓ お問い合わせありがとうございます。送信が完了しました。
        </div>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div
          className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-center"
          role="alert"
        >
          ✗ 送信に失敗しました。しばらくしてから再度お試しください。
        </div>
      )}
    </form>
  );
}
