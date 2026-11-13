import { Mail, MessageSquare, Clock } from "lucide-react";

const EMAIL = "Konlix@gmail.com"; // apni team ki email yahan likho

export default function Contact() {
  const cards = [
    { icon: Mail, title: "Email us", text: EMAIL, href: `mailto:${EMAIL}` },
    { icon: MessageSquare, title: "Questions about a course", text: "Ask the course instructor from the course page." },
    { icon: Clock, title: "Response time", text: "We reply within 1–2 working days." },
  ];
  return (
    <>
      <section className="aurora text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Contact us</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">Have a question or feedback? We would love to hear from you.</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-14 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, text, href }) => (
          <div key={title} className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand"><Icon size={28} /></span>
            <h2 className="mt-4 font-bold">{title}</h2>
            {href ? (
              <a href={href} className="mt-1 block break-all text-sm font-semibold text-brand hover:underline">{text}</a>
            ) : (
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}