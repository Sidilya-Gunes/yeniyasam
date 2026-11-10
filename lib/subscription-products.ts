// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

export interface SubscriptionProduct {
  id: string;
  name: string;
  price: number;
  currency: 'TRY' | 'EUR';
  currencySymbol: string;
  period: string;
  type: 'domestic' | 'international';
  category: 'standard' | 'support';
  description: string;
  features: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_PRODUCTS: SubscriptionProduct[] = [
  // --- YURT İÇİ (TRY) ---
  {
    id: 'yurt-ici-6-aylik',
    name: 'Yurt İçi 6 Aylık E-Abonelik',
    price: 1250,
    currency: 'TRY',
    currencySymbol: '₺',
    period: '6 Ay',
    type: 'domestic',
    category: 'standard',
    description: "Yeni Yaşam Gazetesi'nin Yurt İçi 6 Aylık E-Abonelik Paketi'dir. 6 ay boyunca her gün çıkan gazetemizi okuyabilir, geçmiş arşive ulaşıp indirebilirsiniz.",
    features: [
      '6 ay boyunca her sabah e-gazete PDF baskısına erişim',
      'Yeni Yaşam dijital arşivine sınırsız erişim ve indirme',
      'Web sitesinde reklamsız okuma deneyimi',
    ],
  },
  {
    id: 'yurt-ici-yillik',
    name: 'Yurt İçi Yıllık E-Abonelik',
    price: 2000,
    currency: 'TRY',
    currencySymbol: '₺',
    period: '1 Yıl',
    type: 'domestic',
    category: 'standard',
    popular: true,
    description: "Yeni Yaşam Gazetesi'nin Yurt İçi Yıllık Abonelik Paketi'dir. 1 yıl boyunca kesintisiz e-gazete ve tüm arşiv erişimi sağlar.",
    features: [
      '1 yıl boyunca kesintisiz e-gazete ve günlük PDF indirme',
      'Geçmiş tüm arşive tam erişim ve indirme imkanı',
      'Özel araştırma dosyaları ve köşe yazılarına anında erişim',
      'En çok tercih edilen avantajlı yıllık paket',
    ],
  },
  {
    id: 'yurt-ici-destek-1',
    name: 'Yurt İçi Yıllık Destek Paketi (1)',
    price: 3000,
    currency: 'TRY',
    currencySymbol: '₺',
    period: '1 Yıl',
    type: 'domestic',
    category: 'support',
    description: "Yeni Yaşam Gazetesi ile dayanışmayı büyütmek ve bağımsız gazeteciliğe güç katmak için oluşturulmuş yıllık destek paketidir.",
    features: [
      'Tüm Yurt İçi Yıllık E-Abonelik hakları dahil',
      'Özgür ve bağımsız haberciliğe doğrudan dayanışma katkısı',
      'Öğrenciler ve cezaevleri için askıda gazete fonuna destek',
    ],
  },
  {
    id: 'yurt-ici-destek-2',
    name: 'Yurt İçi Yıllık Destek Paketi (2)',
    price: 5000,
    currency: 'TRY',
    currencySymbol: '₺',
    period: '1 Yıl',
    type: 'domestic',
    category: 'support',
    description: "Yeni Yaşam Gazetesi ile dayanışmayı büyütmek için yıllık dayanışma katkısı paketi.",
    features: [
      'Tüm Yurt İçi Yıllık E-Abonelik hakları dahil',
      'Bağımsız halk haberciliğine güçlü dayanışma desteği',
      'Askıda gazete fonuna çift destek',
      'Tüm geçmiş dijital arşiv erişimi',
    ],
  },
  {
    id: 'yurt-ici-destek-3',
    name: 'Yurt İçi Yıllık Destek Paketi (3)',
    price: 10000,
    currency: 'TRY',
    currencySymbol: '₺',
    period: '1 Yıl',
    type: 'domestic',
    category: 'support',
    description: "Yeni Yaşam Gazetesi ile en üst düzey dayanışma ve destek paketi.",
    features: [
      'Tüm Yurt İçi Yıllık E-Abonelik hakları dahil',
      'Özgür basına ve halkın haber alma hakkına maksimum dayanışma',
      'Genişletilmiş askıda gazete desteği',
      'Özel içerik ve buluşmalara davet',
    ],
  },

  // --- YURT DIŞI (EUR) ---
  {
    id: 'yurt-disi-6-aylik',
    name: 'Yurt Dışı 6 Aylık E-Abonelik',
    price: 100,
    currency: 'EUR',
    currencySymbol: '€',
    period: '6 Ay',
    type: 'international',
    category: 'standard',
    description: "Yeni Yaşam Gazetesi'nin Yurt Dışı 6 Aylık E-Abonelik Paketi'dir. Yurt dışındaki okurlarımız için kesintisiz dijital gazete erişimi.",
    features: [
      '6 ay boyunca günlük e-gazete ve PDF indirme',
      'Arşive sınırsız uluslararası erişim',
      'Reklamsız dijital okuma deneyimi',
    ],
  },
  {
    id: 'yurt-disi-yillik',
    name: 'Yurt Dışı Yıllık E-Abonelik',
    price: 200,
    currency: 'EUR',
    currencySymbol: '€',
    period: '1 Yıl',
    type: 'international',
    category: 'standard',
    popular: true,
    description: "Yeni Yaşam Gazetesi'nin Yurt Dışı Yıllık E-Abonelik Paketi'dir. 1 yıl boyunca kesintisiz gazete ve arşiv erişimi.",
    features: [
      '1 yıl boyunca her gün e-gazete ve PDF indirme',
      'Tüm geçmiş arşive sınırsız erişim',
      'Yurt dışı okurlar için en avantajlı yıllık paket',
    ],
  },
  {
    id: 'yurt-disi-destek-1',
    name: 'Yurt Dışı Yıllık Destek Paketi (1)',
    price: 500,
    currency: 'EUR',
    currencySymbol: '€',
    period: '1 Yıl',
    type: 'international',
    category: 'support',
    description: "Yurt dışından Yeni Yaşam Gazetesi ile dayanışmayı büyütmek için yıllık destek paketi.",
    features: [
      'Tüm Yurt Dışı Yıllık Abonelik hakları dahil',
      'Diasporadan özgür basına doğrudan dayanışma katkısı',
      'Askıda gazete dayanışma fonuna katkı',
    ],
  },
  {
    id: 'yurt-disi-destek-2',
    name: 'Yurt Dışı Yıllık Destek Paketi (2)',
    price: 750,
    currency: 'EUR',
    currencySymbol: '€',
    period: '1 Yıl',
    type: 'international',
    category: 'support',
    description: "Yurt dışından bağımsız haberciliğe güçlü dayanışma paketi.",
    features: [
      'Tüm Yurt Dışı Yıllık Abonelik hakları dahil',
      'Özgür basın mücadelesine güçlü uluslararası destek',
      'Genişletilmiş askıda gazete desteği',
    ],
  },
  {
    id: 'yurt-disi-destek-3',
    name: 'Yurt Dışı Yıllık Destek Paketi (3)',
    price: 1000,
    currency: 'EUR',
    currencySymbol: '€',
    period: '1 Yıl',
    type: 'international',
    category: 'support',
    description: "Yurt dışından Yeni Yaşam Gazetesi'ne en üst düzey dayanışma paketi.",
    features: [
      'Tüm Yurt Dışı Yıllık Abonelik hakları dahil',
      'Sansüre ve baskılara karşı özgür basına maksimum dayanışma',
      'Kapsamlı askıda gazete desteği',
      'Özel etkinlik ve bülten erişimi',
    ],
  },
];
