'use client';

import { FormEvent, useId, useState } from 'react';
import { ApiConfigurationError } from '@/lib/api/client';
import { joinWaitlist, type WaitlistLanguage } from '@/lib/api/waitlist';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';
import { SwordsIcon } from './Icons';

type WaitlistFormStatus = 'idle' | 'loading' | 'success' | 'alreadyJoined' | 'validationError' | 'serverError' | 'configError';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface WaitlistFormProps {
  className?: string;
}

export default function WaitlistForm({ className = '' }: WaitlistFormProps) {
  const { lang } = useLanguage();
  const { t } = useTranslations();
  const formId = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<WaitlistFormStatus>('idle');

  const messageByStatus: Partial<Record<WaitlistFormStatus, string>> = {
    success: t('waitlist.messages.success'),
    alreadyJoined: t('waitlist.messages.alreadyJoined'),
    validationError: t('waitlist.messages.validationError'),
    serverError: t('waitlist.messages.serverError'),
    configError: t('waitlist.messages.configError'),
  };

  const statusMessage = messageByStatus[status];
  const isLoading = status === 'loading';
  const isSuccessState = status === 'success' || status === 'alreadyJoined';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!emailPattern.test(normalizedEmail)) {
      setStatus('validationError');
      return;
    }

    setStatus('loading');

    try {
      const result = await joinWaitlist({
        email: normalizedEmail,
        ...(trimmedName ? { name: trimmedName } : {}),
        language: (lang === 'pt' ? 'pt' : 'en') as WaitlistLanguage,
        source: 'website',
      });

      setEmail(normalizedEmail);
      setStatus(result === 'alreadyJoined' ? 'alreadyJoined' : 'success');
    } catch (error) {
      if (error instanceof ApiConfigurationError && process.env.NODE_ENV === 'development') {
        setStatus('configError');
        return;
      }

      setStatus('serverError');
    }
  };

  return (
    <form
      className={`relative mx-auto w-full max-w-2xl border border-gold-dim/35 bg-void/86 p-4 text-left shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:p-5 ${className}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="pointer-events-none absolute inset-2 border border-gold-dim/12" />
      <div className="relative z-10 grid gap-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_1.25fr]">
          <label className="grid gap-2" htmlFor={`${formId}-name`}>
            <span className="font-body text-xs uppercase tracking-[0.22em] text-gold-muted">{t('waitlist.fields.name')}</span>
            <input
              id={`${formId}-name`}
              name="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t('waitlist.placeholders.name')}
              className="min-h-12 border border-gold-dim/24 bg-void/80 px-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-emerald/70 focus:shadow-[0_0_0_1px_rgba(47,212,143,0.24)]"
              autoComplete="name"
              disabled={isLoading}
            />
          </label>

          <label className="grid gap-2" htmlFor={`${formId}-email`}>
            <span className="font-body text-xs uppercase tracking-[0.22em] text-gold-muted">{t('waitlist.fields.email')}</span>
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('waitlist.placeholders.email')}
              className="min-h-12 border border-gold-dim/24 bg-void/80 px-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-emerald/70 focus:shadow-[0_0_0_1px_rgba(47,212,143,0.24)]"
              autoComplete="email"
              required
              disabled={isLoading}
            />
          </label>
        </div>

        <button
          type="submit"
          className="gold-button min-h-12 w-full px-8 py-3 font-display text-sm tracking-wider disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isLoading}
        >
          <SwordsIcon className="h-4 w-4" />
          {isLoading ? t('waitlist.actions.loading') : t('waitlist.actions.submit')}
        </button>

        {statusMessage && (
          <p
            className={`border px-4 py-3 text-sm leading-relaxed ${
              isSuccessState
                ? 'border-fiery-orange/35 bg-fiery-orange/10 text-text-primary'
                : 'border-hp-red/35 bg-hp-red/10 text-text-secondary'
            }`}
            role={isSuccessState ? 'status' : 'alert'}
          >
            {statusMessage}
          </p>
        )}
      </div>
    </form>
  );
}
