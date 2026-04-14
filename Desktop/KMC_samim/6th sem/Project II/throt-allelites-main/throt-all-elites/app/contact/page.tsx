import type { Metadata } from 'next';
import Contact from './Contact';

export const metadata: Metadata = {
  title: 'Contact Us | Throt-All Elites',
  description: 'Get in touch with Throt-All Elites — your premium motorcycle showroom in Kathmandu. Enquire about bikes, servicing, test rides, and more.',
};

export default function ContactPage() {
  return <Contact />;
}