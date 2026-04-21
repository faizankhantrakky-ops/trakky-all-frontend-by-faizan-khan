
import React from 'react'
import SalonPageHeroComponent from './salonPageHeroComponent'
import SalonFeaturesSection from './salonFeaturesSection'
import WhyChooseUs from './salonWhyChooseUs'
import SalonUseCaseSection from './salonUseCaseSection'
import SalonPageTestimonialSection from './salonTestimonialSection'
import SalonCTASection from './salonCTASection'
import SalonFAQSection from './salonFaQSection'

// -----------------------------------------------

const SalonPageComponent = () => {
    return (
        <>
            <SalonPageHeroComponent />
            <SalonFeaturesSection />
            <WhyChooseUs />
            {/* <SalonUseCaseSection /> */}
            <SalonPageTestimonialSection />
            {/* <SalonCTASection /> */}
            <SalonFAQSection />
        </>
    )
}

export default SalonPageComponent
