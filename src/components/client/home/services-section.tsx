import { ArrowRight, Package, PenTool, Sparkles } from "lucide-react";

const services = [
  {
    icon: Package,
    title: "Ready-to-wear",
    description:
      "Instantly curated sets for the modern enthusiast. Professional salon finish in minutes.",
    cta: "SHOP NOW",
    borderColor: "border-[#a43716]",
    iconColor: "text-[#a43716]",
  },
  {
    icon: Sparkles,
    title: "Exclusive Collections",
    description:
      "Limited release capsules designed in collaboration with global avant-garde artists.",
    cta: "DISCOVER MORE",
    borderColor: "border-[#396666]",
    iconColor: "text-[#396666]",
  },
  {
    icon: PenTool,
    title: "Custom Order",
    description:
      "Your vision, our craftsmanship. Completely bespoke sets tailored to your specific aesthetic.",
    cta: "GET A QUOTE",
    borderColor: "border-[#795600]",
    iconColor: "text-[#795600]",
  },
];

export function ServicesSection() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-24">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.title}
            className="group border-2 border-[#1d1b18] bg-[#fef9f3] p-10 shadow-[4px_4px_0px_0px_rgba(29,27,24,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(29,27,24,1)]"
          >
            <service.icon className={`mb-6 h-10 w-10 ${service.iconColor}`} />
            <h3 className="mb-4 text-2xl font-bold tracking-tight text-[#1d1b18]">{service.title}</h3>
            <p className="mb-8 leading-relaxed text-[#58423c]">{service.description}</p>
            <a
              className={`inline-flex items-center gap-2 border-b-2 pb-1 text-xs font-bold uppercase tracking-widest text-[#1d1b18] transition-all group-hover:gap-4 ${service.borderColor}`}
              href="#"
            >
              {service.cta} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
