// Use-case pages for the Churn page's other templates, part 2: upgrade, requests, value, checkout, downgrade. See ./mk.js. The page words are drafted
// from the home page's template text; the study numbers and quotes are invented examples (the page labels them as such).
import { ChevronsUp, ListChecks, Heart, ShoppingCart, Wallet } from 'lucide-react';
import {
  Target01Icon, Flag01Icon, UserGroupIcon, Layers01Icon, Search01Icon, Task01Icon, Idea01Icon, Megaphone01Icon, ChartLineData01Icon, HeartCheckIcon,
  ShoppingCart01Icon, CreditCardIcon, DiscountTag01Icon, Alert02Icon, Money01Icon, Settings02Icon, AnalyticsDownIcon, Tag01Icon, Calendar01Icon, Message01Icon,
} from '@hugeicons/core-free-icons';
import { mk } from './mk';

export const UPGRADE = mk({
  slug: 'upgrade-barriers', tpl: 'upgrade', label: 'Upgrade barriers', name: 'Upgrade barriers', icon: ChevronsUp,
  description: 'In a short voice or video interview, Frank asks customers who keep using their current plan whether they need more and what stops them from upgrading. Then it ranks every answer by how many customers raised it.',
  whenIcons: [Layers01Icon, Tag01Icon, UserGroupIcon, Target01Icon],
  launch: 'on the pricing page, the plan comparison screen or the limit-reached message,',
  hero: {
    turns: [
      ['frank', 'You’ve been on the Starter plan for a year. Have you thought about upgrading?'],
      ['customer', 'A few times. I always stop at the pricing page.'],
      ['frank', 'What makes you stop there?'],
      ['customer', 'The next plan adds features I don’t need.'],
      ['frank', 'Is there one you would need?'],
      ['customer', 'Just more seats. That’s the only limit I hit.'],
      ['frank', 'What would make upgrading easy?'],
      ['customer', 'Pay per seat instead of jumping a whole tier.'],
    ],
    title: ['Frank asks customers what’s keeping them ', 'on the lower plan'],
    text: 'In a short voice or video interview, Frank learns whether customers need additional capabilities and what prevents them from choosing a higher plan. Then it ranks every answer by how many customers raised it.',
  },
  what: {
    phrase: 'an upgrade barriers interview?',
    sub: 'An upgrade barriers interview is a short conversation with a customer who keeps using their current plan and hasn’t moved up.',
    para: 'It finds out which limits they actually hit, what they think the higher plan includes, what it would cost them to switch, and what would make the move easy.',
    quote: 'Your billing data shows who stayed on the lower plan. It doesn’t show whether they don’t need more, don’t understand the difference, or don’t think it’s worth the price.',
  },
  when: [
    ['When customers hit a limit and stay put', 'Ask people who reached a seat, usage or storage limit why they didn’t upgrade.'],
    ['Before you redesign your pricing', 'Hear how customers read your tiers, so the new ones match how they think.'],
    ['When expansion revenue is flat', 'Learn whether the barrier is price, packaging or awareness.'],
    ['After you launch a new plan', 'Check whether customers understand who it’s for.'],
  ],
  guide: {
    title: ['The upgrade barriers', 'research guide.'],
    steps: [
      ['How they use their current plan', 'What they rely on today, and how close they are to its limits.'],
      ['What they know about the higher plan', 'What they think it includes, and where they learned that.'],
      ['Whether they need more', 'Specific moments when the current plan wasn’t enough, and how they worked around it.'],
      ['What stops them', 'Price, approval, timing, or not seeing the value. Frank asks for the last time they considered upgrading.'],
      ['Who decides', 'Who else needs to agree, and what they would need to see.'],
      ['What would make it easy', 'The change in price, packaging or timing that would turn considering into doing.'],
    ],
  },
  vs: {
    other: 'Pricing page analytics', shortOther: 'Analytics',
    title: ['Pricing analytics show who looked.', 'Frank hears why they didn’t upgrade.'],
    rows: [
      ['What the customer does', 'Visits the pricing page and leaves', 'Explains how they read the plans and what held them back'],
      ['“Too expensive”', 'Logged as price sensitivity', 'Followed up: expensive compared with what, for which feature?'],
      ['Follow-up questions', 'None', 'Asked whenever an answer is vague or doesn’t add up'],
      ['Limits they hit', 'Visible in usage data', 'Explained, along with what they did instead'],
      ['Who decides', 'Unknown', 'Named, with what they need to see'],
      ['What would change it', 'A hypothesis to A/B test', 'Stated by the customer'],
    ],
    close: ['Keep analytics to see who hits the pricing page.', 'Run Frank when you need to know what keeps people on the lower plan.'],
  },
  out: {
    caption: 'What keeps customers of a team tool on the Starter plan. Example: 50 upgrade barriers interviews.',
    aria: 'What keeps customers of a team tool on the Starter plan',
    total: 50,
    rows: [
      [20, 'They only needed more seats, not a whole tier', 'Most of these customers hit the seat limit and found that the next plan bundled features they didn’t want.', 'I only need three more seats. Moving to the next plan doubles my bill for things I won’t use.'],
      [14, 'They weren’t sure what the higher plan added', 'These customers couldn’t tell from the comparison table which differences mattered to them.', 'I read the table twice and still couldn’t tell if I needed the extra reports.'],
      [10, 'Someone else had to approve it', 'These customers wanted the upgrade and needed a budget holder to agree.', 'I’d upgrade tomorrow, but I need finance to sign off, and I don’t have anything to show them.'],
      [6, 'They worked around the limits', null, 'I just made a second account for the overflow. It’s clumsy but free.'],
    ],
  },
  where: {
    title: 'What would have changed it',
    slices: [['Pay per seat, not per tier', 20], ['A clearer plan comparison', 12], ['Something to show finance', 9], ['A lower price', 6], ['Nothing, it’s fine as is', 3]],
  },
  actions: [
    ['Add per-seat add-ons so customers can grow without changing tier.', 20],
    ['Rewrite the plan comparison around what each plan lets you do, not a list of features.', 14],
    ['Give admins a one-page business case to send to whoever approves spend.', 10],
  ],
  faq: [
    ['Who should I interview?', 'Customers who have used their plan for a while and have either hit a limit or visited your pricing page without upgrading. Include a few who never considered it, to compare.'],
    ['Does it work for usage-based pricing?', 'Yes. Replace “plan” with the threshold that matters, such as a usage cap or a seat count. The AI Researcher adapts the Research Guide to how you charge.'],
    ['Won’t it feel like a sales pitch?', 'Keep it a feedback request, not an offer. Customers tend to be candid about pricing when it’s clear nobody is trying to sell them something in that conversation.'],
  ],
  closing: { title: 'Every customer who didn’t upgrade has a reason.', marker: 'Let them tell Frank.', sub: 'Describe what you want to learn and hear from your customers before your next standup.' },
});

export const REQUESTS = mk({
  slug: 'feature-request-discovery', tpl: 'requests', label: 'Feature request discovery', name: 'Feature request discovery', icon: ListChecks,
  description: 'In a short voice or video interview, Frank asks customers who requested a feature about the problem behind it, how they cope today, how often it happens and what it costs. Then it ranks every answer by how many customers raised it.',
  whenIcons: [Task01Icon, Search01Icon, ChartLineData01Icon, Idea01Icon],
  launch: 'to your feedback form, the “request a feature” button or the reply to a request,',
  hero: {
    turns: [
      ['frank', 'You asked for an Excel export. What are you trying to do?'],
      ['customer', 'Send our numbers to the finance team.'],
      ['frank', 'How do you do that today?'],
      ['customer', 'I copy it into a sheet by hand every month.'],
      ['frank', 'How long does that take?'],
      ['customer', 'About two hours, and I’ve made mistakes.'],
      ['frank', 'What would a perfect result look like?'],
      ['customer', 'Finance gets it on the first, without me.'],
    ],
    title: ['Frank asks why customers ', 'want what they asked for'],
    text: 'In a short voice or video interview, Frank learns the problem behind a feature request, how customers cope today, how often it happens and what it costs them. Then it ranks every answer by how many customers raised it.',
  },
  what: {
    phrase: 'a feature request interview?',
    sub: 'A feature request interview is a short conversation with a customer who asked for something you haven’t built.',
    para: 'It finds out what they are trying to get done, how they handle it now, how often it comes up, and what it costs them when it goes wrong.',
    quote: 'A request tells you what someone wants built. It doesn’t tell you the problem behind it, how many others share it, or whether a different solution would do.',
  },
  when: [
    ['When your backlog is long and unranked', 'Learn which requests come from problems that matter and which are one-off wishes.'],
    ['Before you commit roadmap time', 'Hear how often the problem occurs and what it costs, so you invest in the right ones.'],
    ['When different customers ask for the same thing', 'Find out whether they share a problem or only a phrase.'],
    ['When a big customer asks for a custom feature', 'Understand the underlying need before you build a one-off.'],
  ],
  guide: {
    title: ['The feature request discovery', 'research guide.'],
    steps: [
      ['What they asked for', 'The request in their words, and when they first wanted it.'],
      ['What they’re trying to get done', 'The job behind the request. Frank asks for the last time it came up.'],
      ['How they cope today', 'The workaround, tool or manual process they use now.'],
      ['How often it happens', 'How frequently the problem occurs, and who else on the team runs into it.'],
      ['What it costs them', 'Time, money, errors or missed opportunities when the problem isn’t solved.'],
      ['What a good outcome looks like', 'Their description of success, which often points to a simpler solution than the request.'],
    ],
  },
  vs: {
    other: 'Feature request board', shortOther: 'Board',
    title: ['A request board counts votes.', 'Frank finds the problem behind them.'],
    rows: [
      ['What the customer does', 'Posts a request and upvotes', 'Explains what they’re trying to get done'],
      ['“Add Excel export”', 'Logged as a solution', 'Followed up: what do you do with the file, and who needs it?'],
      ['Follow-up questions', 'None', 'Asked whenever an answer is vague or doesn’t add up'],
      ['Workarounds', 'Invisible', 'Named, with what they cost'],
      ['How often it matters', 'A vote count', 'How frequently it happens, and for whom'],
      ['Better solutions', 'Rarely surfaced', 'Often visible in how they describe success'],
    ],
    close: ['Keep the board to collect requests.', 'Run Frank when you need to know which problems deserve investment.'],
  },
  out: {
    caption: 'The problems behind requests for an export feature in an analytics tool. Example: 46 feature request interviews.',
    aria: 'The problems behind requests for an export feature in an analytics tool',
    total: 46,
    rows: [
      [19, 'They needed to share numbers with finance, not export a file', 'Most of these customers wanted a recurring report to land in someone else’s inbox. A file was just the way they imagined it.', 'I don’t actually want a file. I want finance to get the numbers on the first of the month without me.'],
      [13, 'They were rebuilding the same report by hand', 'These customers copied data into a spreadsheet every month, which cost hours and caused errors.', 'I spend two hours every month copying this into a sheet. I’ve got it wrong at least once.'],
      [8, 'They needed it for a one-off audit', 'These requests came from a single event and wouldn’t come up again.', 'We need it once, for the auditors. After that, I’d never use it.'],
      [6, 'They wanted to join it with another data source', null, 'I want to combine it with our sales data. Exporting is just how I thought I’d do that.'],
    ],
  },
  where: {
    title: 'How often it comes up',
    slices: [['Every month', 19], ['Every week', 11], ['Every quarter', 8], ['Once or twice a year', 6], ['They couldn’t say', 2]],
  },
  actions: [
    ['Build scheduled report emails instead of a file export, and test with five of the customers who asked.', 19],
    ['Prefill the monthly finance report so it needs no manual copying.', 13],
    ['Offer a one-off export through support for audits, and don’t build it into the product.', 8],
  ],
  faq: [
    ['Who should I interview?', 'The customers who made the request, plus a few who didn’t but fit the same profile. Start with the requests that appear most often or come from your most important accounts.'],
    ['Will customers expect me to build what they asked for?', 'Be clear that the aim is to understand the problem, not to promise a feature. Frank asks about the problem first, and most customers are glad to be asked.'],
    ['How is this different from product discovery?', 'Product discovery starts from an open question, before there is an idea. Feature request discovery starts from a specific request and works back to the problem behind it.'],
  ],
  closing: { title: 'Every request is a problem in disguise.', marker: 'Let your customers tell Frank.', sub: 'Describe what you want to learn and hear from your customers before your next planning session.' },
});

export const VALUE = mk({
  slug: 'customer-value-drivers', tpl: 'value', label: 'Customer value drivers', name: 'Customer value drivers', icon: Heart,
  description: 'In a short voice or video interview, Frank asks loyal customers which workflows and outcomes matter most and why they keep choosing the product. Then it ranks every answer by how many customers raised it.',
  whenIcons: [HeartCheckIcon, Megaphone01Icon, Target01Icon, Idea01Icon],
  launch: 'to your account page, a renewal reminder or a thank-you message,',
  hero: {
    turns: [
      ['frank', 'You’ve been with us for three years. What keeps you here?'],
      ['customer', 'It saves my team a day every week.'],
      ['frank', 'Which part saves the most time?'],
      ['customer', 'The automatic weekly summary. It replaced a meeting.'],
      ['frank', 'What would you miss most if it went away?'],
      ['customer', 'That summary, and being able to trust the numbers.'],
      ['frank', 'How do you describe us to colleagues?'],
      ['customer', '“The thing that replaced our Monday meeting.”'],
    ],
    title: ['Frank asks loyal customers what keeps them ', 'coming back'],
    text: 'In a short voice or video interview, Frank learns which workflows and outcomes matter most to customers who keep coming back, and why they continue choosing the product. Then it ranks every answer by how many customers raised it.',
  },
  what: {
    phrase: 'a customer value drivers interview?',
    sub: 'A customer value drivers interview is a short conversation with a customer who keeps choosing your product.',
    para: 'It finds out what they use it for, which outcome matters most, what they would miss, and how they describe it to others.',
    quote: 'Your retention data shows who stays. It doesn’t show which part of the product they stay for, or the words they use when they recommend you.',
  },
  when: [
    ['When you need to know why customers stay', 'Ask your most loyal customers what they value, instead of guessing from feature usage.'],
    ['Before you write positioning or messaging', 'Hear the outcomes and words customers use for the value they get.'],
    ['When deciding what to protect or build next', 'Learn which workflows are essential before you change them.'],
    ['After a long-term customer renews', 'Capture the reason while it’s fresh, and while they’re feeling good about you.'],
  ],
  guide: {
    title: ['The customer value drivers', 'research guide.'],
    steps: [
      ['How they use the product', 'The workflows they rely on, how often, and with whom.'],
      ['What outcome matters most', 'The result they get that they would be unhappy to lose.'],
      ['What life was like before', 'How they handled the job before, and what it cost them.'],
      ['What they would miss', 'What would hurt first if the product disappeared tomorrow.'],
      ['How they describe it to others', 'The words they use when they recommend you to a colleague.'],
      ['What would make it more valuable', 'What they would add or improve to get even more from it.'],
    ],
  },
  vs: {
    other: 'Satisfaction survey', shortOther: 'Survey',
    title: ['A satisfaction survey asks how happy they are.', 'Frank hears why they stay.'],
    rows: [
      ['What the customer does', 'Rates satisfaction from 1 to 10', 'Describes what the product does for them'],
      ['“Great product”', 'Logged as a high score', 'Followed up: great at what, and what would you miss?'],
      ['Follow-up questions', 'None', 'Asked whenever an answer is vague or doesn’t add up'],
      ['Which feature matters', 'A ranking from a list', 'Explained through a real example'],
      ['The words they use', 'Not captured', 'Quoted, ready for your messaging'],
      ['What life was like before', 'Rarely asked', 'Described, with what the problem cost'],
    ],
    close: ['Keep the survey to track a score over time.', 'Run Frank when you need to know what customers actually value.'],
  },
  out: {
    caption: 'Why long-term customers of a team reporting tool keep choosing it. Example: 40 value driver interviews.',
    aria: 'Why long-term customers of a team reporting tool keep choosing it',
    total: 40,
    rows: [
      [16, 'It replaced a recurring meeting', 'Most of these customers described the weekly summary as the thing that freed their team’s time.', 'That summary replaced our Monday meeting. That’s hours back for six people every single week.'],
      [11, 'They trust the numbers', 'These customers named accuracy as the reason they never looked elsewhere.', 'I’ve never had to second-guess it. When finance asks, I just send it.'],
      [8, 'It’s how they show their own work', 'These customers use the reports to demonstrate results to their managers.', 'It makes me look good in front of my boss, and I never have to prepare anything.'],
      [5, 'Switching would be a hassle', null, 'It’s not exciting. It just works, and moving everything would take a month.'],
    ],
  },
  where: {
    title: 'What they would miss most',
    slices: [['The weekly summary', 16], ['Trustworthy numbers', 11], ['Sharing with leadership', 8], ['The integrations', 3], ['Support', 2]],
  },
  actions: [
    ['Lead messaging with “replaces your weekly meeting”, in customers’ own words.', 16],
    ['Protect the weekly summary: test any change with the customers who named it.', 11],
    ['Add a one-click “share with leadership” view to the reports.', 8],
  ],
  faq: [
    ['Who should I interview?', 'Customers who have stayed a long time or use the product heavily, plus a few who renewed after a difficult period. Their reasons are often different.'],
    ['Is this the same as a customer testimonial?', 'No. The interview asks open questions and records honest answers, including what could be better. You can ask permission to share quotes afterwards.'],
    ['How do I use the answers?', 'Use the themes for positioning, onboarding and your roadmap. Each Action Item links to the quote behind it, so your team can hear the customer and not just read a summary.'],
  ],
  closing: { title: 'Your best customers know why they stay.', marker: 'Let them tell Frank.', sub: 'Describe what you want to learn and hear from your customers before your next standup.' },
});

export const CHECKOUT = mk({
  slug: 'checkout-abandonment', tpl: 'checkout', label: 'Checkout abandonment', name: 'Checkout abandonment', icon: ShoppingCart,
  description: 'In a short voice or video interview, Frank asks shoppers who reached checkout without paying what interrupted the purchase, from doubts and unexpected costs to payment friction. Then it ranks every answer by how many customers raised it.',
  whenIcons: [ShoppingCart01Icon, DiscountTag01Icon, CreditCardIcon, Alert02Icon],
  launch: 'on the cart page, an exit-intent prompt or the abandoned-cart email,',
  hero: {
    turns: [
      ['frank', 'You added the jacket to your cart and didn’t order it. What happened?'],
      ['customer', 'The shipping cost showed up at the very end.'],
      ['frank', 'How much was it compared with what you expected?'],
      ['customer', 'About a quarter of the price. I wasn’t expecting that.'],
      ['frank', 'What did you do then?'],
      ['customer', 'I closed the tab and looked at other stores.'],
      ['frank', 'What would have kept you?'],
      ['customer', 'Knowing the shipping cost on the product page.'],
    ],
    title: ['Frank asks shoppers why they ', 'didn’t complete the order'],
    text: 'In a short voice or video interview, Frank learns what interrupted a purchase, from unresolved doubts and unexpected costs to payment friction. It works for e-commerce and digital checkouts alike. Then it ranks every answer by how many customers raised it.',
  },
  what: {
    phrase: 'a checkout abandonment interview?',
    sub: 'A checkout abandonment interview is a short conversation with a shopper who reached checkout and didn’t pay.',
    para: 'It finds out what they were buying, what happened at checkout, what surprised or worried them, and what they did next.',
    quote: 'Your analytics show the step where carts are dropped. They don’t show whether the shopper was surprised by a cost, worried about trust, or just comparing prices.',
  },
  when: [
    ['Right after a cart is abandoned', 'Show the interview in the abandoned-cart email or when someone leaves the checkout page.'],
    ['When checkout conversion drops', 'Find out whether a recent change, a cost, or a payment problem is to blame.'],
    ['Before you change shipping, pricing or payment options', 'Hear what shoppers expect at the last step.'],
    ['When discounts are masking a deeper problem', 'Learn whether people leave for the price or for a reason you can fix without one.'],
  ],
  guide: {
    title: ['The checkout abandonment', 'research guide.'],
    steps: [
      ['What they were buying', 'The product, the reason for buying it, and how sure they were.'],
      ['What happened at checkout', 'The step where they stopped, and what they saw and did there.'],
      ['What surprised or worried them', 'Unexpected costs, missing information, trust concerns or confusing steps.'],
      ['Whether payment got in the way', 'Missing payment methods, failed cards or forms that asked for too much.'],
      ['What they did next', 'Whether they bought elsewhere, waited, or gave up.'],
      ['What would have made them finish', 'The change that would have completed the purchase, and whether they’ll come back.'],
    ],
  },
  vs: {
    other: 'Cart abandonment email', shortOther: 'Email',
    title: ['An abandonment email offers a discount.', 'Frank finds out what stopped the order.'],
    rows: [
      ['What the customer does', 'Gets a reminder and maybe a code', 'Explains what stopped them'],
      ['“Too expensive”', 'Answered with a discount', 'Followed up: expensive overall, or surprised by a cost at the end?'],
      ['Follow-up questions', 'None', 'Asked whenever an answer is vague or doesn’t add up'],
      ['Trust and doubts', 'Invisible', 'Named, with what would have settled them'],
      ['Payment problems', 'Hidden in error logs', 'Described by the person who hit them'],
      ['What they did next', 'Not captured', 'Named, along with why'],
    ],
    close: ['Keep the reminder email to bring back the easy wins.', 'Run Frank when you need to know what stopped people from paying.'],
  },
  out: {
    caption: 'Why shoppers left an online clothing store at checkout. Example: 58 checkout abandonment interviews.',
    aria: 'Why shoppers left an online clothing store at checkout',
    total: 58,
    rows: [
      [23, 'Shipping cost appeared too late', 'Most of these shoppers didn’t see shipping until the final step, and it was higher than they expected.', 'Shipping was a quarter of the price and I only saw it on the last screen. It felt like a trick.'],
      [15, 'They weren’t sure about returns', 'These shoppers wanted to know how returns worked before they would pay.', 'I wasn’t sure the size would fit, and I couldn’t find the return policy without leaving checkout.'],
      [12, 'Their preferred payment method wasn’t offered', 'These shoppers didn’t want to type a card number for a store they didn’t know.', 'I wanted to pay with my wallet app. When it wasn’t there, I left.'],
      [8, 'They were just comparing prices', null, 'I wasn’t going to buy yet. I use the cart to keep track of what I’m comparing.'],
    ],
  },
  where: {
    title: 'Where they left',
    slices: [['Shipping options', 23], ['Payment', 14], ['Account creation', 9], ['Order review', 7], ['They couldn’t say', 5]],
  },
  actions: [
    ['Show estimated shipping on the product page and in the cart, before checkout.', 23],
    ['Put the return policy in a short summary next to the pay button.', 15],
    ['Add wallet payment options and a guest checkout.', 12],
  ],
  faq: [
    ['Who should I interview?', 'Shoppers who reached the payment step and didn’t complete the order, within a day or two. Include a mix of new and returning customers, since their reasons often differ.'],
    ['Does it work for SaaS and subscriptions?', 'Yes. Use the pricing or payment screen as the trigger. The AI Researcher adapts the Research Guide to your checkout, whether it sells products, plans or tickets.'],
    ['How do I reach people who left?', 'Show it as an exit-intent prompt, in the abandoned-cart email, or on the next visit. Keep it short and optional, and let people choose voice, video or WhatsApp (coming soon).'],
  ],
  closing: { title: 'Every abandoned cart has a reason.', marker: 'Let your shoppers tell Frank.', sub: 'Describe what you want to learn and hear from your shoppers before your next standup.' },
});

export const DOWNGRADE = mk({
  slug: 'downgrade-reasons', tpl: 'downgrade', label: 'Downgrade reasons', name: 'Downgrade reasons', icon: Wallet,
  description: 'In a short voice or video interview, Frank asks customers who moved to a cheaper plan or reduced seats whether their needs, budget, team usage or sense of value changed. Then it ranks every answer by how many customers raised it.',
  whenIcons: [AnalyticsDownIcon, Money01Icon, UserGroupIcon, Settings02Icon],
  launch: 'on the plan change confirmation, the seat-reduction screen or the follow-up email,',
  hero: {
    turns: [
      ['frank', 'You moved from the Business plan to Starter. What led to that?'],
      ['customer', 'We cut our budget and had to trim.'],
      ['frank', 'Which part of Business did you use the least?'],
      ['customer', 'The advanced analytics. Nobody opened it.'],
      ['frank', 'What did you keep?'],
      ['customer', 'Reports and sharing. That’s what we actually need.'],
      ['frank', 'What would bring you back to a higher plan?'],
      ['customer', 'If analytics was a separate add-on for the people who need it.'],
    ],
    title: ['Frank asks customers why they ', 'moved to a cheaper plan'],
    text: 'In a short voice or video interview, Frank learns whether customers’ needs, budgets, team usage or perception of value changed when they moved to a cheaper plan or reduced seats. Then it ranks every answer by how many customers raised it.',
  },
  what: {
    phrase: 'a downgrade interview?',
    sub: 'A downgrade interview is a short conversation with a customer who moved to a cheaper plan or reduced their seats.',
    para: 'It finds out what changed, which parts of the plan they stopped using, what they kept, and what would bring them back up.',
    quote: 'Your billing data shows who paid less. It doesn’t show whether they needed less, could afford less, or no longer saw what they were paying for.',
  },
  when: [
    ['Right after a plan change or a seat reduction', 'Show the interview on the confirmation screen, while the reasons are fresh.'],
    ['When contraction is rising', 'Learn whether the cause is budgets, unused features or something you changed.'],
    ['Before you redesign your plans', 'Hear which parts of each plan customers value and which they cut first.'],
    ['When you want to prevent a later cancellation', 'Downgrades often come before churn. Act while the customer is still here.'],
  ],
  guide: {
    title: ['The downgrade reasons', 'research guide.'],
    steps: [
      ['What led to the change', 'The moment they decided to move down, and who made the decision.'],
      ['What changed for them', 'Their budget, team size, priorities or workflow, and when that changed.'],
      ['What they used least', 'The features and seats that weren’t pulling their weight.'],
      ['What they kept and why', 'The parts of the product they still rely on.'],
      ['How they see the value', 'Whether the price still felt fair for what they got, and compared with what.'],
      ['What would bring them back', 'The change in plan, price or product that would make them move up again.'],
    ],
  },
  vs: {
    other: 'Plan change form', shortOther: 'Form',
    title: ['A plan change form asks for a reason.', 'Frank hears what changed.'],
    rows: [
      ['What the customer does', 'Picks a reason from a dropdown', 'Explains what changed and what they cut first'],
      ['“Budget cuts”', 'Logged as budget', 'Followed up: which parts of the plan were hardest to justify?'],
      ['Follow-up questions', 'None', 'Asked whenever an answer is vague or doesn’t add up'],
      ['Unused features', 'Visible only in usage data', 'Named by the customer, with why'],
      ['Who decided', 'Unknown', 'Named, along with what they were shown'],
      ['What would bring them back', 'A guess', 'Stated by the customer'],
    ],
    close: ['Keep the form to count reasons at the moment of change.', 'Run Frank when you need to know what customers stopped valuing.'],
  },
  out: {
    caption: 'Why customers of a team analytics tool moved to a cheaper plan. Example: 42 downgrade interviews.',
    aria: 'Why customers of a team analytics tool moved to a cheaper plan',
    total: 42,
    rows: [
      [16, 'They weren’t using the features that cost the most', 'Most of these customers said nobody opened the advanced analytics included in the higher plan.', 'The analytics were what we paid extra for, and I don’t think anyone opened them in six months.'],
      [12, 'Budgets were cut and they trimmed everywhere', 'These customers reduced several tools at once and kept the ones they could defend.', 'We cut every tool by about a third. Yours made it because the reports matter, but not at the old price.'],
      [8, 'The team got smaller', 'These customers removed seats after layoffs or reorganisations.', 'We lost four people this year, so I removed their seats. It wasn’t about the product.'],
      [6, 'They didn’t see enough value for the price', null, 'I couldn’t explain to my boss what we got for the higher plan. So I moved down.'],
    ],
  },
  where: {
    title: 'What they kept',
    slices: [['Reports and sharing', 17], ['Dashboards', 10], ['Integrations', 8], ['Support', 4], ['They couldn’t say', 3]],
  },
  actions: [
    ['Offer advanced analytics as an add-on for the customers who actually use it.', 16],
    ['Give admins a usage summary before renewal, showing what each plan feature delivered.', 12],
    ['Offer seat pausing, so teams can restore seats instead of re-buying them later.', 8],
  ],
  faq: [
    ['Who should I interview?', 'Customers who moved to a lower plan or removed seats in the last few weeks. Include a mix of reasons, such as budget, team changes and unused features.'],
    ['Does this prompt people to cancel?', 'Keep the tone as feedback, not a retention offer. Customers who are staying on a lower plan usually appreciate being asked what they need.'],
    ['How is this different from churn?', 'Churn interviews talk to customers who have left. Downgrade interviews talk to customers who stayed but paid less, so you can learn what they value and keep them from leaving.'],
  ],
  closing: { title: 'Every downgrade has a reason.', marker: 'Let your customers tell Frank.', sub: 'Describe what you want to learn and hear from your customers before your next standup.' },
});
