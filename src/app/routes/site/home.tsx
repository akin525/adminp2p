import { Link } from "react-router";
import MobileMenu from "@/components/mobile-menu";
import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import Marquee from "react-fast-marquee";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { DotBackgroundDemo } from "@/components/ui/dot-background";

import {
  Bitcoin,
  Wallet,
  BarChart3,
  Shield,
  Coins,
  CheckCircle,
} from "lucide-react";

export function Header() {
  return (
    <>
      <header className="flex items-center px-5 h-20 fixed top-0 z-50 backdrop-blur-sm w-full">
        <div className="flex items-center justify-between w-full md:container h-full mx-auto">
          <div className="flex items-center">
            <p className="font-bold text-3xl">DonateP2P</p>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/login" className=" transition">
              <Button variant="outline">Sign In</Button>
            </Link>

            <Link
              to="/register"
              className="text-white hover:text-primary transition"
            >
              <Button>Register</Button>
            </Link>
          </nav>

          <MobileMenu />
        </div>
      </header>
      <div className="mb-20"></div>
    </>
  );
}

export default function Home() {
  useEffect(() => {
    AOS.init({ once: true });
    AOS.refresh();
  }, []);

  return (
    <ReactLenis root>
      <div className="">
        {/* Header */}
        <Header />

        <HeroSection />

        <WhatIsSection />

        <P2PSection />

        {/* Services Section */}
        <ServicesSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Footer */}
        <Footer />
      </div>
    </ReactLenis>
  );
}

const HeroSection = () => {
  return (
    <>
      <main className=" pt-20 px-5 md:px-10 overflow-hidden lg:h-[calc(100dvh-100px)] lg:max-h-[1024px] relative">
        <DotBackgroundDemo />
        <div className="container mx-auto h-full relative">
          {/* Floating blob */}
          <div className="absolute -z-10 top-0 left-0 size-40 sm:size-60  xl:size-80 rounded-full blur-[80px] sm:blur-[120px] xl:blur-[200px] bg-primary floating-blob"></div>
          <div className="absolute -z-10 bottom-10 right-10 size-36 md:size-56 xl:size-72 rounded-full blur-3xl md:blur-[100px] xl:blur-[260px] bg-[#00b1ed] floating-blob-2"></div>

          {/* Hero content */}
          <div className="relative w-full h-full flex flex-col gap-4 justify-center items-center py-20">
            <p className="text-lg sm:text-xl md:text-2xl font-bold">
              INTRODUCING
            </p>
            <h2 className="font-gothic text-5xl sm:text-7xl md:text-8xl lg:text-[128px] xl:text-[160px] lg:leading-[140px]">
              Donate<span className="text-primary font-gothic">P2P</span>
            </h2>
            <p className="max-w-4xl text-lg md:text-2xl text-center">
              Trade All Assets Through Peer-To-Peer (P2P) Easier Than Ever
            </p>

            <div className="flex flex-col w-full sm:w-max sm:flex-row items-center gap-6 mt-10">
              <Link to="/login" className="w-full sm:w-max">
                <Button
                  variant="outline"
                  size={"lg"}
                  className="h-16 w-full rounded-full sm:px-10 sm:max-w-64 sm:w-max text-xl cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>

              <Link to="/register" className="w-full sm:w-max">
                <Button
                  size={"lg"}
                  className="h-16 w-full rounded-full sm:px-10 sm:max-w-64 sm:w-max text-xl cursor-pointer"
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <div className="bg-primary border-t-4 border-b-4 border-dark h-10 flex items-center font-rubik">
        <Marquee speed={40}>
          {Array.from({ length: 20 }).map((_, index) => {
            return (
              <p key={index} className="mx-4 text-base sm:text-xl font-bold">
                <span className="mx-4">$TL</span>
                <span className="mx-4">SolanaP2PConnect</span>
              </p>
            );
          })}
        </Marquee>
      </div>
    </>
  );
};

const WhatIsSection = () => {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto justify-center flex gap-8 flex-col w-full lg:flex-row items-center ">
        <div className="lg:w-1/2 mb-10 md:mb-0">
          <div className="flex items-center mb-4">
            <div className="bg-primary rounded-full size-6 sm:size-8 flex items-center justify-center mr-2">
              <span className="text-white text-xs sm:text-base font-bold">
                !
              </span>
            </div>
            <span className="text-primary text-sm sm:text-base uppercase font-medium">
              WHAT IS SolanaP2PConnect
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Trade All Assets Through Peer-To-Peer (P2P) Easier Than Ever
          </h1>

          <p className="text-muted-foreground text-sm lg:text-base mb-8 max-w-lg">
            SolanaP2PConnect (TL) is a peer-to-peer digital asset trading and exchange
            platform that seizes all opportunities in the crypto world by acting
            as an intermediary between a seller of a digital asset (coin or
            token) and his corresponding buyer.
          </p>

          <Link to="/dashboard">
            <Button size={"lg"}>
              BID NOW
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>

        <div className="lg:w-1/2 relative min-h-[400px] w-full aspect-video bg-primary/5 rounded-4xl"></div>
      </div>
    </section>
  );
};

const P2PSection = () => {
  return (
    <>
      <section className="min-h-[600px] px-4 py-20 md:py-24">
        <div className="container w-full  flex items-center lg:flex-row flex-col gap-8 justify-center mx-auto overflow-hidden">
          <div className="lg:w-1/2 relative min-h-[400px] w-full aspect-video bg-primary/5 rounded-4xl"></div>

          <div className="lg:w-1/2 lg:pl-12">
            <div className="mb-4">
              <span className="text-primary text-sm sm:text-base uppercase font-medium">
                P2P DECENTRALISED
              </span>
              <div className="w-24 h-0.5 sm:h-1 bg-primary mt-2"></div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
              Trade New Assets Via A Decentralized Platform
            </h2>

            <p className="text-gray-400 text-sm sm:text-base mb-8">
              Our platform enables secure, transparent, and efficient
              peer-to-peer trading of digital assets without the need for
              intermediaries, giving you complete control over your
              transactions.
            </p>

            <Link
              to="#learn-more"
              className="text-primary text-sm sm:text-base inline-flex items-center hover:underline"
            >
              Learn more
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

function ServicesSection() {
  const services = [
    {
      icon: <Bitcoin className="text-primary h-7 w-7" />,
      title: "P2P Cryptocurrency Trading",
      description:
        "Trade Bitcoin, Ethereum, and other cryptocurrencies directly with other users through our secure peer-to-peer platform.",
    },
    {
      icon: <Wallet className="text-primary h-7 w-7" />,
      title: "Secure Wallet Services",
      description:
        "Store your digital assets safely with our state-of-the-art wallet technology featuring advanced encryption and multi-signature protection.",
    },
    {
      icon: <BarChart3 className="text-primary h-7 w-7" />,
      title: "Market Analysis Tools",
      description:
        "Access real-time market data, price charts, and analytical tools to make informed trading decisions.",
    },
    {
      icon: <Shield className="text-primary h-7 w-7" />,
      title: "Escrow Protection",
      description:
        "Trade with confidence using our escrow service that protects both buyers and sellers throughout the transaction process.",
    },
    {
      icon: <Coins className="text-primary h-7 w-7" />,
      title: "Multi-Currency Support",
      description:
        "Trade a wide variety of cryptocurrencies and digital assets on our platform with competitive rates and low fees.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M12 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
          <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        </svg>
      ),
      title: "24/7 Customer Support",
      description:
        "Get assistance anytime with our dedicated customer support team available 24/7 via live chat, email, and phone.",
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            SolanaP2PConnect Trading offers a comprehensive suite of services to meet
            all your cryptocurrency trading needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-primary/10 p-6 rounded-lg border border-primary/20  transition-all duration-300"
            >
              <div className="bg-primary/10 size-10 sm:size-14  rounded-full flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    "Secure P2P Trading",
    "Low Transaction Fees",
    "Multi-Currency Support",
    "Advanced Encryption",
    "Real-time Market Data",
    "Mobile Trading App",
    "Escrow Protection",
    "24/7 Customer Support",
    "Fast Transaction Processing",
    "Two-Factor Authentication",
    "User-Friendly Interface",
    "Global Accessibility",
  ];

  return (
    <section
      id="features"
      className="py-20 md:py-24 px-4 w-full md:px-10 min-h-[800px] h-full flex items-center justify-center overflow-hidden"
    >
      <div className="container mx-auto w-full px-4 flex flex-col lg:flex-row items-center gap-8 justify-center">
        <div className="lg:w-1/2 w-full">
          <div className="mb-4">
            <span className="text-primary text-sm sm:text-base uppercase font-medium">
              PLATFORM FEATURES
            </span>
            <div className="w-24 h-0.5 sm:h-1 bg-primary mt-2"></div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Why Choose SolanaP2PConnect Trading Platform
          </h2>

          <p className="text-gray-400 text-sm sm:text-base  mb-8">
            Our platform is designed with security, efficiency, and user
            experience in mind. We provide the tools and features you need to
            trade cryptocurrencies with confidence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="text-primary h-5 w-5 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2 w-full">
          <div className="relative w-full">
            <div className="absolute -inset-0 rounded-xl bg-primary/10 blur-xl"></div>
            <div className="bg-primary/20 min-h-[400px] h-full w-full aspect-video rounded-xl border border-primary/30"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "What is SolanaP2PConnect Trading (TL)?",
      answer:
        "SolanaP2PConnect Trading (TL) is a peer-to-peer digital asset trading and exchange platform that acts as an intermediary between sellers and buyers of digital assets (coins or tokens). Our platform enables secure, transparent, and efficient trading without traditional intermediaries.",
    },
    {
      question: "How does P2P trading work?",
      answer:
        "Peer-to-peer (P2P) trading allows users to trade directly with each other without a central authority. On our platform, sellers list their digital assets with their desired price and payment methods. Buyers can browse listings, select one that matches their requirements, and initiate a trade. Our escrow system holds the digital assets until the payment is confirmed, ensuring a secure transaction.",
    },
    {
      question: "What cryptocurrencies can I trade on TL?",
      answer:
        "SolanaP2PConnect Trading supports a wide range of cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Tether (USDT), Binance Coin (BNB), and many other popular altcoins. We regularly add support for new cryptocurrencies based on market demand and community feedback.",
    },
    {
      question: "Is SolanaP2PConnect Trading secure?",
      answer:
        "Yes, security is our top priority. We implement industry-standard security measures including two-factor authentication (2FA), advanced encryption for all data, cold storage for the majority of assets, and regular security audits. Additionally, our escrow system protects both buyers and sellers during transactions.",
    },
    {
      question: "What are the fees for trading on TL?",
      answer:
        "SolanaP2PConnect Trading charges a small fee for each successful transaction, typically ranging from 0.1% to 0.5% depending on the trading volume and user tier. We do not charge any deposit fees, and withdrawal fees vary depending on the cryptocurrency network. You can view our complete fee schedule in your account dashboard.",
    },
    {
      question: "How do I get started with SolanaP2PConnect Trading?",
      answer:
        "Getting started is simple: 1) Create an account by clicking the 'Sign Up' button, 2) Complete the verification process to secure your account, 3) Deposit funds or cryptocurrencies into your wallet, and 4) Start trading! Our intuitive interface makes it easy for both beginners and experienced traders.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "SolanaP2PConnect Trading supports various payment methods including bank transfers, credit/debit cards, PayPal, and other popular online payment services. Available payment methods may vary by region and are determined by the sellers' preferences when listing their assets.",
    },
    {
      question: "How long do transactions take to complete?",
      answer:
        "Transaction times vary depending on the payment method and cryptocurrency network. P2P trades typically complete within minutes to a few hours, depending on how quickly the buyer confirms payment. Cryptocurrency withdrawals depend on the specific blockchain network's confirmation times, ranging from minutes to an hour.",
    },
  ];

  return (
    <section id="faqs" className="bg-primary/20 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto">
            Find answers to the most common questions about SolanaP2PConnect Trading
            and our P2P platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-sm sm:text-lg md:text-xl">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

const footerData = {
  companyInfo: {
    description:
      "SolanaP2PConnect Trading is a peer-to-peer digital asset trading and exchange platform that connects buyers and sellers worldwide.",
  },
  quickLinks: [
    { label: "Home", href: "#" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Services", href: "#services" },
    { label: "Features", href: "#features" },
    { label: "FAQs", href: "#faqs" },
    { label: "Contact Us", href: "#" },
  ],
  legalLinks: [
    "Terms of Service",
    "Privacy Policy",
    "Cookie Policy",
    "Risk Disclosure",
    "AML Policy",
  ],
  newsletter: {
    description:
      "Subscribe to our newsletter to receive updates and news about our platform.",
    placeholder: "Your email address",
    buttonText: "Subscribe",
  },
  footerBottom: {
    copyright: `© ${new Date().getFullYear()} SolanaP2PConnect Trading. All rights reserved.`,
    additionalLinks: ["Support", "Security", "Careers"],
  },
};

function Footer() {
  return (
    <footer className="bg-background pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:place-items-center place-content-center lg:grid-cols-3 gap-8 mb-12">
          {/* Company Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <p className="font-bold text-3xl">SolanaP2PConnect</p>
            </div>
            <p className="text-gray-400 mb-4 max-w-sm">
              {footerData.companyInfo.description}
            </p>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Legal */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerData.legalLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    to="#"
                    className="text-gray-400 hover:text-primary transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between lg:items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {footerData.footerBottom.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
