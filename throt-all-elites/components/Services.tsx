'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import './Services.css';

interface Service {
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
  icon: string;
}

const services: Service[] = [
  {
    title: 'Test Ride Scheduling',
    description: 'Book a test ride to experience your dream bike at our showroom or a partnered location.',
    cta: 'Book Now',
    ctaLink: '/test-ride',
    icon: '/images/motorbike.jpg',
  },
  {
    title: 'Premium Delivery',
    description: 'Receive your bike via white-glove delivery or a personalized in-store handover.',
    cta: 'Learn More',
    ctaLink: '/delivery',
    icon: '/images/delivery.jpg',
  },
  {
    title: 'Expert Support',
    description: 'Enjoy lifetime support, warranty services, and priority maintenance bookings.',
    cta: 'Get Support',
    ctaLink: '/support',
    icon: '/images/customerService.jpg',
  },
];

const Services: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section className="services-section">
      <div className="content-container">
        <motion.h2
          className="services-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Services
        </motion.h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}>
              <div className="service-icon">
                <Image src={service.icon} alt={`${service.title} icon`} width={80} height={80} />
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-description">{service.description}</p>
              <div className="service-card-cta">
                <Link href={service.ctaLink} passHref>
                  <motion.button
                    className="cta-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    {service.cta}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;