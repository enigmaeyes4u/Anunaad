import bcrypt from 'bcryptjs';
import { User, Artist, ArtForm, Offering, Experience, PlatformSettings, CmsContent } from './types.js';

// Pre-hashed password for "Anunaad@2026"
// Generated using bcrypt.hashSync('Anunaad@2026', 10)
export const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('Anunaad@2026', 10);

export const SEED_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Devavrat Sen',
    email: 'admin@anunaad.org',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    phone: '+91 98101 23456',
    bio: 'Founder & Cultural Archivist, ANUNAAD Foundation',
    mfaEnabled: true,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-content-1',
    name: 'Ananya Deshmukh',
    email: 'curator@anunaad.org',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'content_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    phone: '+91 98202 34567',
    bio: 'Senior Oral Traditions Editor',
    mfaEnabled: false,
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'user-raghunath',
    name: 'Ustad Raghunath Manganiyar',
    email: 'raghunath.maand@anunaad.org',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'artist',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
    phone: '+91 94141 87654',
    bio: 'Maand vocal master & Kamaicha exponent from the Thar desert',
    mfaEnabled: false,
    createdAt: '2026-02-01T00:00:00.000Z'
  },
  {
    id: 'user-kamala',
    name: 'Kamala Devi Jha',
    email: 'kamala.mithila@anunaad.org',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'artist',
    avatar: 'https://images.unsplash.com/photo-1582233479366-6d38bc390a08?q=80&w=600&auto=format&fit=crop',
    phone: '+91 98350 11223',
    bio: 'Master Mithila / Madhubani muralist and natural dye painter',
    mfaEnabled: false,
    createdAt: '2026-02-05T00:00:00.000Z'
  },
  {
    id: 'user-gouranga',
    name: 'Gouranga Das Baul',
    email: 'gouranga.baul@anunaad.org',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'artist',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
    phone: '+91 94340 55667',
    bio: 'Wandering Baul mystic and master of the acoustic Ektara and Dotara',
    mfaEnabled: false,
    createdAt: '2026-02-10T00:00:00.000Z'
  },
  {
    id: 'user-teejan',
    name: 'Teejan Devi Sahu',
    email: 'teejan.pandavani@anunaad.org',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'artist',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=600&auto=format&fit=crop',
    phone: '+91 98261 99887',
    bio: 'Kapalik style Pandavani epic narrator, carrying Mahabharata oral verses',
    mfaEnabled: false,
    createdAt: '2026-02-14T00:00:00.000Z'
  },
  {
    id: 'user-learner-1',
    name: 'Aarav Sharma',
    email: 'aarav@gmail.com',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    phone: '+91 98111 55443',
    bio: 'Music student & cultural documentary enthusiast based in Bengaluru',
    mfaEnabled: false,
    createdAt: '2026-02-20T00:00:00.000Z'
  },
  {
    id: 'user-gafur',
    name: 'Padma Shri Abdul Gafur Khatri',
    email: 'gafur.rogan@anunaad.org',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'artist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    phone: '+91 94269 12345',
    bio: 'Padma Shri recipient & 8th generation master of 400-year-old Kutch Rogan castor oil textile art',
    mfaEnabled: false,
    createdAt: '2026-02-15T00:00:00.000Z'
  },
  {
    id: 'user-tarapada',
    name: 'Guru Tarapada Mahato',
    email: 'tarapada.chhau@anunaad.org',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'artist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
    phone: '+91 98321 77654',
    bio: 'Purulia Chhau master dancer and mask-making patriarch from Charida village',
    mfaEnabled: false,
    createdAt: '2026-02-16T00:00:00.000Z'
  },
  {
    id: 'user-bhabananda',
    name: 'Bhabananda Barbayan',
    email: 'bhabananda.sattriya@anunaad.org',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'artist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    phone: '+91 98640 44321',
    bio: 'Monastic master of Sattriya dance and Khol percussion from Uttar Kamalabari Sattra on Majuli Island',
    mfaEnabled: false,
    createdAt: '2026-02-17T00:00:00.000Z'
  },
  {
    id: 'user-chalapathi',
    name: 'Padma Shri Dalavai Chalapathi Rao',
    email: 'chalapathi.tholu@anunaad.org',
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: 'artist',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
    phone: '+91 94402 88990',
    bio: 'Padma Shri master shadow puppeteer and leather filigree craftsperson from Nimmalakunta',
    mfaEnabled: false,
    createdAt: '2026-02-18T00:00:00.000Z'
  }
];

export const SEED_ART_FORMS: ArtForm[] = [
  {
    id: 'art-maand',
    slug: 'maand',
    name: 'Maand',
    devanagari: 'मांड',
    category: 'music',
    region: 'Thar Desert & Marwar',
    state: 'Rajasthan',
    heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    shortDesc: 'A sophisticated classical-folk semi-classical vocal tradition born in the royal courts and arid sands of Rajasthan.',
    traditionStory: 'Maand is neither purely classical nor simple folk; it dwells in the twilight between the two. Traditionally sung by the Manganiyar and Langa communities to welcome weary caravan travelers or royal guests across the dunes of Jaisalmer and Jodhpur, it is characterized by deep emotional yearning (Viraha) and intricate vocal meends (glides).',
    historyContext: 'Documented in medieval Rajasthani court treatises from the 16th century, Maand evolved as royal bards adapted desert ballads to classical ragas like Bilawal and Khamaj.',
    communityPerspective: 'For the Manganiyar community, Maand is not an entertainment item; it is a sacred genealogy recited from father to son. Each musical inflection honors the desert wind and generational memory.',
    contemporaryPractice: 'Fewer than twenty senior masters retain the unadulterated microtonal variations of antique Maand. Modern adaptations exist, but authentic oral baithaks are increasingly rare.',
    audioSampleUrl: '/audio/maand_sarangi.wav',
    videoSampleUrl: 'https://www.youtube.com/embed/QD16Nf_IFMk',
    tags: ['Vocal', 'Thar Desert', 'Semi-Classical', 'Oral Tradition', 'Kamaicha'],
    createdAt: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'art-pandavani',
    slug: 'pandavani',
    name: 'Pandavani',
    devanagari: 'पंडवानी',
    category: 'storytelling',
    region: 'Chhattisgarh & Central Plains',
    state: 'Chhattisgarh',
    heroImage: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=80&w=1200&auto=format&fit=crop',
    shortDesc: 'Electrifying epic musical storytelling of the Mahabharata, enacted with a stringed Tambura, cymbals, and vocal fury.',
    traditionStory: 'Pandavani translates to "songs of the Pandavas". In the Kapalik branch, the lead storyteller leaps, chants, brandishes their Tambura as Bhima’s mace or Arjuna’s bow, accompanied by intense choral response (Ragi) and the rhythm of Kartal cymbals.',
    historyContext: 'Originating among the Gond and Pardhan tribal communities of Chhattisgarh, it preserved oral epics long before written manuscripts reached rural villages.',
    communityPerspective: 'The teller is seen as a conduit for ancestral bravery and moral reflection. The performances run all night in village courtyards during harvest seasons.',
    contemporaryPractice: 'Maintained by heroic performers, yet younger generations face migration away from rural villages, threatening the multi-day oral recitation repertoire.',
    audioSampleUrl: '/audio/pandavani_tambura.wav',
    videoSampleUrl: 'https://www.youtube.com/embed/Nw0VRYTgWm0',
    tags: ['Epic Storytelling', 'Mahabharata', 'Tambura', 'Oral History', 'Folk Theatre'],
    createdAt: '2026-01-11T00:00:00.000Z'
  },
  {
    id: 'art-chhau',
    slug: 'chhau',
    name: 'Chhau',
    devanagari: 'छऊ',
    category: 'dance',
    region: 'Eastern Plateau (Purulia & Mayurbhanj)',
    state: 'West Bengal / Jharkhand',
    heroImage: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1200&auto=format&fit=crop',
    shortDesc: 'A semi-classical martial dance famed for colossal theatrical masks, acrobatic somersaults, and thunderous Dhamsa percussion.',
    traditionStory: 'Dancers don enormous masks sculpted by local artisans from clay, cloth, and paper pulp in the artisan hamlet of Charida. The movements simulate ancient mock martial combats, leaps of tigers, and celestial battles between Durga and Mahishasura.',
    historyContext: 'Inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity in 2010. Evolved from indigenous military drills and temple rites.',
    communityPerspective: 'The mask makers and dancers share an inseparable symbiotic kinship. The mask is reverently worshipped before touching the performer’s brow.',
    contemporaryPractice: 'Performed enthusiastically during the Chaitra Parva festival, yet full-time livelihood for mask artisans remains precarious outside seasonal peaks.',
    audioSampleUrl: '/audio/chhau_drums.wav',
    videoSampleUrl: 'https://www.youtube.com/embed/QV2nvHaV6no',
    tags: ['Martial Dance', 'Mask Craft', 'Acrobatic', 'UNESCO Heritage', 'Dhamsa Drum'],
    createdAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'art-baul',
    slug: 'baul',
    name: 'Baul',
    devanagari: 'বাউল / बाउल',
    category: 'music',
    region: 'Bengal Delta & Rarh Region',
    state: 'West Bengal',
    heroImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    shortDesc: 'A non-conformist mystical philosophy and music tradition seeking the divine residing within every human soul (Moner Manush).',
    traditionStory: 'Dressed in saffron or patchwork robes (Alkhalla), Bauls travel from village to village playing the one-stringed Ektara, the carved Dotara, and ankle bells (Nupur). Their lyrics reject caste, religious dogma, and temple boundaries.',
    historyContext: 'Recognized by UNESCO in 2005. Rooted in medieval Tantric Sahajiya, Sufism, and Vaishnavism, and deeply influenced the poetry of Rabindranath Tagore.',
    communityPerspective: 'To a Baul, singing is not a performance for an audience; it is Deha-Tattva—a spiritual meditation through the breath and body.',
    contemporaryPractice: 'While Baul music has gained global fame, the underlying spiritual asceticism and oral guru-shishya transmission requires protection from commercial distortion.',
    audioSampleUrl: '/audio/baul_ektara.wav',
    videoSampleUrl: 'https://www.youtube.com/embed/Zu37jWgW660',
    tags: ['Mystic Philosophy', 'Ektara', 'Oral Poetry', 'Bengal', 'UNESCO Heritage'],
    createdAt: '2026-01-13T00:00:00.000Z'
  },
  {
    id: 'art-tholu-bommalata',
    slug: 'tholu-bommalata',
    name: 'Tholu Bommalata',
    devanagari: 'तोळु बोम्मलाटा',
    category: 'puppetry',
    region: 'Rayalaseema & Deccan',
    state: 'Andhra Pradesh',
    heroImage: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=1200&auto=format&fit=crop',
    shortDesc: 'Ancient shadow puppetry utilizing monumental, translucent goat-hide puppets illuminated by oil lamps against a white linen screen.',
    traditionStory: 'Puppets up to six feet tall with articulated joints are painted with natural vegetable dyes and perforated with delicate filigree needlework. Behind the illuminated screen, master puppeteers manipulate sticks while chanting epic dialogues in multiple character voices.',
    historyContext: 'Dating back to the 3rd century BCE under the Satavahana dynasty, it is one of India’s oldest surviving composite performance traditions.',
    communityPerspective: 'Puppeteers were wandering minstrels who mediated between scripture, local news, and satirical village humor. Every puppet is treated as an ensouled being.',
    contemporaryPractice: 'With the arrival of digital screens, the traditional night-long village performances have dwindled from hundreds of troupes to fewer than a dozen family lineages.',
    audioSampleUrl: '/audio/tholu_puppetry.wav',
    videoSampleUrl: 'https://www.youtube.com/embed/O23SXPXBReE',
    tags: ['Shadow Puppetry', 'Leather Craft', 'Epic Theatre', 'Filigree Work', 'Rare Art'],
    createdAt: '2026-01-14T00:00:00.000Z'
  },
  {
    id: 'art-sattriya',
    slug: 'sattriya',
    name: 'Sattriya',
    devanagari: 'सत्रीया',
    category: 'dance',
    region: 'Brahmaputra Valley (Majuli Island)',
    state: 'Assam',
    heroImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop',
    shortDesc: 'A classical dance form preserved inside Vaishnavite monasteries for five centuries, celebrated for sculptural grace and rhythmic purity.',
    traditionStory: 'Introduced in the 15th century by the saint-reformer Mahapurush Srimanta Sankardev, Sattriya was nurtured as a living prayer by celibate monks (Bhokots) in Sattras nestled on the river island of Majuli.',
    historyContext: 'Recognized as one of India’s official classical dance styles in the year 2000. It seamlessly integrates dance (Nritta), expressive theatre (Ankiya Nat), and traditional Khol drum rhythms.',
    communityPerspective: 'The dance retains a deeply contemplative character. Every hand mudra and foot strike is a conscious offering rather than a theatrical flourish.',
    contemporaryPractice: 'Now performed on global concert stages by both male and female practitioners, while the authentic monastic heritage continues in Majuli.',
    audioSampleUrl: '/audio/sattriya_flute.wav',
    videoSampleUrl: 'https://www.youtube.com/embed/AUnqW8p0t9I',
    tags: ['Classical Dance', 'Monastic Tradition', 'Majuli Island', 'Khol Drum', 'Assam'],
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'art-madhubani',
    slug: 'madhubani',
    name: 'Madhubani Painting',
    devanagari: 'मधुबनी / मिथिला चित्रकला',
    category: 'visual_art',
    region: 'Mithila Cultural Zone',
    state: 'Bihar',
    heroImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    shortDesc: 'Intricate geometric and naturalistic painting executed with bamboo twigs, nibs, and plant-derived pigments on handmade paper.',
    traditionStory: 'Practiced for centuries by women across Mithila villages on mud walls (Kohbar) during weddings and festivals. The style features stark double-line borders, hatching, fish, peacocks, celestial bodies, and deities depicted without empty space.',
    historyContext: 'First brought to broader documentation after the 1934 Bihar earthquake when British official William G. Archer uncovered stunning mural frescoes inside cracked domestic walls.',
    communityPerspective: 'The painting is an unspoken visual language of female blessings, fertility, ecological reverence, and community lore.',
    contemporaryPractice: 'While commercialized on textiles and souvenirs, authentic practitioners continue to gather minerals, flowers, and lampblack to grind natural organic colors by hand.',
    audioSampleUrl: '/audio/madhubani_folk.wav',
    videoSampleUrl: 'https://www.youtube.com/embed/IZqOxAHhZsQ',
    tags: ['Folk Painting', 'Natural Pigments', 'Women Lineage', 'Mithila', 'Sacred Geometry'],
    createdAt: '2026-01-16T00:00:00.000Z'
  },
  {
    id: 'art-rogan',
    slug: 'rogan-art',
    name: 'Rogan Art',
    devanagari: 'रोगन कला',
    category: 'craft',
    region: 'Kutch Peninsula',
    state: 'Gujarat',
    heroImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1200&auto=format&fit=crop',
    shortDesc: 'A 400-year-old textile painting art using boiled castor oil paste and a fine metal stylus, preserved by a single family.',
    traditionStory: 'Castor oil is hand-boiled outdoors for 48 hours until it turns into a dense elastic jelly, then mixed with natural earth pigments. The artist works a small ball of colored paste in the palm, drawing out gossamer-thin threads of paint with a 6-inch brass rod without the needle ever touching the fabric.',
    historyContext: 'Originating in Persia and migrating to Kutch through Sindh, it was used to decorate bridal skirts and canopy cloths for pastoral communities.',
    communityPerspective: 'The Khatri family of Nirona village is today the sole living guardian of this heritage. In the late 20th century, only two masters remained before a revived dedication saved it from extinction.',
    contemporaryPractice: 'Awarded national honors and celebrated internationally, yet the painstaking physical toll of boiling and freehand drawing limits production to a small circle of apprentices.',
    audioSampleUrl: '/audio/rogan_ambient.wav',
    videoSampleUrl: 'https://www.youtube.com/embed/qTSTJ9XQAwY',
    tags: ['Castor Oil Painting', 'Sole Family Lineage', 'Kutch', 'Master Stylus', 'Rare Craft'],
    createdAt: '2026-01-17T00:00:00.000Z'
  }
];

export const SEED_ARTISTS: Artist[] = [
  {
    id: 'artist-raghunath',
    userId: 'user-raghunath',
    artFormId: 'art-maand',
    name: 'Ustad Raghunath Manganiyar',
    stageName: 'Raghunath Khan',
    title: 'Keeper of Maand Vocal Heritage & Kamaicha Master',
    bio: 'Carrying forward an uninterrupted 7-generation hereditary musical lineage across the Thar desert. Known for his expansive knowledge of 140+ rare desert compositions and microtonal vocal ornaments.',
    region: 'Marwar & Thar Desert',
    state: 'Rajasthan',
    location: 'Jodhpur, Rajasthan',
    yearsExperience: 60,
    age: 72,
    quote: 'My father gave me no written notes. He told me: "The song lives in the chest, not on paper. Sing it until the desert answers."',
    lineage: {
      guruName: 'Ustad Chhote Khan Manganiyar (Father)',
      guruLocation: 'Barmer, Thar Desert',
      traditionName: 'Manganiyar Baithak & Court Maand',
      generationCount: 7,
      whatLearned: '140 antique Maand bandishes, complex rhythmic cycles in Dadra and Keherwa, and the bowing techniques of the 17-string wooden Kamaicha.',
      whatPreserved: 'Unrecorded oral compositions dedicated to desert rains, seasonal migrations, and ancestral patron genealogies dating to the 17th century.',
      whoTeachesToday: 'Currently nurturing 42 village youth and 6 senior apprentices at his desert baithak school outside Jodhpur.',
      historicalEra: 'Inherited oral lineage passed down continuously since c. 1720'
    },
    verifiedStatus: 'verified',
    verificationBadgeDate: '2026-01-15T00:00:00.000Z',
    verificationNotes: 'Lineage authenticated through Sangeet Natak Akademi archives and Thar Oral Traditions Circle.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    portraitImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
    audioSamples: [
      {
        id: 'sample-maand-1',
        title: 'Kesariya Balam (Antique Jodhpur Style)',
        type: 'audio',
        url: '/audio/maand_sarangi.wav',
        duration: '4:18',
        description: 'Vocal Maand sung in Raag Mand with subtle meends and bowed Kamaicha resonance.'
      },
      {
        id: 'sample-maand-2',
        title: 'Moomal — The Desert Ballad',
        type: 'audio',
        url: '/audio/maand_sarangi.wav',
        duration: '5:42',
        description: 'Oral romantic ballad commemorating Princess Moomal of Lodhruva.'
      }
    ],
    videoSamples: [
      {
        id: 'vid-maand-1',
        title: 'Transmission: Father to Apprentice in the Courtyard',
        type: 'video',
        url: 'https://www.youtube.com/embed/QD16Nf_IFMk',
        duration: '8:30',
        description: 'Rare documentary footage of Ustad Raghunath teaching a 12-year-old apprentice.'
      }
    ],
    payoutAccountId: 'act_RzpManganiyar99',
    isFeatured: true,
    supportGoal: {
      title: 'Preserve 140 Unrecorded Desert Ragas',
      targetAmount: 250000,
      currentAmount: 168400,
      patronsCount: 47,
      description: 'Funding field recording equipment and stipend support for 8 full-time apprentice musicians.'
    },
    createdAt: '2026-01-20T00:00:00.000Z'
  },
  {
    id: 'artist-kamala',
    userId: 'user-kamala',
    artFormId: 'art-madhubani',
    name: 'Kamala Devi Jha',
    stageName: 'Kamala Devi',
    title: 'National Award Master Painter of Mithila Kohbar',
    bio: 'Practicing the sacred Kohbar and Bharni styles of Madhubani since the age of seven. Renowned for formulating her own black lampblack ink and yellow turmeric pigments.',
    region: 'Mithila Plain',
    state: 'Bihar',
    location: 'Jitwarpur, Mithila, Bihar',
    yearsExperience: 50,
    age: 66,
    quote: 'My mother held my hand when I was seven and guided a bamboo stick across our courtyard wall. Every line we draw is a prayer for living things.',
    lineage: {
      guruName: 'Sitadevi & Mahasundari Devi (Mother & Aunts)',
      guruLocation: 'Jitwarpur, Mithila',
      traditionName: 'Bharni & Tantric Kohbar Tradition',
      generationCount: 5,
      whatLearned: 'Mural geometry, preparation of natural dyes from neem leaves, marigold, and soot, and epic stories of Sita’s childhood.',
      whatPreserved: 'Rare astrological floor mandalas (Aripana) drawn for agricultural fertility rituals.',
      whoTeachesToday: 'Trains over 30 rural women at her courtyard collective to achieve economic self-reliance through authentic craft.',
      historicalEra: 'Domestic maternal lineage practiced unbroken across generations'
    },
    verifiedStatus: 'verified',
    verificationBadgeDate: '2026-01-20T00:00:00.000Z',
    verificationNotes: 'Recipient of President Award 2018; documented in Mithila Museum collection.',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    portraitImage: 'https://images.unsplash.com/photo-1582233479366-6d38bc390a08?q=80&w=600&auto=format&fit=crop',
    audioSamples: [
      {
        id: 'sample-madhubani-1',
        title: 'Oral Maithili Songs Sung While Painting',
        type: 'audio',
        url: '/audio/madhubani_folk.wav',
        duration: '3:20',
        description: 'Traditional work songs that accompany the grinding of natural pigments.'
      }
    ],
    videoSamples: [
      {
        id: 'vid-kamala-1',
        title: 'Mithila Mural Painting & Natural Pigments',
        type: 'video',
        url: 'https://www.youtube.com/embed/IZqOxAHhZsQ',
        duration: '10:15',
        description: 'Demonstrating ancestral Kohbar techniques and organic plant-based dyes.'
      }
    ],
    payoutAccountId: 'act_RzpKamalaJha44',
    isFeatured: true,
    supportGoal: {
      title: 'Mithila Women Natural Dye Co-Op',
      targetAmount: 180000,
      currentAmount: 112000,
      patronsCount: 38,
      description: 'Supplying organic cotton canvas, cold-pressed oils, and fair wages to 24 artisan women.'
    },
    createdAt: '2026-01-22T00:00:00.000Z'
  },
  {
    id: 'artist-gouranga',
    userId: 'user-gouranga',
    artFormId: 'art-baul',
    name: 'Gouranga Das Baul',
    stageName: 'Gouranga Baul',
    title: 'Wandering Mystic & Acoustic Dotara Artisan',
    bio: 'Devoted his entire life to the Baul way of being along the Ajoy river. Sings the enigmatic verses of Lalon Shah and Bhaba Pagla while playing instruments carved by his own hands.',
    region: 'Rarh Bengal & Birbhum',
    state: 'West Bengal',
    location: 'Kenduli, Birbhum, West Bengal',
    yearsExperience: 45,
    age: 63,
    quote: 'We build no temples because temples have walls. The heart has no walls. When the Ektara rings, the inner person awakens.',
    lineage: {
      guruName: 'Sanatan Das Baul',
      guruLocation: 'Bankura, West Bengal',
      traditionName: 'Lalon Fakir & Birbhum Baul Akhada',
      generationCount: 4,
      whatLearned: 'Dehatattva philosophy, breath regulation during singing, Dotara fingerwork, and 300+ verses of Lalon Shah.',
      whatPreserved: 'Unwritten oral melodies sung only in secluded riverside gatherings during the Poush Mela.',
      whoTeachesToday: 'Hosts open weekly satsangs and guides 8 dedicated spiritual disciples.',
      historicalEra: '19th century Sahajiya Baul lineage'
    },
    verifiedStatus: 'verified',
    verificationBadgeDate: '2026-02-01T00:00:00.000Z',
    verificationNotes: 'Direct disciple of Sangeet Natak Akademi fellow Sanatan Das Baul.',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    portraitImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
    audioSamples: [
      {
        id: 'sample-baul-1',
        title: 'Milon Hobe Koto Dine (Song of Yearning)',
        type: 'audio',
        url: '/audio/baul_ektara.wav',
        duration: '6:12',
        description: 'Lalon Shah verse rendered with the Anandalahari and acoustic Ektara.'
      }
    ],
    videoSamples: [
      {
        id: 'vid-baul-1',
        title: 'Song of the Riverbank: Live Acoustic Ektara',
        type: 'video',
        url: 'https://www.youtube.com/embed/Zu37jWgW660',
        duration: '11:20',
        description: 'Live performance along the Ajoy river during sunrise.'
      }
    ],
    payoutAccountId: 'act_RzpGourangaBaul77',
    isFeatured: true,
    supportGoal: {
      title: 'Birbhum River Akhada Restoration',
      targetAmount: 150000,
      currentAmount: 94500,
      patronsCount: 29,
      description: 'Preserving our thatch roof rehearsal circle and providing food for traveling pilgrims.'
    },
    createdAt: '2026-01-25T00:00:00.000Z'
  },
  {
    id: 'artist-teejan',
    userId: 'user-teejan',
    artFormId: 'art-pandavani',
    name: 'Teejan Devi Sahu',
    stageName: 'Teejan Sahu',
    title: 'Kapalik Pandavani Narrator & Tambura Virtuoso',
    bio: 'A powerhouse oral storyteller who commands the stage with fierce theatrical intensity, embodying the roar of Bhima and the tears of Draupadi.',
    region: 'Chhattisgarh Plains',
    state: 'Chhattisgarh',
    location: 'Durg, Chhattisgarh',
    yearsExperience: 38,
    age: 54,
    quote: 'When I grip the Tambura, my own identity vanishes. I become the storyteller of the ages, reminding mortals that righteousness always endures.',
    lineage: {
      guruName: 'Guru Punaram Nishad',
      guruLocation: 'Ringani, Chhattisgarh',
      traditionName: 'Kapalik Style Pandavani',
      generationCount: 3,
      whatLearned: 'All 18 Parvas of the Mahabharata in Chhattisgarhi dialect, rhythmic Tambura twirling, and improvisational vocal dialogues.',
      whatPreserved: 'Subtle regional episodes (Prasangs) rarely found in Sanskrit canonical texts.',
      whoTeachesToday: 'Directing 14 young performers in Durg and Bilaspur.',
      historicalEra: 'Tribal oral ballad tradition'
    },
    verifiedStatus: 'verified',
    verificationBadgeDate: '2026-02-05T00:00:00.000Z',
    verificationNotes: 'Verified via Directorate of Culture, Government of Chhattisgarh.',
    coverImage: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=80&w=1200&auto=format&fit=crop',
    portraitImage: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=600&auto=format&fit=crop',
    audioSamples: [
      {
        id: 'sample-pandavani-1',
        title: 'Draupadi Cheer Haran (Live Chhattisgarhi Chanting)',
        type: 'audio',
        url: '/audio/pandavani_tambura.wav',
        duration: '7:45',
        description: 'Climactic episode with dynamic vocal shifts and Kartal percussion.'
      }
    ],
    videoSamples: [
      {
        id: 'vid-teejan-1',
        title: 'The Roar of Bhima: Live Kapalik Recitation',
        type: 'video',
        url: 'https://www.youtube.com/embed/Nw0VRYTgWm0',
        duration: '9:50',
        description: 'High-energy theatrical storytelling with the twirling Tambura.'
      }
    ],
    payoutAccountId: 'act_RzpTeejanSahu22',
    isFeatured: true,
    supportGoal: {
      title: 'Pandavani Young Storytellers Fellowship',
      targetAmount: 200000,
      currentAmount: 145000,
      patronsCount: 41,
      description: 'Monthly stipends for 5 tribal girls mastering the multi-day oral Kapalik repertoire.'
    },
    createdAt: '2026-01-28T00:00:00.000Z'
  },
  {
    id: 'artist-gafur',
    userId: 'user-gafur',
    artFormId: 'art-rogan',
    name: 'Padma Shri Abdul Gafur Khatri',
    stageName: 'Abdul Gafur Khatri',
    title: 'Padma Shri Master of Kutch Rogan Textile Art',
    bio: 'Revived the 400-year-old ancestral Rogan art from the brink of extinction in Nirona village. Paints intricate motifs by stretching boiled castor oil paste with a 6-inch brass stylus without the needle ever touching the fabric.',
    region: 'Kutch Peninsula',
    state: 'Gujarat',
    location: 'Nirona, Kutch, Gujarat',
    yearsExperience: 46,
    age: 64,
    quote: 'When the castor oil boils for 48 hours and the natural earth pigment meets my palm, the metal stylus does not touch the cloth—the thread of paint moves through the air.',
    lineage: {
      guruName: 'Master Mohammad Khatri (Father)',
      guruLocation: 'Nirona, Kutch, Gujarat',
      traditionName: 'Khatri 8-Generation Rogan Lineage',
      generationCount: 8,
      whatLearned: '48-hour castor oil boiling and density control, natural mineral pigment grinding, stylus thread drawing, and symmetric fabric folding imprint.',
      whatPreserved: 'The iconic "Tree of Life" motif and antique floral jaal patterns originally made for pastoral bridal skirts (Ghagras).',
      whoTeachesToday: 'Has trained over 300 village women and young family apprentices in Nirona, creating rural craft independence.',
      historicalEra: '400-year-old Persian-Kutchi textile stylus tradition preserved by a single family'
    },
    verifiedStatus: 'verified',
    verificationBadgeDate: '2026-01-10T00:00:00.000Z',
    verificationNotes: 'Conferred Padma Shri by the President of India in 2019; creator of the "Tree of Life" gifted by Prime Minister Modi to President Obama.',
    coverImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1200&auto=format&fit=crop',
    portraitImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    audioSamples: [
      {
        id: 'sample-rogan-1',
        title: 'Sounds of the Nirona Atelier: Desert Wind & Brass Stylus',
        type: 'audio',
        url: '/audio/rogan_ambient.wav',
        duration: '3:45',
        description: 'Rhythmic metallic stylus strikes and desert wind recorded at the Nirona family atelier.'
      }
    ],
    videoSamples: [
      {
        id: 'vid-gafur-1',
        title: 'Master Khatri: The Intricate Geometry of Rogan Castor Oil Art',
        type: 'video',
        url: 'https://www.youtube.com/embed/qTSTJ9XQAwY',
        duration: '7:20',
        description: 'Master Abdul Gafur Khatri demonstrating the delicate stylus thread drawing in Nirona.'
      }
    ],
    payoutAccountId: 'act_RzpGafurKhatri55',
    isFeatured: true,
    supportGoal: {
      title: 'Nirona Women Rogan Guild & Natural Castor Oil Fund',
      targetAmount: 220000,
      currentAmount: 158000,
      patronsCount: 43,
      description: 'Purchasing organic castor oil seeds, natural earth pigments, and providing monthly apprentice stipends for 18 artisan women in Kutch.'
    },
    createdAt: '2026-01-20T00:00:00.000Z'
  },
  {
    id: 'artist-tarapada',
    userId: 'user-tarapada',
    artFormId: 'art-chhau',
    name: 'Guru Tarapada Mahato',
    stageName: 'Tarapada Mahato',
    title: 'Purulia Chhau Martial Dancer & Mask Patriarch',
    bio: 'Carrying a 5-generation lineage of Purulia Chhau acrobatic martial dance and traditional Charida mask making. Has performed in over 300 village akhadas across the plateau.',
    region: 'Purulia Plateau',
    state: 'West Bengal',
    location: 'Charida, Purulia, West Bengal',
    yearsExperience: 42,
    age: 61,
    quote: 'When the Dhamsa drum roars like monsoon thunder, the mask is no longer clay and paper—it is the living spirit of the warrior.',
    lineage: {
      guruName: 'Guru Gambhir Singh Mura Lineage',
      guruLocation: 'Purulia, West Bengal',
      traditionName: 'Purulia Chhau Akhada & Charida Mask Tradition',
      generationCount: 5,
      whatLearned: 'Martial leaps, tiger somersaults, mask sculpting using Ganges silt and paper pulp, and Dhamsa-Dhol syncopated rhythms.',
      whatPreserved: 'Rare heroic choreography depicting the battle between Mahishasura and Durga.',
      whoTeachesToday: 'Trains 35 village youths at the Charida community akhada.',
      historicalEra: 'Indigenous martial and tribal ritual dance recognized by UNESCO'
    },
    verifiedStatus: 'verified',
    verificationBadgeDate: '2026-01-12T00:00:00.000Z',
    verificationNotes: 'Sangeet Natak Akademi Parishad recognized master practitioner.',
    coverImage: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1200&auto=format&fit=crop',
    portraitImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
    audioSamples: [
      {
        id: 'sample-chhau-1',
        title: 'Dhamsa War Drums & Shehnai Martial Fanfare',
        type: 'audio',
        url: '/audio/chhau_drums.wav',
        duration: '4:10',
        description: 'Authentic thunderous percussion rhythm opening the Purulia Chhau akhada.'
      }
    ],
    videoSamples: [
      {
        id: 'vid-tarapada-1',
        title: 'Purulia Chhau Mask Dance: The Battle of Charida',
        type: 'video',
        url: 'https://www.youtube.com/embed/QV2nvHaV6no',
        duration: '8:45',
        description: 'High-octane acrobatic martial leaps and mask craftsmanship in Purulia.'
      }
    ],
    payoutAccountId: 'act_RzpTarapadaChhau33',
    isFeatured: true,
    supportGoal: {
      title: 'Charida Clay Mask Preservation Guild',
      targetAmount: 160000,
      currentAmount: 98000,
      patronsCount: 31,
      description: 'Providing non-toxic clay, paper pulp, and seasonal emergency stipends to 15 mask-making families.'
    },
    createdAt: '2026-01-22T00:00:00.000Z'
  },
  {
    id: 'artist-bhabananda',
    userId: 'user-bhabananda',
    artFormId: 'art-sattriya',
    name: 'Bhabananda Barbayan',
    stageName: 'Bhabananda Barbayan',
    title: 'Monastic Master of Sattriya Classical Dance',
    bio: 'Entered the Uttar Kamalabari Sattra on Majuli river island as an infant monk. Devoted over 40 years to the sacred celibate tradition of dance, Khol drumming, and Borgeet chants.',
    region: 'Majuli River Island',
    state: 'Assam',
    location: 'Uttar Kamalabari Sattra, Majuli, Assam',
    yearsExperience: 40,
    age: 52,
    quote: 'In Sattriya, dance is not a show for applause; every footstep is an unuttered prayer, and every gesture is an offering of the self to the divine.',
    lineage: {
      guruName: 'Sattra Adhikar & Guru Paramananda Barbayan',
      guruLocation: 'Uttar Kamalabari Sattra, Majuli',
      traditionName: 'Sankardev Vaishnavite Monastic Sattriya',
      generationCount: 6,
      whatLearned: 'Mati Akhara postures, Ojapali narrative singing, Khol terracotta drum talas, and sacred Borgeet philosophy.',
      whatPreserved: 'Unpublished monastic compositions and monastic ritual mudras from the 15th century.',
      whoTeachesToday: 'Guides young Bhokots (monks) on Majuli and conducts workshops across India and Europe.',
      historicalEra: '15th-century Vaishnavite monastic living tradition founded by Srimanta Sankardev'
    },
    verifiedStatus: 'verified',
    verificationBadgeDate: '2026-01-14T00:00:00.000Z',
    verificationNotes: 'Sangeet Natak Akademi Ustad Bismillah Khan Yuva Puraskar awardee.',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop',
    portraitImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    audioSamples: [
      {
        id: 'sample-sattriya-1',
        title: 'Monastic Borgeet Flute & Sacred Khol Rhythm',
        type: 'audio',
        url: '/audio/sattriya_flute.wav',
        duration: '5:05',
        description: 'Dawn monastic prayer melody recorded at Uttar Kamalabari Sattra on Majuli Island.'
      }
    ],
    videoSamples: [
      {
        id: 'vid-bhabananda-1',
        title: 'Dancing Monks of Majuli: Sattriya Sacred Technique',
        type: 'video',
        url: 'https://www.youtube.com/embed/AUnqW8p0t9I',
        duration: '9:15',
        description: 'Living monastic prayer dance filmed inside the sacred namghar of Majuli.'
      }
    ],
    payoutAccountId: 'act_RzpBarbayanSattriya88',
    isFeatured: true,
    supportGoal: {
      title: 'Majuli Monastic Living Heritage Fellowship',
      targetAmount: 190000,
      currentAmount: 126000,
      patronsCount: 36,
      description: 'Supporting food stipends, musical instruments, and traditional dhoti fabrics for 12 celibate student monks.'
    },
    createdAt: '2026-01-24T00:00:00.000Z'
  },
  {
    id: 'artist-chalapathi',
    userId: 'user-chalapathi',
    artFormId: 'art-tholu-bommalata',
    name: 'Padma Shri Dalavai Chalapathi Rao',
    stageName: 'Chalapathi Rao',
    title: 'Padma Shri Master Shadow Puppeteer & Leather Artisan',
    bio: 'National Award & Padma Shri winning shadow puppetry patriarch. Handcrafts 6-foot goat-hide translucent puppets with vegetable pigments and brings epic Ramayana battles to life behind illuminated cloth.',
    region: 'Rayalaseema & Deccan',
    state: 'Andhra Pradesh',
    location: 'Nimmalakunta, Anantapur, Andhra Pradesh',
    yearsExperience: 55,
    age: 70,
    quote: 'The leather puppet has no pulse until the lamp is lit and the wooden sticks turn. Then our ancestors speak through the shadows.',
    lineage: {
      guruName: 'Dalavai Ramaiah (Father)',
      guruLocation: 'Nimmalakunta, Anantapur',
      traditionName: 'Killekyatha Nomadic Shadow Lineage',
      generationCount: 7,
      whatLearned: 'Goat-skin curing, natural color formulation from tree barks, filigree hole perforation, and night-long epic narrative chanting.',
      whatPreserved: 'Rare palm-leaf scripts and 200-year-old heirloom leather puppets depicting Ravana and Hanuman.',
      whoTeachesToday: 'Mentors his children and 20 artisan families in Nimmalakunta village.',
      historicalEra: '3rd-century BCE Satavahana shadow theatre tradition'
    },
    verifiedStatus: 'verified',
    verificationBadgeDate: '2026-01-16T00:00:00.000Z',
    verificationNotes: 'Conferred Padma Shri in 2020 by the President of India for lifelong contribution to Tholu Bommalata.',
    coverImage: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=1200&auto=format&fit=crop',
    portraitImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
    audioSamples: [
      {
        id: 'sample-tholu-1',
        title: 'Bronze Cymbals & Percussive Chants of the Shadow Screen',
        type: 'audio',
        url: '/audio/tholu_puppetry.wav',
        duration: '4:40',
        description: 'Authentic shadow theatre opening cymbals and epic dialogue chanting.'
      }
    ],
    videoSamples: [
      {
        id: 'vid-chalapathi-1',
        title: 'Shadows of the Gods: Master Dalavai Chalapathi Rao',
        type: 'video',
        url: 'https://www.youtube.com/embed/O23SXPXBReE',
        duration: '10:30',
        description: 'Behind-the-screen documentary on puppet manipulation and filigree carving.'
      }
    ],
    payoutAccountId: 'act_RzpChalapathiTholu66',
    isFeatured: true,
    supportGoal: {
      title: 'Nimmalakunta Shadow Guild Raw Leather Fund',
      targetAmount: 175000,
      currentAmount: 118000,
      patronsCount: 34,
      description: 'Procuring organic vegetable pigments and raw hides to sustain 10 artisan families during non-festival seasons.'
    },
    createdAt: '2026-01-26T00:00:00.000Z'
  }
];

export const SEED_OFFERINGS: Offering[] = [
  {
    id: 'offer-maand-live',
    artistId: 'artist-raghunath',
    type: 'workshop',
    title: 'The Soul of Desert Maand: 4-Part Immersive Workshop',
    description: 'Learn the foundational microtonal glides (meends), phrasing, and ornamental vocal inflections of antique Maand directly from Ustad Raghunath Khan.',
    priceInr: 1499,
    durationDesc: '4 live interactive sessions (90 mins each)',
    scheduleDesc: 'Saturdays & Sundays, 6:00 PM – 7:30 PM IST',
    capacity: 25,
    bookedCount: 19,
    level: 'Beginner',
    mode: 'live_online',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    features: [
      'Direct vocal coaching from Ustad Raghunath',
      'Downloadable high-fidelity practice audio loops',
      'Historical context & lyrical poetry explanations',
      'Certificate of Cultural Transmission',
      '80% of fee paid directly to Ustad Raghunath'
    ],
    createdAt: '2026-02-01T00:00:00.000Z'
  },
  {
    id: 'offer-maand-1on1',
    artistId: 'artist-raghunath',
    type: 'one_on_one',
    title: 'One-on-One Vocal Mentorship with Ustad Raghunath',
    description: 'Private 60-minute intensive riyaz (practice) session for vocalists and music researchers wanting personalized guidance on specific ragas or traditional lyrics.',
    priceInr: 2500,
    durationDesc: '60 minutes private video session',
    scheduleDesc: 'Flexible scheduling upon booking confirmation',
    capacity: 10,
    bookedCount: 7,
    level: 'Intermediate',
    mode: 'live_online',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    features: [
      'Tailored individual vocal critique & ornamentation analysis',
      'Direct dialogue on oral history & desert genealogies',
      'Session recording for personal archival study',
      '85% of fee goes directly to the master'
    ],
    createdAt: '2026-02-02T00:00:00.000Z'
  },
  {
    id: 'offer-maand-apprenticeship',
    artistId: 'artist-raghunath',
    type: 'apprenticeship',
    title: '6-Month Traditional Maand Apprenticeship (Shishya Fellowship)',
    description: 'A comprehensive, cohort-based oral transmission fellowship. Includes 24 in-depth masterclasses, one-on-one reviews, and a 4-day residential baithak retreat in Jodhpur.',
    priceInr: 20000,
    durationDesc: '6 Months (24 masterclasses + residential baithak)',
    scheduleDesc: 'Bi-weekly masterclasses + Autumn Baithak in Jodhpur',
    capacity: 10,
    bookedCount: 6,
    level: 'Advanced',
    mode: 'hybrid',
    location: 'Jodhpur Heritage Haveli & Online',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    features: [
      'Complete mastery of 20 canonical desert compositions',
      '4-day residential living retreat in Jodhpur with the master',
      'Perform alongside Ustad Raghunath at the annual Thar Resonance Baithak',
      'Formal Guru-Shishya lineage recognition document',
      '85% of tuition supports the master and apprentice fund'
    ],
    createdAt: '2026-02-03T00:00:00.000Z'
  },
  {
    id: 'offer-madhubani-workshop',
    artistId: 'artist-kamala',
    type: 'workshop',
    title: 'Sacred Mithila Lines: Natural Dyes & Bamboo Pen Masterclass',
    description: 'Master the meditative art of fine line hatching (Kachni) and preparing organic dyes from turmeric, indigo, and marigold with National Awardee Kamala Devi.',
    priceInr: 1200,
    durationDesc: '3 Weekend Sessions (2 hours each)',
    scheduleDesc: 'Sundays at 11:00 AM IST',
    capacity: 30,
    bookedCount: 22,
    level: 'All Welcome',
    mode: 'live_online',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    features: [
      'Comprehensive guide to botanical dye extraction at home',
      'Sacred geometry of the Kohbar marriage mural',
      'Real-time step-by-step canvas creation',
      'Community feedback showcase',
      '80% of proceeds fund the Mithila Women Collective'
    ],
    createdAt: '2026-02-05T00:00:00.000Z'
  },
  {
    id: 'offer-baul-philosophy',
    artistId: 'artist-gouranga',
    type: 'workshop',
    title: 'The Inner Melody: Baul Mysticism, Verses & Acoustic Ektara',
    description: 'Explore the radical egalitarian philosophy of Bengal’s wandering mystics. Learn to understand Baul metaphors, tune the Ektara, and sing timeless songs of Lalon Fakir.',
    priceInr: 1350,
    durationDesc: '3 Evening Sessions (90 mins)',
    scheduleDesc: 'Fridays, 7:00 PM IST',
    capacity: 20,
    bookedCount: 15,
    level: 'Beginner',
    mode: 'live_online',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    features: [
      'Poetic translations and philosophical discourse',
      'Rhythm basics with Ektara and Dubki percussion',
      'Field audio recordings from Kenduli Mela',
      '80% paid directly to Gouranga Baul'
    ],
    createdAt: '2026-02-06T00:00:00.000Z'
  },
  {
    id: 'offer-rogan-workshop',
    artistId: 'artist-gafur',
    type: 'workshop',
    title: 'The Living Thread of Rogan: 3-Day Castor Oil Stylus Masterclass',
    description: 'Witness and learn the chemistry of castor oil preparation, pigment blending in the palm, and freehand needle guidance from Padma Shri Abdul Gafur Khatri.',
    priceInr: 1600,
    durationDesc: '3 weekend sessions (90 mins each)',
    scheduleDesc: 'Saturdays & Sundays, 4:00 PM – 5:30 PM IST',
    capacity: 25,
    bookedCount: 19,
    level: 'Beginner',
    mode: 'live_online',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    features: [
      'Direct live demonstrations from the Nirona atelier',
      'Detailed guide to castor oil jelly boiling and natural earth pigments',
      'Techniques of symmetrical fabric folding press',
      'Certificate of Cultural Knowledge Transmission',
      '80% of tuition directly supports Master Khatri and rural apprentices'
    ],
    createdAt: '2026-02-05T00:00:00.000Z'
  },
  {
    id: 'offer-rogan-apprenticeship',
    artistId: 'artist-gafur',
    type: 'apprenticeship',
    title: 'Kutch Rogan Heritage Guild Fellowship (3 Months)',
    description: 'In-depth hands-on mentorship program including tool craftsmanship, ancestral motifs, and a 4-day residential masterclass in Nirona village.',
    priceInr: 18000,
    durationDesc: '3 Months (12 intensive masterclasses + Nirona workshop)',
    scheduleDesc: 'Weekly sessions + Spring residency in Kutch',
    capacity: 8,
    bookedCount: 6,
    level: 'Intermediate',
    mode: 'hybrid',
    location: 'Nirona Village Atelier, Kutch, Gujarat',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    features: [
      'One-on-one stylus posture and paint viscosity calibration',
      'Creation of a master "Tree of Life" archival piece',
      'Four-day immersive stay at the Khatri family courtyard',
      'Traditional Lineage Fellowship Diploma',
      '85% proceeds allocated to the master artisan and guild development'
    ],
    createdAt: '2026-02-06T00:00:00.000Z'
  },
  {
    id: 'offer-chhau-workshop',
    artistId: 'artist-tarapada',
    type: 'workshop',
    title: 'Purulia Chhau Martial Stance & Charida Clay Mask Making',
    description: 'Learn the kinetic martial jumps of Purulia Chhau and observe the intricate layering of clay, cloth, and natural dyes with Guru Tarapada Mahato.',
    priceInr: 1350,
    durationDesc: '4 Weekend Sessions (2 hours each)',
    scheduleDesc: 'Saturdays, 11:00 AM IST',
    capacity: 20,
    bookedCount: 14,
    level: 'Beginner',
    mode: 'live_online',
    imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    features: [
      'Foundational martial postures (Ufli) and somatic balance',
      'Step-by-step guidance on traditional mask armature',
      'Rhythmic breakdown of Dhamsa war drum patterns',
      '80% directly paid to Guru Tarapada'
    ],
    createdAt: '2026-02-07T00:00:00.000Z'
  },
  {
    id: 'offer-sattriya-workshop',
    artistId: 'artist-bhabananda',
    type: 'workshop',
    title: 'Sacred Rhythms of Majuli: Monastic Sattriya Mati Akhara',
    description: 'Immerse in the monastic discipline of Sattriya dance, exploring sacred ground exercises (Mati Akhara) and devotional Hastas with Bhabananda Barbayan.',
    priceInr: 1500,
    durationDesc: '3 Weekend Sessions (2 hours each)',
    scheduleDesc: 'Sundays, 9:00 AM IST',
    capacity: 25,
    bookedCount: 18,
    level: 'Beginner',
    mode: 'live_online',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    features: [
      'Authentic monastic warmups and sacred mudras',
      'Introduction to Khol terracotta drum rhythmic cycles',
      'Philosophical context of Vaishnavite prayer aesthetics',
      '80% allocated to Majuli monk student stipends'
    ],
    createdAt: '2026-02-08T00:00:00.000Z'
  },
  {
    id: 'offer-tholu-workshop',
    artistId: 'artist-chalapathi',
    type: 'workshop',
    title: 'Living Shadows: Goat-Hide Puppet Craft & Manipulation',
    description: 'Discover the centuries-old leather filigree perforation and puppetry storytelling from Padma Shri Dalavai Chalapathi Rao.',
    priceInr: 1400,
    durationDesc: '3 Sessions (90 mins each)',
    scheduleDesc: 'Saturdays, 5:00 PM IST',
    capacity: 20,
    bookedCount: 16,
    level: 'Beginner',
    mode: 'live_online',
    imageUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=800&auto=format&fit=crop',
    status: 'active',
    features: [
      'Goat-hide perforation needlework techniques',
      'Bamboo rod joint manipulation behind the screen',
      'Vocal chanting and shadow projection optics',
      '80% directly paid to Master Chalapathi Rao'
    ],
    createdAt: '2026-02-09T00:00:00.000Z'
  }
];

export const SEED_EXPERIENCES: Experience[] = [
  {
    id: 'exp-jodhpur-baithak',
    artistId: 'artist-raghunath',
    artFormId: 'art-maand',
    title: 'Twilight Desert Baithak Under the Stars',
    category: 'Intimate Performance',
    location: 'Mandore Heritage Courtyard, Jodhpur',
    city: 'Jodhpur',
    state: 'Rajasthan',
    dateTime: 'This Saturday, 6:30 PM',
    duration: '2.5 Hours',
    priceInr: 950,
    capacity: 35,
    bookedCount: 28,
    description: 'An intimate, acoustic gathering seated on floor cushions by candlelight. Hear Ustad Raghunath and his ensemble perform antique Maand ballads as desert tales are recounted.',
    highlights: [
      'Pure acoustic performance without harsh electronic amplification',
      'Traditional spiced chai & regional delicacies served',
      'Intimate dialogue with the master about oral histories',
      'Support the local musicians directly'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-02-01T00:00:00.000Z'
  },
  {
    id: 'exp-delhi-puppetry',
    artistId: 'artist-teejan',
    artFormId: 'art-tholu-bommalata',
    title: 'Candlelit Shadow Puppetry & Oral Ballads',
    category: 'Heritage Performance',
    location: 'Sunder Nursery Amphitheatre, Nizamuddin',
    city: 'Delhi NCR',
    state: 'Delhi',
    dateTime: 'This Sunday, 6:00 PM',
    duration: '2 Hours',
    priceInr: 800,
    capacity: 60,
    bookedCount: 51,
    description: 'Watch 6-foot illuminated leather shadow puppets come to life behind a white linen screen, accompanied by intense live folk percussion and vocal chants.',
    highlights: [
      'Rare authentic performance by master puppeteers visiting from Andhra',
      'Behind-the-screen demonstration of puppet manipulation',
      'Family-friendly discovery of Indian oral mythology'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-02-02T00:00:00.000Z'
  },
  {
    id: 'exp-mithila-walk',
    artistId: 'artist-kamala',
    artFormId: 'art-madhubani',
    title: 'Mithila Courtyard Walk: Living Murals & Tea with Kamala Devi',
    category: 'Studio Visit & Walk',
    location: 'Village Jitwarpur, Madhubani District',
    city: 'Madhubani',
    state: 'Bihar',
    dateTime: 'Next Weekend, 10:00 AM',
    duration: '4 Hours',
    priceInr: 1200,
    capacity: 15,
    bookedCount: 9,
    description: 'Walk through the open mud-and-brick courtyards where generational women paint frescoes directly on homestead walls. Share homemade tea and see authentic dye-making from scratch.',
    highlights: [
      'Direct interaction with generational women artisans',
      'See rare archival wall murals not accessible to public tours',
      'Locally sourced Maithili organic lunch included'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-02-03T00:00:00.000Z'
  },
  {
    id: 'exp-kutch-rogan',
    artistId: 'artist-gafur',
    artFormId: 'art-rogan',
    title: 'Nirona Atelier Residency: The Alchemy of Castor Oil & Pigment',
    category: 'Studio Visit & Masterclass',
    location: 'Khatri Artisan Courtyard, Nirona',
    city: 'Nirona, Bhuj',
    state: 'Gujarat',
    dateTime: 'Next Saturday, 10:30 AM',
    duration: '3 Hours',
    priceInr: 1500,
    capacity: 16,
    bookedCount: 12,
    description: 'Sit on traditional floor mattresses in Nirona village alongside Padma Shri Abdul Gafur Khatri. Watch castor oil being stretched into delicate threads and try the needle technique yourself.',
    highlights: [
      'Live tactile experience with boiled castor paste and brass stylus',
      'Intimate Q&A with Padma Shri Abdul Gafur Khatri',
      'Authentic Kutchi tea and homemade snacks served',
      'Take home a signed small Rogan motif test swatch'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-02-04T00:00:00.000Z'
  }
];

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  commissionWorkshops: 20,
  commissionLessons: 15,
  commissionCourses: 20,
  commissionExperiences: 15,
  commissionTips: 5,
  maintenanceMode: false,
  registrationsEnabled: true,
  payoutsEnabled: true,
  razorpayKeyId: 'rzp_test_ANUNAAD2026',
  razorpayMockMode: true,
  currency: 'INR'
};

export const DEFAULT_CMS_CONTENT: CmsContent = {
  heroTagline: 'Every tradition deserves to resonate.',
  heroSubtext: 'Discover the people, stories and art forms keeping culture alive. ANUNAAD is an editorial sanctuary and economic bridge for living traditions.',
  announcementBanner: 'Now Open: Applications for 2026 Living Transmission Fellowships & Regional Baithaks.',
  featuredArtistId: 'artist-raghunath',
  featuredArtFormIds: ['art-maand', 'art-pandavani', 'art-chhau', 'art-baul', 'art-tholu-bommalata', 'art-sattriya', 'art-madhubani', 'art-rogan'],
  editorialManifesto: 'Culture should not only be preserved in archives. It should continue to live through people. When an artist passes a tradition to another person, the tradition continues to resonate.',
  footerQuote: 'Some traditions disappear quietly. Some find another voice. Be the person who listens.'
};
