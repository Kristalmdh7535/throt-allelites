// components/Services.tsx
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import './Services.css';

interface Service {
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
  image: string;
}

const services: Service[] = [
  {
    title: 'Test Ride Scheduling',
    description: 'Book a test ride to experience your dream bike at our showroom or a partnered location.',
    cta: 'Book Now',
    ctaLink: '/test-ride',
    image: '/images/icons/test-ride.png',
  },
  {
    title: 'Premium Delivery',
    description: 'Receive your bike via white-glove delivery or a personalized in-store handover.',
    cta: 'Learn More',
    ctaLink: '/delivery',
    image: '/images/icons/delivery.png',
  },
  {
    title: 'Expert Support',
    description: 'Enjoy lifetime support, warranty services, and priority maintenance bookings.',
    cta: 'Get Support',
    ctaLink: '/support',
    image: '/images/icons/support.png',
  },
];

const Services: React.FC = () => {
  return (
    <section className="services-section">
      <div className="content-container">
        <h2 className="services-title">Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <Image
                src={service.image}
                alt={service.title}
                width={64}
                height={64}
                className="service-icon"
              />
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-description">{service.description}</p>
              <div className="service-card-cta">
                <Link href={service.ctaLink}>
                  <button className="cta-button">{service.cta}</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;