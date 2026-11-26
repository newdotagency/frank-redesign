// Use-case pages for the Churn page's other templates, part 1: activation, trial, adoption, funnel, engagement. See ./mk.js. The page words are drafted
// from the home page's template text; the study numbers and quotes are invented examples (the page labels them as such).
import { Rocket, Gauge, MousePointerClick, ArrowDownToLine, TrendingDown } from 'lucide-react';
import {
  UserAdd01Icon, Clock01Icon, Flag01Icon, Settings02Icon, CreditCardIcon, Target01Icon, Idea01Icon, UserGroupIcon, Megaphone01Icon,
  Search01Icon, Task01Icon, Notification01Icon, Layers01Icon, FlowIcon, Calendar01Icon, Alert02Icon, AnalyticsDownIcon, Exchange01Icon, HourglassIcon,
} from '@hugeicons/core-free-icons';
import { mk } from './mk';

export const ACTIVATION = mk({
  slug: 'activation-barriers', tpl: 'activation', label: 'Activation barriers', name: 'Activation barriers', icon: Rocket,
  description: 'In a short voice or video interview, Frank asks new sign-ups what they hoped to accomplish and what stopped them from getting a first useful result. Then it ranks every answer by how many customers raised it.',
  whenIcons: [UserAdd01Icon, Clock01Icon, Flag01Icon, Settings02Icon],
  launch: 'to your onboarding checklist, an empty state or the screen people land on after sign-up,',
  hero: {
    turns: [
      ['frank', 'What were you hoping to get done when you signed up?'],
      ['customer', 'Send my first report to a client.'],
      ['frank', 'What happened when you tried?'],
      ['customer', 'I couldn’t find where to connect my data.'],
      ['frank', 'What did you do next?'],
      ['customer', 'Closed the tab. I meant to come back.'],
      ['frank', 'What would have helped?'],
      ['customer', 'A short checklist on the first screen.'],
    ],
    title: ['Frank asks every new user why they ', 'never got started'],
    text: 'In a short voice or video interview, Frank learns what new sign-ups hoped to accomplish and what stopped them from getting a first useful result. It works for SaaS products and apps alike. Then it ranks every answer by how many customers raised it.',
  },
  what: {
    phrase: 'an activation interview?',
    sub: 'An activation interview is a short conversation with someone who signed up but never really got started.',
    para: 'It finds out what they hoped to accomplish, what they tried first, where they got stuck, and what would have gotten them to a first useful result.',
    quote: 'Your funnel shows the step where people stop. It doesn’t show what they were expecting to find there, or what they did instead.',
  },
  when: [
    ['A few days after sign-up with no key action', 'Invite people who haven’t reached your activation moment yet, while they still remember what they wanted.'],
    ['When onboarding completion looks low', 'Find out whether the problem is the setup, the wording, or the expectations people arrive with.'],
    ['Before you redesign onboarding', 'Hear what new users actually tried first, so the new flow fixes real friction.'],
    ['After a pricing or positioning change', 'Check whether the people you attract now expect something your first-run experience doesn’t deliver.'],
  ],
  guide: {
    title: ['The activation barriers', 'research guide.'],
    steps: [
      ['What they hoped to accomplish', 'The result they wanted from the product, and why they wanted it now.'],
      ['What they tried first', 'The first thing they did after signing up, and whether it was what they came for.'],
      ['Where they got stuck', 'The exact screen, step or word that stopped them. Frank asks for a specific moment instead of accepting “it was confusing.”'],
      ['What they expected to happen', 'What they thought the product would do next, and how that differed from what it did.'],
      ['What they did instead', 'Whether they gave up, asked a colleague, tried a competitor, or went back to a spreadsheet.'],
      ['What would have helped', 'The one thing that would have gotten them to a first useful result, and whether they’d try again.'],
    ],
  },
  vs: {
    other: 'Onboarding survey', shortOther: 'Survey',
    title: ['An onboarding survey asks how it went.', 'Frank hears where it stopped.'],
    rows: [
      ['What the customer does', 'Rates the experience from 1 to 5', 'Talks through what they wanted and what happened'],
      ['“It was confusing”', 'Logged as a low score', 'Followed up: which screen, and what were you expecting to see?'],
      ['Follow-up questions', 'None', 'Asked whenever an answer is vague or doesn’t add up'],
      ['People who never came back', 'Never reached, since they left before the survey', 'Invited by an automatic trigger a few days after sign-up'],
      ['What they expected', 'Rarely asked', 'Described in their own words'],
      ['What they did instead', 'Not captured', 'Named, along with why'],
    ],
    close: ['Keep the in-app rating for a quick pulse.', 'Run Frank when you need to know why people never got started.'],
  },
  out: {
    caption: 'What stopped new sign-ups from getting a first result in a reporting tool. Example: 60 activation interviews.',
    aria: 'What stopped new sign-ups from getting a first result in a reporting tool',
    total: 60,
    rows: [
      [24, 'Connecting their data was the first wall', 'Most of these customers wanted a report within minutes. The data connection step asked for credentials they didn’t have to hand.', 'I wanted to see a report in five minutes. I needed an admin password just to connect my data, so I stopped.'],
      [17, 'They didn’t know what “done” looked like', 'These customers finished the setup screens but never saw a clear first win, so they didn’t know whether they had succeeded.', 'I clicked through everything and then wasn’t sure what I was supposed to have now.'],
      [11, 'They expected a template to start from', 'A blank dashboard felt like homework. They had expected something prefilled they could adjust.', 'I thought there would be a sample report. A blank page made me close the tab.'],
      [8, 'Setup needed someone else’s approval', null, 'I had to ask IT before I could connect anything, and that took a week.'],
    ],
  },
  where: {
    title: 'Where they stopped',
    slices: [['Connecting their data', 24], ['Building the first report', 14], ['Inviting teammates', 10], ['Choosing a plan', 7], ['They couldn’t say', 5]],
  },
  actions: [
    ['Add a one-click sample dataset so new users see a report before connecting their own data.', 24],
    ['Show a three-step checklist with a clear finish line on the first screen.', 17],
    ['Offer a starter report template instead of a blank dashboard.', 11],
  ],
  faq: [
    ['Who should I interview?', 'People who signed up in the last few days and haven’t reached your activation moment, such as connecting data or creating a first project. Include people who left mid-setup, since they are the hardest to reach any other way.'],
    ['Does it work for mobile apps and e-commerce?', 'Yes. Define the moment you count as activated (a first order, a first saved item, a first message) and show the interview to people who haven’t reached it. The AI Researcher adapts the Research Guide to your product.'],
    ['Won’t an interview get in the way of onboarding?', 'Keep it short and optional, and show it to people who have gone quiet rather than people who are mid-flow. Let them pick voice, video or WhatsApp (coming soon). Most people are happy to explain what stopped them when someone asks.'],
  ],
  closing: { title: 'Every new user who left early has a reason.', marker: 'Let them tell Frank.', sub: 'Describe what you want to learn and hear from your new users before your next standup.' },
});

export const TRIAL = mk({
  slug: 'trial-conversion', tpl: 'trial', label: 'Trial conversion', name: 'Trial conversion', icon: Gauge,
  description: 'In a short voice or video interview, Frank asks trial users whether they got enough value, what stayed unresolved and why they didn’t buy. Then it ranks every answer by how many customers raised it.',
  whenIcons: [Calendar01Icon, Target01Icon, CreditCardIcon, Search01Icon],
  launch: 'to your trial-ending email, the trial expiry screen or the cancellation step,',
  hero: {
    turns: [
      ['frank', 'You tried us for 14 days. What were you hoping to find out?'],
      ['customer', 'Whether it could replace our spreadsheet for planning.'],
      ['frank', 'Did you find that out?'],
      ['customer', 'Partly. I never got to import our old data.'],
      ['frank', 'What stopped you from importing it?'],
      ['customer', 'The import tool needed a format I didn’t have.'],
      ['frank', 'What would have changed your decision?'],
      ['customer', 'Help moving my data. Then I’d have paid.'],
    ],
    title: ['Frank asks every trial user why they ', 'didn’t buy'],
    text: 'In a short voice or video interview, Frank learns whether trial users experienced enough value, what stayed unresolved, and why they didn’t purchase. Then it ranks every answer by how many customers raised it.',
  },
  what: {
    phrase: 'a trial conversion interview?',
    sub: 'A trial conversion interview is a short conversation with someone whose trial ended without a purchase.',
    para: 'It finds out what they were trying to decide, whether they saw enough value, what stayed unresolved, and what would have made them buy.',
    quote: 'Your trial funnel shows how many people didn’t convert. It doesn’t show whether they ran out of time, ran into a blocker, or simply decided it wasn’t for them.',
  },
  when: [
    ['When a trial ends without a purchase', 'Show the interview on the trial-ended screen or in the follow-up email, while the decision is still fresh.'],
    ['When conversion is below your target', 'Learn whether the cause is value, price, timing or something in the product.'],
    ['Before you change your trial length or plan', 'Hear whether people needed more time, more features, or a different offer.'],
    ['When sales can’t follow up with everyone', 'Frank talks to every trial that ended, not just the accounts a rep would have called.'],
  ],
  guide: {
    title: ['The trial conversion', 'research guide.'],
    steps: [
      ['What they wanted to find out', 'The question they hoped the trial would answer, and what was riding on it.'],
      ['What they actually tried', 'Which parts of the product they used, and which they didn’t get to.'],
      ['Whether they saw enough value', 'The moment, if any, when it felt worth paying for, and what was missing.'],
      ['What stayed unresolved', 'The doubts or questions the trial didn’t answer, from fit to security to price.'],
      ['What they decided and why', 'Whether they bought something else, stayed with their old way, or postponed the decision.'],
      ['What would have changed it', 'The one thing that would have made them buy, and whether they might come back.'],
    ],
  },
  vs: {
    other: 'Trial-ended survey', shortOther: 'Survey',
    title: ['A trial-ended survey asks for a reason.', 'Frank finds out what the trial didn’t answer.'],
    rows: [
      ['What the customer does', 'Picks a reason from a list', 'Explains what they were trying to decide'],
      ['“Too expensive”', 'Logged as price', 'Followed up: compared with what, and what would be fair for what you’d get?'],
      ['Follow-up questions', 'None', 'Asked whenever an answer is vague or doesn’t add up'],
      ['What they actually tried', 'Not captured', 'Walked through, feature by feature'],
      ['Unresolved doubts', 'Hidden behind “not right now”', 'Named, with how much each one mattered'],
      ['Who they chose instead', 'Rarely asked', 'Named, along with why'],
    ],
    close: ['Keep the survey for a quick count of reasons.', 'Run Frank when you need to know what would have made people buy.'],
  },
  out: {
    caption: 'Why trial users of a planning tool didn’t buy. Example: 50 trial conversion interviews.',
    aria: 'Why trial users of a planning tool didn’t buy',
    total: 50,
    rows: [
      [19, 'They never got their own data in', 'Most of these trial users wanted to test the tool on real work. The import step blocked them before they saw any value.', 'I wanted to try it on our real plan. I couldn’t get my data in, so all I tested was your demo.'],
      [14, 'The trial ended before the decision did', 'These customers needed a teammate’s sign-off and ran out of days waiting for it.', 'I liked it, but my manager was away for two weeks. The trial ended the day she came back.'],
      [10, 'They weren’t sure it fit their size of team', 'Pricing tiers made them unsure whether a team of six was the target.', 'I couldn’t tell whether the middle plan was meant for a team like ours.'],
      [7, 'They chose a tool they already paid for', null, 'Our other tool does about 70% of this. It wasn’t worth another subscription.'],
    ],
  },
  where: {
    title: 'What they decided',
    slices: [['Postponed the decision', 15], ['Stayed with their current tool', 12], ['Chose a competitor', 10], ['Went back to a spreadsheet', 8], ['Planning to come back', 5]],
  },
  actions: [
    ['Add guided data import to the first day of the trial, with a sample file for people who don’t have one.', 19],
    ['Offer a trial extension for teams who are waiting on an approver.', 14],
    ['Explain who each plan is for, with a team-size example, on the pricing page.', 10],
  ],
  faq: [
    ['Who should I interview?', 'Trial users whose trial ended without a purchase, within a few days of it ending. Include people who barely used the product, since their reasons are often the most useful.'],
    ['Does it work for free plans and freemium?', 'Yes. Use the moment someone hits a paywall or ends a free period as the trigger. The AI Researcher adapts the Research Guide to how your plans work.'],
    ['Won’t a follow-up feel pushy?', 'Position it as a request for feedback, not a sales call, and keep it short and optional. People who didn’t buy are often happy to explain why when nobody is trying to change their mind.'],
  ],
  closing: { title: 'Every trial that ended has a reason.', marker: 'Let them tell Frank.', sub: 'Describe what you want to learn and hear from your trial users before your next standup.' },
});

export const ADOPTION = mk({
  slug: 'feature-adoption', tpl: 'adoption', label: 'Feature adoption', name: 'Feature adoption', icon: MousePointerClick,
  description: 'In a short voice or video interview, Frank asks customers whether they know about a feature, need it and can use it, and what makes them continue or stop. Then it ranks every answer by how many customers raised it.',
  whenIcons: [Flag01Icon, Notification01Icon, Layers01Icon, Settings02Icon],
  launch: 'inside the feature, after a first use, or on the screen where the feature is announced,',
  hero: {
    turns: [
      ['frank', 'Have you tried scheduled reports yet?'],
      ['customer', 'I opened it once and left.'],
      ['frank', 'What made you leave?'],
      ['customer', 'I wasn’t sure what it would send, or to whom.'],
      ['frank', 'What did you expect to see?'],
      ['customer', 'A preview of the email before I turned it on.'],
      ['frank', 'Would you use it with a preview?'],
      ['customer', 'Yes. I send that report every Monday by hand.'],
    ],
    title: ['Frank asks users why a feature ', 'isn’t catching on'],
    text: 'In a short voice or video interview, Frank learns whether customers know about a feature, need it and can use it successfully, and what makes them continue or stop. Then it ranks every answer by how many customers raised it.',
  },
  what: {
    phrase: 'a feature adoption interview?',
    sub: 'A feature adoption interview is a short conversation with customers who had the chance to use a feature and mostly didn’t.',
    para: 'It finds out whether they noticed it, whether they needed it, whether they could use it, and what makes them keep using it or drop it.',
    quote: 'Your analytics show how many people clicked the feature. They don’t show who never saw it, who didn’t need it, and who tried it and gave up.',
  },
  when: [
    ['After a launch, when usage is lower than planned', 'Find out whether people missed it, didn’t need it, or couldn’t make it work.'],
    ['When a feature gets one use and no second', 'Hear what happened between the first try and the silence after it.'],
    ['Before you invest more in a feature', 'Learn which part of it customers value, so the next release builds on that.'],
    ['When support keeps answering the same question', 'Understand what the interface doesn’t explain.'],
  ],
  guide: {
    title: ['The feature adoption', 'research guide.'],
    steps: [
      ['Whether they know about it', 'How they found out the feature exists, or why they hadn’t seen it.'],
      ['Whether they need it', 'The job they would use it for, and how they do that job today.'],
      ['What happened when they tried', 'The first use, step by step, and where it stopped feeling clear.'],
      ['Whether they can use it successfully', 'What they expected the feature to produce and whether it did.'],
      ['What makes them continue or stop', 'What brought them back, or what made them go back to the old way.'],
      ['What would make it worth using', 'The change that would turn a one-time try into a habit.'],
    ],
  },
  vs: {
    other: 'Usage analytics', shortOther: 'Analytics',
    title: ['Analytics show who clicked.', 'Frank hears why they didn’t come back.'],
    rows: [
      ['What the customer does', 'Clicks, or doesn’t', 'Explains what they expected and what happened'],
      ['“Low usage”', 'Logged as a number', 'Followed up: did you see it, did you need it, or did it not work?'],
      ['Follow-up questions', 'None', 'Asked whenever an answer is vague or doesn’t add up'],
      ['People who never saw it', 'Indistinguishable from people who didn’t need it', 'Told apart in the first two questions'],
      ['Where it broke', 'A drop-off at a step', 'The exact moment, in their words'],
      ['What would help', 'A guess from the data', 'Stated by the customer'],
    ],
    close: ['Keep analytics for how much, and where.', 'Run Frank when you need to know why a feature isn’t catching on.'],
  },
  out: {
    caption: 'Why customers aren’t using a new scheduled-reports feature. Example: 48 feature adoption interviews.',
    aria: 'Why customers aren’t using a new scheduled-reports feature',
    total: 48,
    rows: [
      [18, 'They didn’t trust what it would send', 'Most of these customers opened the feature, then left because they couldn’t preview what recipients would receive.', 'I wasn’t going to turn on something that emails my clients without seeing what it looks like.'],
      [14, 'They never knew it existed', 'The feature sat behind a menu that these customers never opened.', 'I’ve been sending that report by hand every Monday. I had no idea this was there.'],
      [10, 'They needed a different schedule', 'Weekly and monthly weren’t enough for customers who report at quarter-end or after campaigns.', 'I need it to go out on the first working day of the quarter. There’s no way to do that.'],
      [6, 'They tried it and went back', null, 'It worked once. Then my filters reset, so I went back to doing it manually.'],
    ],
  },
  where: {
    title: 'Where it fell apart',
    slices: [['Before they found it', 14], ['Setting it up', 13], ['Choosing a schedule', 10], ['After the first send', 6], ['They couldn’t say', 5]],
  },
  actions: [
    ['Add a preview of the email before a schedule can be turned on.', 18],
    ['Surface the feature from the report page, where people are already doing the job by hand.', 14],
    ['Add custom schedules, including first working day of the quarter.', 10],
  ],
  faq: [
    ['Who should I interview?', 'A mix of people who used the feature once, people who never opened it, and people who use it regularly. Frank asks the first questions to tell them apart.'],
    ['Does it work for features still in beta?', 'Yes. Show the interview to people in the beta after their first or second use. The AI Researcher adapts the Research Guide to the feature.'],
    ['How is this different from product discovery?', 'Product discovery happens before you build, to find the right problem. Feature adoption happens after you ship, to find out what stands between customers and the value you built.'],
  ],
  closing: { title: 'Every unused feature has a story.', marker: 'Let your customers tell Frank.', sub: 'Describe what you want to learn and hear from your customers before your next standup.' },
});

export const FUNNEL = mk({
  slug: 'funnel-drop-off', tpl: 'funnel', label: 'Funnel drop-off', name: 'Funnel drop-off', icon: ArrowDownToLine,
  description: 'In a short voice or video interview, Frank asks people who started a process but didn’t finish what happened at that step, what they expected and why they stopped. Then it ranks every answer by how many customers raised it.',
  whenIcons: [FlowIcon, Alert02Icon, AnalyticsDownIcon, Settings02Icon],
  launch: 'on the step where people leave, an exit-intent prompt or the reminder email,',
  hero: {
    turns: [
      ['frank', 'You started signing up and didn’t finish. What happened?'],
      ['customer', 'It asked for my company’s tax ID.'],
      ['frank', 'What did you do when it asked?'],
      ['customer', 'I didn’t have it, so I left to find it.'],
      ['frank', 'Did you go back?'],
      ['customer', 'No. I forgot, then I got busy.'],
      ['frank', 'What would have made it easier to continue?'],
      ['customer', 'Let me skip it and add it later.'],
    ],
    title: ['Frank asks people why they ', 'stopped halfway'],
    text: 'In a short voice or video interview, Frank learns what happened at a specific step, what people expected and why they stopped. It works for any workflow: sign-up, onboarding, applications, bookings or forms. Then it ranks every answer by how many customers raised it.',
  },
  what: {
    phrase: 'a funnel drop-off interview?',
    sub: 'A funnel drop-off interview is a short conversation with someone who started a process and didn’t finish it.',
    para: 'It finds out what they were trying to do, what happened at the step where they stopped, what they expected instead, and what they did next.',
    quote: 'Your funnel report shows the step where people leave. It doesn’t show what they saw there, what they were expecting, or whether they ever meant to come back.',
  },
  when: [
    ['When one step loses the most people', 'Ask the people who left at that step what stopped them, while they still remember.'],
    ['After you change a form or flow', 'Learn whether the change helped or just moved the problem to the next step.'],
    ['When you can’t tell friction from intent', 'Separate people who changed their mind from people who got blocked.'],
    ['Before you add steps or fields', 'Hear what people will and won’t hand over, and when.'],
  ],
  guide: {
    title: ['The funnel drop-off', 'research guide.'],
    steps: [
      ['What they were trying to do', 'The goal that started the process, and how important it was to finish.'],
      ['What happened at the step', 'The screen where they stopped, and what they saw and did there.'],
      ['What they expected instead', 'What they thought would happen next, and how this step differed.'],
      ['Whether anything was unclear or missing', 'Information, options or reassurance they were looking for and couldn’t find.'],
      ['What they did next', 'Whether they left, tried again, switched device, or went somewhere else.'],
      ['What would have kept them going', 'The change that would have made them finish, and whether they plan to come back.'],
    ],
  },
  vs: {
    other: 'Funnel report', shortOther: 'Funnel',
    title: ['A funnel report shows where people leave.', 'Frank hears why.'],
    rows: [
      ['What the customer does', 'Leaves, silently', 'Explains what they were doing and what stopped them'],
      ['“Abandoned at step 3”', 'Logged as a percentage', 'Followed up: what did you see, and what were you expecting?'],
      ['Follow-up questions', 'None', 'Asked whenever an answer is vague or doesn’t add up'],
      ['Intent', 'Unknown', 'Clear: changed their mind, got blocked, or got interrupted'],
      ['What they did next', 'Not captured', 'Named, along with why'],
      ['Fixes to test', 'A hypothesis from the data', 'Suggested by the customers who left'],
    ],
    close: ['Keep the funnel report to find where.', 'Run Frank when you need to know why people stopped.'],
  },
  out: {
    caption: 'Why people stopped partway through sign-up for a business account. Example: 55 funnel drop-off interviews.',
    aria: 'Why people stopped partway through sign-up for a business account',
    total: 55,
    rows: [
      [22, 'They didn’t have the information the form asked for', 'Most of these people left to find a tax ID or company number and didn’t come back.', 'It wanted a tax ID right then. I didn’t have it on me, so I left to look for it and never went back.'],
      [15, 'They couldn’t tell what would happen after submitting', 'These people were unsure whether they would be charged, or whether anyone would call them.', 'I didn’t know if pressing the button would charge me. I didn’t want to find out.'],
      [11, 'They were interrupted and nothing reminded them', 'These people meant to finish and didn’t. Their progress wasn’t saved.', 'I had a meeting. When I came back to the tab, I would have had to start over.'],
      [7, 'They changed their mind', null, 'I realised I could use my personal account for now. I wasn’t blocked, I just didn’t need it yet.'],
    ],
  },
  where: {
    title: 'Where they stopped',
    slices: [['Company details', 22], ['Choosing a plan', 12], ['Payment', 9], ['Email verification', 7], ['They couldn’t say', 5]],
  },
  actions: [
    ['Let people skip the tax ID and add it later, with a reminder before the first invoice.', 22],
    ['Say what happens after submitting, including whether a card is charged.', 15],
    ['Save progress and send a one-click link back to the unfinished step.', 11],
  ],
  faq: [
    ['Who should I interview?', 'People who reached a specific step and left without finishing it, within a day or two. Pick one step at a time so the answers are comparable.'],
    ['How does Frank reach people who left?', 'Show the interview on the step where they leave, on an exit-intent prompt, or in a reminder email to people who gave their address earlier in the flow.'],
    ['Does it work outside of sign-up?', 'Yes. Frank can follow any workflow: applications, bookings, quote requests, onboarding or checkout. The AI Researcher adapts the Research Guide to the step you care about.'],
  ],
  closing: { title: 'Every drop-off is someone with a reason.', marker: 'Let them tell Frank.', sub: 'Describe what you want to learn and hear from the people who left before your next standup.' },
});

export const ENGAGEMENT = mk({
  slug: 'declining-engagement', tpl: 'engagement', label: 'Declining engagement', name: 'Declining engagement', icon: TrendingDown,
  description: 'In a short voice or video interview, Frank asks previously active customers what changed in their needs or experience and whether another solution took over. Then it ranks every answer by how many customers raised it.',
  whenIcons: [AnalyticsDownIcon, Clock01Icon, Exchange01Icon, UserGroupIcon],
  launch: 'to a re-engagement email, an in-app message for dormant users or the login screen,',
  hero: {
    turns: [
      ['frank', 'You used to log in daily. What changed?'],
      ['customer', 'Our team moved to a different workflow.'],
      ['frank', 'What changed about the workflow?'],
      ['customer', 'Most of the work now happens in our CRM.'],
      ['frank', 'What do you still use us for?'],
      ['customer', 'Monthly reports. That’s about it.'],
      ['frank', 'What would bring you back more often?'],
      ['customer', 'If reports came to me, without me logging in.'],
    ],
    title: ['Frank asks active customers why they’re ', 'using you less'],
    text: 'In a short voice or video interview, Frank learns what changed in a customer’s needs or experience, and whether another solution or workaround took over. Then it ranks every answer by how many customers raised it.',
  },
  what: {
    phrase: 'a declining engagement interview?',
    sub: 'A declining engagement interview is a short conversation with a customer who used to be active and has slowed down.',
    para: 'It finds out what they used the product for, when that changed, what replaced it, and what would bring them back.',
    quote: 'Your usage chart shows who slowed down. It doesn’t show whether they outgrew you, switched workflows, or are quietly moving to something else.',
  },
  when: [
    ['When active users go quiet', 'Reach customers while they still use the product, before they decide to cancel.'],
    ['When seat or login counts decline', 'Learn whether people left the company, changed roles, or stopped needing it.'],
    ['After a big product or pricing change', 'Hear whether the change altered how people work with you.'],
    ['Before a renewal conversation', 'Understand how much value a customer still gets, so you can act on it.'],
  ],
  guide: {
    title: ['The declining engagement', 'research guide.'],
    steps: [
      ['How they used it before', 'The workflows they relied on, how often, and with whom.'],
      ['When usage started to change', 'The moment they noticed they were opening it less, and what happened around then.'],
      ['What changed in their work', 'A new role, tool, team, process or priority that shifted what they needed.'],
      ['What took over', 'A competitor, an internal tool, a workaround or a spreadsheet that now does the job.'],
      ['What they still use it for', 'The parts that remain valuable, and who still depends on them.'],
      ['What would bring them back', 'The change that would make it part of their routine again.'],
    ],
  },
  vs: {
    other: 'Usage dashboard', shortOther: 'Dashboard',
    title: ['A usage dashboard shows who slowed down.', 'Frank hears what replaced you.'],
    rows: [
      ['What the customer does', 'Logs in less, silently', 'Explains what changed in how they work'],
      ['“Usage is down 40%”', 'Logged as a trend', 'Followed up: what do you do now instead, and when did that start?'],
      ['Follow-up questions', 'None', 'Asked whenever an answer is vague or doesn’t add up'],
      ['Workarounds', 'Invisible', 'Named, with why they work better'],
      ['Who is still using it', 'A count of logins', 'A description of who depends on it, and for what'],
      ['What would bring them back', 'A guess', 'Stated by the customer'],
    ],
    close: ['Keep the dashboard to spot who slowed down.', 'Run Frank when you need to know why, before they cancel.'],
  },
  out: {
    caption: 'Why previously active customers of a reporting tool are using it less. Example: 44 declining engagement interviews.',
    aria: 'Why previously active customers of a reporting tool are using it less',
    total: 44,
    rows: [
      [17, 'The work moved into another tool', 'Most of these customers now do the job inside their CRM and only log in for monthly exports.', 'Everything we do now happens in our CRM. I only open your tool to pull the monthly numbers.'],
      [12, 'The person who championed it left', 'These teams lost the one person who knew how to use the advanced features.', 'Dana set it all up, then she left in the spring. None of us really know how her reports work.'],
      [9, 'Their needs got simpler', 'These customers no longer needed the depth they paid for.', 'We’re a smaller team than we were. We just need a couple of numbers now.'],
      [6, 'They didn’t get the value they expected', null, 'It never gave us the insight I thought it would. I stopped checking after a few months.'],
    ],
  },
  where: {
    title: 'What took over',
    slices: [['Their CRM', 17], ['A spreadsheet', 11], ['An internal tool', 7], ['A competitor', 5], ['Nothing', 4]],
  },
  actions: [
    ['Send scheduled reports so customers get value without logging in.', 17],
    ['Add a handover guide and a check-in when an account’s main user leaves.', 12],
    ['Offer a lighter plan and a simple dashboard for customers whose needs have narrowed.', 9],
  ],
  faq: [
    ['Who should I interview?', 'Customers whose usage fell below their own recent average, with a mix of those still logging in occasionally and those who stopped. Pick a clear threshold so the group is consistent.'],
    ['Doesn’t this risk prompting people to cancel?', 'Frame it as a request for feedback and keep it short. Customers who are quietly leaving are usually glad someone asked, and you learn what to fix while you still have time.'],
    ['How is this different from a churn interview?', 'Churn interviews talk to customers who have already cancelled. Declining engagement interviews talk to customers who are still with you but moving away, so you can act before they leave.'],
  ],
  closing: { title: 'Every drop in usage has a reason.', marker: 'Let your customers tell Frank.', sub: 'Describe what you want to learn and hear from your customers before your next standup.' },
});
