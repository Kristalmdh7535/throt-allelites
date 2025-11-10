import ContactForm from "./components/contact-form";

export default function ContactPage() {
  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Get in Touch</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have a question or want to schedule a test ride? Fill out the form below and one of our specialists will contact you shortly.
        </p>
      </div>
      <div className="max-w-2xl mx-auto mt-12">
          <ContactForm />
      </div>
    </div>
  );
}
