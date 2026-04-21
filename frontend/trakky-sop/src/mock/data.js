import {
    CompLogo1,
    CompLogo10,
    CompLogo2,
    CompLogo3,
    CompLogo4,
    CompLogo5,
    CompLogo6,
    CompLogo7,
    CompLogo8,
    CompLogo9,
    FeatureClientManagement,
    FeatureDashboard,
    FeatureExpenseManagement,
    FeatureInventoryManagement,
    FeatureInvoice,
    FeatureMiniWebsite,
    FeatureNotification,
    FeatureOneOver1,
    FeatureOnlineAppointment,
    FeatureStaffManagement,
    HomeFeatureOneBg,
    SalonPageFeatureAppointment,
    SalonPageFeatureMembership,
    SalonPageFeatureMiniwebsite,
    SalonPageFeatureStaff
} from "@/assets";

// mock/data.js

export const NavbarData = [
  { title: "Salon", url: "/salon" },
//   { title: "BarberShop", url: "/barbershop" },   // ✅ New Menu Added
  { title: "Features", url: "/features", hasMegaMenu: true },
  { title: "Pricing", url: "/pricing" },
  { title: "Blog", url: "https://blogs.trakky.in/" }
];


// export const FeaturesData = [
//     {
//         id: 1,
//         title: "Appointment & Staff Management",
//         desc: "Manage bookings, staff schedules, staff profiles, and commissions effortlessly to keep your salon running smoothly.",
//         img: FeatureDashboard,
//         badges: ["Analytics", "Insights", "Real-time"],
//         backgroundImg: HomeFeatureOneBg,
//         overlayImg: [FeatureOneOver1]
//     },
//     {
//         id: 2,
//         title: "Customer Engagement & Loyalty",
//         desc: "Track customer journeys, memberships, feedback, tips, and salon credits to boost loyalty and repeat visits.",
//         img: FeatureInvoice,
//         badges: ["Quick", "Professional", "PDF"],
//         backgroundImg: FeatureOneOver1,
//         overlayImg: [HomeFeatureOneBg]
//     },
//     {
//         id: 3,
//         title: "Sales & Billing",
//         desc: "Handle billing, payments, prepaid cards, service packages, and smart discounts efficiently with a seamless POS interface.",
//         img: FeatureNotification,
//         badges: ["Alerts", "Reminders", "Logs"],
//         backgroundImg: HomeFeatureOneBg,
//         overlayImg: [FeatureOneOver1]
//     },
//     {
//         id: 4,
//         title: "Inventory & Stock Control",
//         desc: "Monitor stock, manage shrinkage, and maintain smart inventory controls to optimize your salon operations.",
//         img: FeatureOnlineAppointment,
//         badges: ["24/7", "Easy", "Convenient"],
//         backgroundImg: FeatureOneOver1,
//         overlayImg: [HomeFeatureOneBg]
//     },
//     {
//         id: 5,
//         title: "Digital & Mobile Access",
//         desc: "Access your salon anywhere with all in one Trakky web platform.",
//         img: FeatureInventoryManagement,
//         badges: ["Stock", "Tracking", "Reports"],
//         backgroundImg: HomeFeatureOneBg,
//         overlayImg: [FeatureOneOver1]
//     },
//     {
//         id: 6,
//         title: "Marketing & Communication",
//         desc: "Send SMS & WhatsApp updates, promotions, and reminders directly to your customers to increase engagement.",
//         img: FeatureClientManagement,
//         badges: ["Profiles", "History", "Preferences"],
//         backgroundImg: FeatureOneOver1,
//         overlayImg: [HomeFeatureOneBg]
//     }
// ]

export const FeaturesData = [
    {
        id: 1,
        title: "Appointment Booking",
        desc: "Easily book and manage salon appointments, streamline schedules, reduce no-shows, and offer clients a seamless booking experience.",
        img: FeatureDashboard,
        badges: ["Booking", "Scheduling", "Reminders"],
        backgroundImg: HomeFeatureOneBg,
        overlayImg: [FeatureOneOver1],
    },
    {
        id: 2,
        title: "Mini Website",
        desc: "Showcase your salon online with a mini website — highlight services, share contact details, and let clients book appointments effortlessly.",
        img: FeatureDashboard,
        badges: ["Online Presence", "Branding", "SEO"],
        backgroundImg: FeatureOneOver1,
        overlayImg: [HomeFeatureOneBg],
    },
    {
        id: 3,
        title: "Customer Feedback",
        desc: "Collect and analyze customer feedback to improve salon services, enhance client satisfaction, and build lasting trust.",
        img: FeatureDashboard,
        badges: ["Feedback", "Insights", "Satisfaction"],
        backgroundImg: HomeFeatureOneBg,
        overlayImg: [FeatureOneOver1],
    },
    {
        id: 4,
        title: "Membership Plans",
        desc: "Offer flexible membership plans to reward loyal clients, increase repeat visits, and boost your salon’s revenue.",
        img: FeatureDashboard,
        badges: ["Loyalty", "Rewards", "Retention"],
        backgroundImg: FeatureOneOver1,
        overlayImg: [HomeFeatureOneBg],
    },
    {
        id: 5,
        title: "Service Packages",
        desc: "Create attractive service packages to offer more value, attract new clients, and increase salon sales.",
        img: FeatureDashboard,
        badges: ["Offers", "Packages", "Sales"],
        backgroundImg: HomeFeatureOneBg,
        overlayImg: [FeatureOneOver1],
    },
    {
        id: 6,
        title: "Prepaid Cards & Wallet",
        desc: "Enable prepaid cards and wallets to let clients pay in advance, enjoy seamless transactions, and boost salon loyalty.",
        img: FeatureDashboard,
        badges: ["Prepaid", "Wallet", "Payments"],
        backgroundImg: FeatureOneOver1,
        overlayImg: [HomeFeatureOneBg],
    },
    {
        id: 7,
        title: "Staff Profiles",
        desc: "Manage detailed staff profiles to track skills, schedules, and performance, ensuring your salon team delivers top-quality service.",
        img: FeatureDashboard,
        badges: ["Profiles", "Performance", "Team"],
        backgroundImg: HomeFeatureOneBg,
        overlayImg: [FeatureOneOver1],
    },
    {
        id: 8,
        title: "Staff Scheduling",
        desc: "Effortlessly manage staff schedules, shifts, and availability to ensure smooth salon operations and optimal team productivity.",
        img: FeatureDashboard,
        badges: ["Shifts", "Planning", "Efficiency"],
        backgroundImg: FeatureOneOver1,
        overlayImg: [HomeFeatureOneBg],
    },
    {
        id: 9,
        title: "Tips Management",
        desc: "Easily track and manage staff tips to ensure transparent earnings and motivate your salon team for better performance.",
        img: FeatureDashboard,
        badges: ["Tips", "Transparency", "Motivation"],
        backgroundImg: HomeFeatureOneBg,
        overlayImg: [FeatureOneOver1],
    },
    {
        id: 10,
        title: "Payroll & Commission",
        desc: "Simplify payroll and commission tracking — manage staff salaries, incentives, and bonuses accurately to keep your salon team motivated.",
        img: FeatureDashboard,
        badges: ["Payroll", "Commission", "Bonuses"],
        backgroundImg: FeatureOneOver1,
        overlayImg: [HomeFeatureOneBg],
    },
    {
        id: 11,
        title: "Queue Kiosk",
        desc: "Manage walk-in clients efficiently with a Queue Kiosk — let them join the waiting list even if appointment slots are full, ensuring smooth salon flow.",
        img: FeatureDashboard,
        badges: ["Walk-ins", "Queue", "Automation"],
        backgroundImg: HomeFeatureOneBg,
        overlayImg: [FeatureOneOver1],
    },
    {
        id: 12,
        title: "Stock Control",
        desc: "Monitor stock levels and get alerts for low inventory with Stock Control — ensure your salon never runs out of essential products.",
        img: FeatureDashboard,
        badges: ["Inventory", "Alerts", "Supplies"],
        backgroundImg: FeatureOneOver1,
        overlayImg: [HomeFeatureOneBg],
    },
    {
        id: 13,
        title: "Shrinkage Tracking",
        desc: "Track and monitor your salon inventory with Shrinkage Tracking — know exactly how much stock is available and prevent losses effectively.",
        img: FeatureDashboard,
        badges: ["Inventory", "Loss Prevention", "Tracking"],
        backgroundImg: HomeFeatureOneBg,
        overlayImg: [FeatureOneOver1],
    },
    {
        id: 14,
        title: "Smart Discounts",
        desc: "Offer flat and instant discounts at checkout with Smart Discounts — boost sales and delight your salon clients instantly.",
        img: FeatureDashboard,
        badges: ["Discounts", "Offers", "Sales"],
        backgroundImg: FeatureOneOver1,
        overlayImg: [HomeFeatureOneBg],
    },
    {
        id: 15,
        title: "SMS & WhatsApp",
        desc: "Send instant SMS and WhatsApp messages — remind clients of appointments, share promotions, and keep your salon engagement high.",
        img: FeatureDashboard,
        badges: ["Messages", "Promotions", "Reminders"],
        backgroundImg: HomeFeatureOneBg,
        overlayImg: [FeatureOneOver1],
    },
    {
        id: 16,
        title: "Multi-Device Support",
        desc: "Accessible on all devices — manage your salon seamlessly from desktop, tablet, or smartphone anytime, anywhere.",
        img: FeatureDashboard,
        badges: ["Web", "Tablet", "Mobile"],
        backgroundImg: FeatureOneOver1,
        overlayImg: [HomeFeatureOneBg],
    },
    {
        id: 17,
        title: "Customer Journey",
        desc: "Enhance your salon’s customer journey — track client interactions, personalize experiences, and build lasting loyalty effortlessly.",
        img: FeatureDashboard,
        badges: ["Journey", "Experience", "Loyalty"],
        backgroundImg: HomeFeatureOneBg,
        overlayImg: [FeatureOneOver1],
    },
    {
        id: 18,
        title: "Billing & Payments",
        desc: "Simplify salon billing and payments — generate invoices, accept multiple payment methods, and provide a smooth checkout experience for clients.",
        img: FeatureDashboard,
        badges: ["Billing", "Payments", "POS"],
        backgroundImg: FeatureOneOver1,
        overlayImg: [HomeFeatureOneBg],
    },
];


export const HowItWorksStepsData = [
    {
        title: "Sign Up Instantly",
        desc: "Create your account in minutes and start using the best salon software in India. No complicated setup just a quick and secure sign-up process to kickstart your digital salon journey.",
        icon: "mdi:account-plus-outline",
    },
    {
        title: "Set Up Your Salon Business",
        desc: "Easily configure your salon details, add staff members, and list your services. With Trakky’s online salon booking system, you can showcase services, manage prices, and personalize customer offerings.",
        icon: "mdi:office-building-marker",
    },
    {
        title: "Manage Daily Operations Effortlessly",
        desc: "From appointment scheduling to POS billing, Trakky simplifies everyday salon tasks. Track invoices, manage staff performance, and control inventory in real time all from one powerful dashboard.",
        icon: "mdi:clipboard-text-outline",
    },
    {
        title: " Grow Your Salon Faster",
        desc: "Scale your salon with ease. Analyze detailed reports, run marketing campaigns, and engage clients through SMS, email, and WhatsApp. With Trakky’s salon automation tools, you’ll boost client loyalty and revenue in no time.",
        icon: "mdi:trending-up",
    },
];

export const OurPartnerLogoData = [
    CompLogo1,
    CompLogo2,
    CompLogo3,
    CompLogo4,
    CompLogo5,
    CompLogo6,
    CompLogo7,
    CompLogo8,
    CompLogo9,
    CompLogo10
]

export const TestimonialData = [
  {
    name: "Priya Sharma, Ahmedabad",
    role: "Salon Owner",
    img: "https://media.licdn.com/dms/image/v2/D5603AQGkh0-gWLo_eQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1723901626766?e=2147483647&v=beta&t=cDwDEXkQsNjKH2jgf35O7vB-hhKfpNnaeveal4hvsVg",
    quote:
      "Trakky POS has completely simplified how I handle bookings and staff schedules. It’s smooth, reliable, and my clients love the easy experience!",
  },
  {
    name: "Rohit Mehta, Ahmedabad",
    role: "Salon Owner",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQHHtmtoaae2Ew/profile-displayphoto-shrink_200_200/B4DZWNht7HHIAc-/0/1741836182008?e=2147483647&v=beta&t=3-iWT-G77ktW2HsBsN8FrhL7aopzWAQVo_ZB58lezKQ",
    quote:
      "Tracking clients, payments, and appointments is now effortless. Trakky POS truly helps my salon run better and grow faster.",
  },
  {
    name: "Sneha Patel, Ahmedabad",
    role: "Beauty Expert",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQG-6bbxiU8Pdg/profile-displayphoto-scale_200_200/B4DZnsW.9hKsAc-/0/1760607073738?e=2147483647&v=beta&t=C9Ul0xUESgWfj5l_Usx-q26Q5ZONu9xwcVK1yaz3S6M",
    quote:
      "The platform is super easy to use and lets me focus more on my clients instead of paperwork. I recommend Trakky to every beauty professional!",
  },
  {
    name: "Arjun Nair, Ahmedabad",
    role: "Salon Owner",
    img: "https://media.licdn.com/dms/image/v2/D5603AQHYX3hhY6je2A/profile-displayphoto-shrink_200_200/B56ZckctrvGoAY-/0/1748663197648?e=2147483647&v=beta&t=SnN_-5aboUnLId0bZsDdyafMtnQllnXoJqfnumhbtpU",
    quote:
      "From customer support to features, everything about Trakky is top-notch. It keeps our salon organized and helps us deliver a better experience every day.",
  },
];


export const PricingPlansData = [
    // {
    //     id: 1,
    //     name: "Starter Plan",
    //     desc: "Ideal for small salons or beauty businesses just getting started, the Starter Plan includes everything you need to manage sales and inventory efficiently.",
    //     price: "$29/mo",
    //     features: [
    //         "Basic POS features to handle sales",
    //         "Easy inventory tracking",
    //         "1 staff account with access permissions",
    //         "Reliable email support for quick assistance",
    //     ],
    //     extra: "Small shops, cafes, and startups looking for an affordable, reliable POS solution.",
    // },
    // {
    //     id: 2,
    //     name: "Professional Plan",
    //     desc: "Ideal for growing businesses, the Professional plan provides advanced tools and more flexibility to help you scale.",
    //     price: "$59/mo",
    //     features: [
    //         "Includes all Starter Plan features",
    //         "In-depth analytics for smarter business decisions",
    //         "5 staff accounts with role-based access and management",
    //         "Seamless integrations with third-party apps and tools",
    //     ],
    //     extra: "Retail stores, restaurants, salons, and service businesses looking to expand staff, improve operations, and gain actionable insights.",
    // },
    {
        id: 3,
        // name: "Enterprise Plan",
        desc: "Designed for large salons, multi-location chains, and beauty salon, the Plan provides customized POS and salon management solutions tailored to your business needs.",
        price: "Custom Pricing",
        features: [
            "All Professional Plan features included",
            "Unlimited staff accounts and users",
            "Dedicated account manager for premium support",
            "Tailored integrations with your existing systems",
        ],
        extra: "Large salon chains, franchises, and beauty businesses seeking scalable, fully customized management software.",
    },
];

export const SalonFeaturesData = [
    {
        title: "Smart Appointments",
        desc: "Accept online bookings 24/7 with automated SMS, email & WhatsApp.",
        icon: "mdi:calendar-clock",
        img: SalonPageFeatureAppointment,
        details: [
            "Online + Walk-in booking",
            "Auto reminders on WhatsApp/SMS",
            "No-shows reduced by 40%",
        ],
    },
      {
        title: "Loyalty & Memberships",
        desc: "Reward repeat customers with points, packages & store credits.",
        icon: "mdi:card-account-details-star",
        img: SalonPageFeatureMembership,
        details: [
            "Custom membership packages",
            "Discounts & seasonal offers",
            "Retention-focused programs",
        ],
    },
    {
        title: "Staff Scheduling",
        desc: "Assign shifts, track commissions & payroll in one place.",
        icon: "mdi:account-group",
        img: SalonPageFeatureStaff,
        details: [
            "Shift planning & leave tracking",
            "Performance insights",
            "Boost productivity by 25%",
        ],
    },
  
    {
        title: "Mini Website",
        desc: "Get your own salon booking site within minutes to grow your digital",
        icon: "mdi:web",
        img: SalonPageFeatureMiniwebsite,
        details: [
            "Mobile-friendly design",
            "Salon branding included",
            "24/7 online bookings",
        ],
    },
];

export const BenefitsSalonPage = [
    {
        title: "Save Time & Boost Productivity",
        desc: "Automate appointments, invoices, and staff schedules so you focus more on clients and less on paperwork.",
        icon: "mdi:clock-check-outline",
        img: FeatureDashboard,
    },
    {
        title: "Grow Customer Loyalty",
        desc: "Engage with your clients using memberships, packages, offers, and personalized notifications that keep them coming back.",
        icon: "mdi:heart-outline",
        img: FeatureDashboard,
    },
    {
        title: "Simplify Staff & Inventory",
        desc: "Track inventory, manage staff performance, and control expenses—all from a single, easy-to-use dashboard.",
        icon: "mdi:account-cog-outline",
        img: FeatureDashboard,
    },
];

export const UseCasesSalonPageData = [
    {
        id: 1,
        title: "Hair Salons",
        desc: "Manage bookings, billing, and staff with Trakky – the best salon management software in India for modern hair salons. Grow your clientele with online appointments and loyalty programs.",
        icon: "streamline-freehand:copy-paste-cut-scissors",
        img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    },
    {
        id: 2,
        title: "Wellness",
        desc: " Simplify operations with Trakky’s all-in-one management software. From scheduling therapies to managing memberships, deliver a seamless wellness experience.",
        icon: "iconoir:yoga",
        img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    },
    {
        id: 3,
        title: "Nails Studios",
        desc: "Trakky makes running nail studios effortless with smart appointment booking, staff scheduling, and client tracking. Boost customer loyalty and grow your business faster.",
        icon: "icon-park-outline:nail-polish",
        img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    },
    {
        id: 4,
        title: "Beauty Clinics",
        desc: "Enhance client satisfaction with Trakky’s beauty clinic software. Manage treatments, billing, and patient records easily while focusing on delivering premium care.",
        icon: "fluent:sparkle-16-regular",
        img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    },
];

// export const TestimonialsSalonPageData = [
//     {
//         id: 1,
//         name: "Priya Sharma",
//         position: "Salon Owner, Mumbai",
//         text: "Trakky transformed how we manage our salon! Appointments are seamless, and our clients love the automated reminders. Revenue increased by 35% in just 3 months! 🚀",
//         avatar: "https://i.pravatar.cc/150?img=47",
//         color: "from-purple-500 to-purple-600",
//         position_style: "left"
//     },
//     {
//         id: 2,
//         name: "Rahul Mehta",
//         position: "Spa Manager, Delhi",
//         text: "The loyalty program feature is a game-changer! Our repeat customers doubled, and the mini website brought us online effortlessly. Highly recommend! ✨",
//         avatar: "https://i.pravatar.cc/150?img=12",
//         color: "from-blue-500 to-blue-600",
//         position_style: "right"
//     },
    // {
    //     id: 3,
    //     name: "Anjali Verma",
    //     position: "Beauty Clinic, Bangalore",
    //     text: "Staff scheduling became so easy with Trakky. No more confusion about shifts, and performance tracking helps us reward our best team members! 💪",
    //     avatar: "https://i.pravatar.cc/150?img=32",
    //     color: "from-pink-500 to-pink-600",
    //     position_style: "left"
    // },
//     {
//         id: 4,
//         name: "Vikram Singh",
//         position: "Nail Studio Owner, Pune",
//         text: "Best decision for my business! Quick bookings, instant invoices, and the dashboard gives me complete control. Customer satisfaction is at an all-time high! 🎯",
//         avatar: "https://i.pravatar.cc/150?img=15",
//         color: "from-green-500 to-green-600",
//         position_style: "right"
//     },
//     {
//         id: 5,
//         name: "Sneha Patel",
//         position: "Hair Salon, Ahmedabad",
//         text: "Trakky made managing my salon stress-free. The analytics help me make better decisions, and clients appreciate the professional booking experience! 💯",
//         avatar: "https://i.pravatar.cc/150?img=45",
//         color: "from-indigo-500 to-indigo-600",
//         position_style: "left"
//     },
// ]

export const SalonFAQData = [
    {
        id: 1,
        question: "How does Trakky help manage appointments?",
        answer:
            "Trakky offers an online booking system with SMS & WhatsApp reminders to reduce no-shows.",
    },
    {
        id: 2,
        question: "Can I track my salon’s performance?",
        answer:
            " Yes! Trakky provides real-time reports, sales tracking & staff performance analytics.",
    },
    {
        id: 3,
        question: " Is Trakky suitable for all salon sizes?",
        answer:
            "Absolutely. Whether you run a small studio or a chain of luxury salons, Trakky scales with your business.",
    },
    {
        id: 4,
        question: "Do you offer customer support?",
        answer:
            " Yes, our team provides dedicated support to ensure smooth operations.",
    },
    {
        id: 5,
        question: "Is there a free trial available?",
        answer:
            " Yes, get started with a free demo and explore the platform.",
    },
];

export const FooterSocialIcons = [
    { icon: "mdi:google", url: "https://g.co/kgs/spvB6L" },
    { icon: "mdi:instagram", url: "https://www.instagram.com/trakky_india/" },
    { icon: "mdi:twitter", url: "https://x.com/trakky5" },
    { icon: "mdi:whatsapp", url: "https://api.whatsapp.com/send?phone=916355167304&text=Hi%2C%0AI%27m%20looking%20for%20salon%20services.%20Can%20you%20please%20suggest%20me%20salons%20in%20the%20area%2C%20along%20with%20their%20contact%20information.%0AI%27m%20also%20interested%20to%20get%20offers%20details!%0A%0AI%20am%20waiting%20for%20response.%0A%0AThanks." },
];