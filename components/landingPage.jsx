"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Newspaper, Bell, Edit, Clock, LayoutDashboard, Rss } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function LandingPage() {
  return (
    (<div className="flex flex-col min-h-screen bg-diginews-gray">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="px-4 lg:px-6 h-16 flex items-center bg-diginews-blue fixed w-full z-50">
        <Link className="flex items-center justify-center" href="#">
          <Newspaper className="h-6 w-6 text-white" />
          <span className="ml-2 text-2xl font-bold text-white">DIGINEWS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium text-white hover:text-white/80 transition-colors"
            href="#features">
            Caratteristiche
          </Link>
          <Link
            className="text-sm font-medium text-white hover:text-white/80 transition-colors"
            href="#how-it-works">
            Come Funziona
          </Link>
          <Link
            className="text-sm font-medium text-white hover:text-white/80 transition-colors"
            href="#ai-features">
            Funzionalità IA
          </Link>
        </nav>
      </motion.header>
      <main className="flex-1 pt-16">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AIFeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>)
  );
}

function HeroSection() {
  return (
    (<section className="w-full py-12 md:py-24 lg:py-32 bg-diginews-blue text-white">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Il Tuo Compagno di Notizie Automatizzato
            </h1>
            <p className="mx-auto max-w-[700px] text-white/70 md:text-xl">
              Resta informato e controlla il tuo consumo e la pubblicazione di notizie senza sforzo con DIGINEWS.
            </p>
          </div>
          <motion.div
            className="space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}>
            <Button className="bg-diginews-green hover:bg-diginews-green/90 text-white">Inizia Ora</Button>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-diginews-blue">
              Scopri di Più
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>)
  );
}

function FeaturesSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    (<section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-diginews-blue">
          Caratteristiche Principali
        </motion.h2>
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Rss className="h-10 w-10" />}
            title="Recupero RSS Orario"
            description="Controlla automaticamente i tuoi feed RSS sottoscritti ogni ora per nuovi articoli." />
          <FeatureCard
            icon={<Bell className="h-10 w-10" />}
            title="Notifiche Istantanee"
            description="Ricevi notifiche immediate per nuovi contenuti sul tuo dispositivo." />
          <FeatureCard
            icon={<Edit className="h-10 w-10" />}
            title="Modifica Contenuti con IA"
            description="Modifica contenuti, scegli categorie e aggiungi immagini con l'assistenza dell'IA." />
          <FeatureCard
            icon={<Clock className="h-10 w-10" />}
            title="Pubblicazione Personalizzabile"
            description="Programma le pubblicazioni e controlla i tuoi contenuti con flessibilità." />
          <FeatureCard
            icon={<LayoutDashboard className="h-10 w-10" />}
            title="Dashboard Intuitiva"
            description="Gestisci facilmente feed, traccia notifiche e modifica articoli." />
          <FeatureCard
            icon={<Newspaper className="h-10 w-10" />}
            title="Personalizzazione"
            description="DIGINEWS si adatta alle tue preferenze per suggerimenti migliori nel tempo." />
        </motion.div>
      </div>
    </section>)
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    (<motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-4 text-diginews-green">{icon}</div>
      <h3 className="text-lg font-bold mb-2 text-diginews-blue">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>)
  );
}

function HowItWorksSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    (<section
      id="how-it-works"
      className="w-full py-12 md:py-24 lg:py-32 bg-diginews-gray">
      <div className="container px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-diginews-blue">
          Come Funziona
        </motion.h2>
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            number={1}
            title="Iscriviti ai Feed RSS"
            description="Aggiungi le tue fonti di notizie preferite a DIGINEWS." />
          <StepCard
            number={2}
            title="Ricevi Notifiche"
            description="Vieni avvisato quando sono disponibili nuovi contenuti." />
          <StepCard
            number={3}
            title="Modifica e Pubblica"
            description="Perfeziona i contenuti con l'IA e pubblicali sul tuo giornale online." />
        </motion.div>
      </div>
    </section>)
  );
}

function StepCard({ number, title, description }) {
  return (
    (<motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center text-center">
      <div
        className="rounded-full bg-diginews-green text-white w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2 text-diginews-blue">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>)
  );
}

function AIFeaturesSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      title: "Cura Intelligente dei Contenuti",
      description: "La nostra IA analizza le tue abitudini di lettura per offrirti feed di notizie personalizzati.",
      icon: "🧠",
    },
    {
      title: "Riassunti Automatizzati",
      description: "Ottieni sintesi concise di articoli lunghi, risparmiando tempo e fatica.",
      icon: "📝",
    },
    {
      title: "Analisi del Sentimento",
      description: "Comprendi il tono e il pregiudizio degli articoli a colpo d'occhio.",
      icon: "🎭",
    },
    {
      title: "Supporto Multilingua",
      description: "Traduci istantaneamente gli articoli nella tua lingua preferita.",
      icon: "🌐",
    },
  ]

  return (
    (<section id="ai-features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12">
          <h2
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-diginews-blue mb-4">
            Esperienza di Notizie Potenziata dall'IA
          </h2>
          <p className="text-gray-600 md:text-lg max-w-3xl mx-auto">
            Sfrutta il potere dell'intelligenza artificiale per rivoluzionare il tuo consumo e la creazione di notizie.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-diginews-gray rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-diginews-blue">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center">
          <Button className="bg-diginews-green hover:bg-diginews-green/90 text-white">
            Esplora le Funzionalità IA
          </Button>
        </motion.div>
      </div>
    </section>)
  );
}

function CTASection() {
  return (
    (<section className="w-full py-12 md:py-24 lg:py-32 bg-diginews-blue text-white">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Pronto a Trasformare la Tua Esperienza di Notizie?
            </h2>
            <p className="mx-auto max-w-[700px] text-white/70 md:text-xl">
              Unisciti a DIGINEWS oggi e prendi il controllo del tuo consumo e della pubblicazione di notizie.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
              <Input
                className="flex-1 bg-white/10 border-0 placeholder:text-white/60 text-white"
                placeholder="Inserisci la tua email"
                type="email" />
              <Button
                type="submit"
                className="bg-diginews-green hover:bg-diginews-green/90 text-white">
                Inizia
              </Button>
            </form>
            <p className="text-xs text-white/70">
              Iscrivendoti, accetti i nostri{" "}
              <Link className="underline underline-offset-2 hover:text-white" href="#">
                Termini e Condizioni
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>)
  );
}

function Footer() {
  return (
    (<footer
      className="w-full py-6 bg-diginews-blue text-white border-t border-white/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col gap-2 sm:flex-row items-center">
          <p className="text-xs text-white/70">© 2024 DIGINEWS. Tutti i diritti riservati.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:text-white/80 transition-colors" href="#">
              Termini di Servizio
            </Link>
            <Link className="text-xs hover:text-white/80 transition-colors" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>)
  );
}

