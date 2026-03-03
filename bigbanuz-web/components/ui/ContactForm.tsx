"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { submitContactLead } from "@/lib/actions/submitContactLead";
import { analytics } from "@/lib/utils/analytics";
import Button from "./Button";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Contact");

  const SUBJECT_OPTIONS = [
    t("subjectEvent"),
    t("subjectSurf"),
    t("subjectOther"),
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const result = await submitContactLead(data);

    if (result.success) {
      setSubmitted(true);
      analytics.emailSubmit("contact");
    } else {
      setError(result.error || t("errorDefault"));
    }

    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sun-gradient text-white shadow-sun-glow mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-h3 font-heading font-bold text-black mb-2">
          {t("successTitle")}
        </h3>
        <p className="text-body text-gray-mid">
          {t("successMessage")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="contact-name"
          className="block text-small font-medium text-black mb-1"
        >
          {t("nameLabel")}
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          required
          className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-white/10 bg-white-pure text-black placeholder:text-gray-mid focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder={t("namePlaceholder")}
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-small font-medium text-black mb-1"
        >
          {t("emailLabel")}
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          required
          className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-white/10 bg-white-pure text-black placeholder:text-gray-mid focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder={t("emailPlaceholder")}
        />
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="block text-small font-medium text-black mb-1"
        >
          {t("subjectLabel")}
        </label>
        <select
          id="contact-subject"
          name="subject"
          required
          className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-white/10 bg-white-pure text-black focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        >
          <option value="">{t("subjectPlaceholder")}</option>
          {SUBJECT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-small font-medium text-black mb-1"
        >
          {t("messageLabel")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-white/10 bg-white-pure text-black placeholder:text-gray-mid focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y"
          placeholder={t("messagePlaceholder")}
        />
      </div>

      {error && (
        <p className="text-small text-red-600" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={loading}>
        {loading ? t("sending") : t("sendMessage")}
      </Button>
    </form>
  );
}
