import { BarChart3, Mail, Search, Users } from 'lucide-react';

export const NAV_LINKS = [
  { href: '#platform', label: 'Platform', hasChevron: true },
  { href: '#resources', label: 'Resources', hasChevron: true },
  { href: '#solutions', label: 'Solutions', hasChevron: true },
  { href: '#pricing', label: 'Enterprise' },
  { href: '#pricing', label: 'Pricing' },
];

export const MOBILE_NAV_LINKS = [
  { href: '#platform', label: 'Platform' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#pricing', label: 'Pricing' },
];

export const DASHBOARD_STATS = [
  { label: 'Total Bookings', value: '1,248', trend: '+12%', up: true },
  { label: 'Meeting Hours', value: '624h', trend: '+5%', up: true },
  { label: 'No-Show Rate', value: '2.4%', trend: '-1.1%', up: false },
  { label: 'Time Saved', value: '156h', trend: '+18%', up: true },
];

export const ROUTING_BARS = [40, 70, 30, 90, 60, 80, 50];

export const TESTIMONIALS = [
  {
    company: 'Stripe',
    quote:
      'The scheduling and topic routing insights are insanely practical. We shipped changes in a day and saw conversion lift across key pages, with clearer actions for the sales team.',
    author: 'James Carter',
    role: 'Product Owner',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
  },
  {
    company: 'Zapier',
    quote:
      'Finally made scheduling analytics measurable for us. We can see exactly where we show up, what gets booked, and what to fix next in our funnel.',
    author: 'Michael Brooks',
    role: 'Head of Growth',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  },
];

export const FOOTER_LINKS = [
  { href: '#platform', label: 'Platform' },
  { href: '#resources', label: 'Resources' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#login', label: 'Log in' },
];

export const ADDITIONAL_FEATURES = [
  {
    title: 'Team Scheduling',
    desc: "Manage your team's availability in one place.",
    Icon: Users,
  },
  {
    title: 'Meeting Insights',
    desc: 'Monitor every conversion and booking source.',
    Icon: BarChart3,
  },
  {
    title: 'Content & Demand',
    desc: 'Create booking links that rank in traditional search.',
    Icon: Search,
  },
  {
    title: 'Automated Comms',
    desc: 'Control how your brand narratives appear in reminders.',
    Icon: Mail,
  },
];
