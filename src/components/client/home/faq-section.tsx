import { Plus } from "lucide-react";

const faqs = [
  "How long do NAILBOX sets last?",
  "What's included in my custom kit?",
  "Do you ship internationally?",
  "Can I reuse my press-ons?",
];

export function FaqSection() {
  return (
    <section className="mx-auto max-w-3xl px-8 py-24">
      <h2 className="mb-16 text-center text-3xl font-black uppercase italic tracking-tighter text-[#1d1b18]">
        COMMON INQUIRIES
      </h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq}
            className="group flex cursor-pointer items-center justify-between border-2 border-[#1d1b18] bg-[#f8f3ed] p-6"
          >
            <span className="font-bold text-[#1d1b18]">{faq}</span>
            <Plus className="h-5 w-5 text-[#1d1b18] transition-colors group-hover:text-[#a43716]" />
          </div>
        ))}
      </div>
    </section>
  );
}
