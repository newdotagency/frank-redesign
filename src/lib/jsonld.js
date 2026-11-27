// JSON-LD blocks (readiness doc, M5). They must say the same as the visible page: change them with src/lib/facts.js.
const ORG_ID = 'https://www.hifrank.ai/#org';

export const HOME_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization', '@id': ORG_ID, name: 'Frank AI Researcher', alternateName: 'Frank',
      url: 'https://www.hifrank.ai/', logo: 'https://www.hifrank.ai/frank-logo.png', email: 'support@hifrank.ai',
      parentOrganization: { '@type': 'Organization', name: 'Prelaunch.com', url: 'https://prelaunch.com/' },
    },
    {
      '@type': 'SoftwareApplication', '@id': 'https://www.hifrank.ai/#app', name: 'Frank AI Researcher', alternateName: 'Frank',
      description: 'Frank is an AI user researcher that runs short voice interviews.', url: 'https://www.hifrank.ai/',
      applicationCategory: 'BusinessApplication', operatingSystem: 'Web', publisher: { '@id': ORG_ID },
      featureList: [
        'AI-moderated voice interviews with your own customers', '50+ interview languages', 'Sentiment and thematic analysis',
        'Transcripts and highlight clips', 'MCP connector on every plan, including Free', 'SOC 2 and GDPR compliant',
        'Video and WhatsApp interviews: Coming soon',
      ],
      offers: { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD',
        description: 'Free plan: 60 voice minutes a month, no card required.', url: 'https://www.hifrank.ai/pricing' },
    },
  ],
};

const offer = (name, price, description) => ({ '@type': 'Offer', name, price, priceCurrency: 'USD', description });
export const PRICING_LD = [
  {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Frank AI Researcher', url: 'https://www.hifrank.ai/pricing',
    applicationCategory: 'BusinessApplication', operatingSystem: 'Web', publisher: { '@id': ORG_ID },
    offers: [
      offer('Free', '0', '225 signup credits plus 60 voice minutes a month (10-minute max per interview). No credit card required.'),
      offer('Starter (billed monthly)', '59', '120 voice minutes a month, 20-minute max interview length.'),
      offer('Starter (billed yearly)', '590', 'Billed as $590/year ($49/mo). 120 voice minutes a month.'),
      offer('Growth (billed monthly)', '199', '450 voice minutes a month, 20-minute max, credit rollovers (30 days).'),
      offer('Growth (billed yearly)', '1990', 'Billed as $1,990/year ($166/mo). 450 voice minutes a month.'),
      offer('Business (billed monthly)', '375', '950 voice minutes a month, 30-minute max, everything in Growth.'),
      offer('Business (billed yearly)', '3750', 'Billed as $3,750/year ($312/mo). 950 voice minutes a month.'),
    ],
  },
];
const q = (name, text) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } });
export const PRICING_FAQ_LD = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    q('Is there a free trial?', 'There is no free trial on paid plans. The Free plan is the way to try Frank: 60 voice minutes a month, no card required.'),
    q('Can I cancel anytime?', 'Cancel anytime. Your plan stays active until the end of the period you’ve paid for, and there’s no refund for the unused time.'),
    q('What is a credit?', '10 credits equals roughly 1 minute of voice interview.'),
    q('Do unused credits roll over?', 'On Growth and above, unused credits roll over for 30 days. Free and Starter plans reset monthly.'),
    q('Is MCP included?', 'Yes. MCP is included on every plan, including Free.'),
  ],
};

export const MCP_LD = {
  '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Frank AI Researcher MCP connector',
  url: 'https://www.hifrank.ai/mcp', applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
  description: 'Connect Frank AI Researcher to ChatGPT, Claude, Grok and Muse to create studies, run voice interviews and read transcripts from your AI chat.',
  publisher: { '@id': ORG_ID },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'MCP is included on every plan, including Free.' },
};
