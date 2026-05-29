import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { StatsBar } from '@/components/landing/StatsBar'
import { BentoFeatures } from '@/components/landing/BentoFeatures'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { DashboardPreview } from '@/components/landing/DashboardPreview'
import { CliSection } from '@/components/landing/CliSection'
import { AiWorkflowSection } from '@/components/landing/AiWorkflowSection'
import { CTASection } from '@/components/landing/CTASection'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-base">
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <BentoFeatures />
        <HowItWorks />
        <DashboardPreview />
        <CliSection />
        <AiWorkflowSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
