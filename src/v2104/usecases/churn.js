// Churn use-case template data (brief "Landing Page: Churn Reasons Interview", 2026-11-16).
// hero: the CallCard (video call + chat bubbles). clip: the customer's call card in /videos (call-05 is used
// nowhere else on the site but the home hero); person: the example customer's name; turns: the looping
// conversation, opening with the template's core question. Drafted from the brief: its "too expensive" line,
// then its guide (when things changed: a reorg, a new tool; what would have kept them).
// steps: [title, description]: the research guide, the brief's words verbatim.
// icon: the use case's mega-menu icon (MegaMenu.jsx, Solutions › Churn), shown on the CallCard.
import { UserMinus } from 'lucide-react';

export const CHURN = {
  icon: UserMinus,
  label: 'Churn',
  name: 'Churn interview',
  hero: {
    clip: 'call-05-card',
    focus: 0.59, // Jordan's face sits right of the clip's middle
    person: 'Jordan',
    turns: [
      ['frank', 'Why did you cancel?'],
      ['customer', 'Honestly, it got too expensive.'],
      ['frank', 'Too expensive for how your team was using it?'],
      ['customer', 'For the three of us who still used it, yes.'],
      ['frank', 'When did the others stop logging in?'],
      ['customer', 'After the reorg in spring. Reporting moved into our CRM.'],
      ['frank', 'What would have kept you?'],
      ['customer', 'A smaller plan for a small team. We\u2019d come back for that.'],
    ],
  },
  // questions: two example questions per guide step; the research guide shows the first of each.
  // Drafted from each step's description; the page labels them as examples.
  questions: [
    ['What were you hoping it would help you do when you signed up?', 'What were you using before?'],
    ['Which parts did you use every week?', 'Who else on your team logged in?'],
    ['When did you first think about leaving?', 'What happened around that time?'],
    ['Can you give me a specific example of where it fell short?', 'What did you expect to happen instead?'],
    ['What will you use instead?', 'What does it do better for you?'],
    ['Was there anything that would have changed your mind?', 'Would you consider coming back?'],
  ],
  steps: [
    ['Why they signed up', 'What they hoped the product would do for them. Everything after is measured against this.'],
    ['How they actually used it', 'Which workflows they relied on, who on the team logged in, and how often.'],
    ['When things changed', 'The moment they first thought about leaving, and what set it off: a price increase, a missing feature, a new tool, a reorg.'],
    ['What didn’t live up to expectations', 'Frank asks for a specific example instead of accepting a general complaint.'],
    ['What they’ll use instead', 'A competitor, a tool they already pay for, a spreadsheet, or nothing at all. This is who you’re really losing to.'],
    ['What would have kept them', 'Whether anything could have changed the decision, and whether they’d consider coming back.'],
  ],
};
