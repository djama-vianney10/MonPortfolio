// src/app/(public)/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Code, Sparkles, Zap, Download, Briefcase, FolderKanban, Award, GraduationCap, Calendar, MapPin } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function HomePage() {
  // Données des statistiques
  const statistics = [
    {
      icon: Briefcase,
      value: '3+',
      label: 'Années d\'expérience',
      color: 'blue'
    },
    {
      icon: FolderKanban,
      value: '8+',
      label: 'Projets réalisés',
      color: 'purple'
    },
    {
      icon: Award,
      value: '10+',
      label: 'Technologies maîtrisées',
      color: 'green'
    }
  ]

  // Données des formations
  const formations = [
    {
      title: 'BTS en Informatique Développeur D Apllications Web',
      institution: 'Université/École',
      year: '2022',
      type: 'Diplôme'
    },
    {
      title: 'Certification Software Developpment with competence IA',
      institution: 'Gomycode',
      year: '2025',
      type: 'Certification'
    },
    {
      title: 'Formation React & Next.js',
      institution: 'Gomycode',
      year: '2023',
      type: 'Formation'
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container-fluid md:container mx-auto px-4 sm:px-6 lg:px-8 xl:container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Colonne gauche - Contenu */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-block mb-6"
              >
                <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                  👋 Welcome to my portfolio ! Je suis Djama Anthony Vianney
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
                Building Digital
                <span className="text-gradient block mt-2">Experiences</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
                Full-Stack Developer crafting modern, scalable, and beautiful web applications with cutting-edge technologies.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/projects">
                  <Button size="lg" className="group">
                    View Projects
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Get in Touch
                  </Button>
                </Link>
                <a href="/CV-DjamaVianney.pdf" download="Djama_Anthony_Vianney_CV.pdf">
                  <Button size="lg" variant="outline" className="group">
                    <Download className="mr-2 group-hover:translate-y-0.5 transition-transform" size={20} />
                    Télécharger mon CV
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Colonne droite - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:flex items-center justify-center relative"
            >
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <img
                  src="/images/hero-photo.jfif"
                  alt="Djama Vianney"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-10 -left-10 text-blue-500 opacity-20"
              >
                <Code size={60} />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute bottom-10 -right-10 text-purple-500 opacity-20"
              >
                <Sparkles size={60} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                  <stat.icon className={`text-${stat.color}-600 dark:text-${stat.color}-400`} size={32} />
                </div>
                <h3 className="text-5xl font-bold mb-2 text-gray-900 dark:text-white">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                À propos de moi
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Passionné par le développement web et les technologies modernes, je suis <strong>développeur Full-Stack</strong> spécialisé dans la création d'applications web performantes et élégantes. Avec plus de 3 ans d'expérience, j'ai eu l'opportunité de travailler sur des projets variés, allant de sites vitrines à des applications complexes.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Mon expertise couvre l'ensemble du cycle de développement : de la conception de l'architecture backend avec <strong>Node.js</strong> et <strong>PostgreSQL</strong>, jusqu'à la création d'interfaces utilisateur modernes avec <strong>React</strong>, <strong>Next.js</strong> et <strong>Tailwind CSS</strong>. Je privilégie les bonnes pratiques de développement, la qualité du code et l'optimisation des performances.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Actuellement, je recherche de nouvelles opportunités pour mettre mes compétences au service de projets ambitieux et contribuer à la réussite d'une équipe dynamique. Je suis particulièrement intéressé par les projets qui combinent innovation technique et impact utilisateur.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Domaines d'expertise
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {['Frontend Development', 'Backend Development', 'Base de données', 'DevOps & Cloud', 'UI/UX Design', 'Architecture logicielle'].map((domain) => (
                    <div key={domain} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-gray-700 dark:text-gray-300">{domain}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Ce que je fais de mieux
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Spécialisé dans la création d'expériences digitales exceptionnelles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formations & Certifications Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Formations & Certifications
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Mon parcours académique et mes certifications professionnelles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {formations.map((formation, index) => (
              <motion.div
                key={formation.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="text-white" size={24} />
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full">
                    {formation.type}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {formation.title}
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin size={16} className="mr-2 flex-shrink-0" />
                    <span>{formation.institution}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar size={16} className="mr-2 flex-shrink-0" />
                    <span>{formation.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: Code,
    title: 'Clean Code',
    description: 'Écriture de code maintenable, évolutif et bien documenté en suivant les meilleures pratiques du secteur.',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimisation des applications pour la vitesse et l\'efficacité afin de délivrer des expériences utilisateur exceptionnelles.',
  },
  {
    icon: Sparkles,
    title: 'Modern Design',
    description: 'Création d\'interfaces belles et responsives avec une attention particulière aux détails et à l\'expérience utilisateur.',
  },
]