// Structure of the public landing page: order, icons and accent colours.
// Every user-facing string lives in the `landing.*` namespace of the locale
// files; each entry's `id` is the key used to look its copy up.
import {
  BarChart3,
  Brain,
  CircleCheck,
  FileText,
  Globe2,
  Linkedin,
  Mail,
  ShieldAlert,
  Target,
  Twitter,
  Users,
  Wand2,
} from 'lucide-react';

// `id` doubles as the section's DOM id, so it stays kebab-case for the anchor;
// `key` is its camelCase counterpart under `landing.nav`.
export const NAV_LINKS = Object.freeze([
  { id: 'hero', key: 'home' },
  { id: 'features', key: 'features' },
  { id: 'how-it-works', key: 'howItWorks' },
  { id: 'about', key: 'about' },
  { id: 'contact', key: 'contact' },
]);

export const FEATURES = Object.freeze([
  { id: 'analysis', icon: Users, accent: 'violet' },
  { id: 'bigFive', icon: Brain, accent: 'blue' },
  { id: 'workMode', icon: Globe2, accent: 'violet' },
  { id: 'recommendations', icon: Target, accent: 'rose' },
  { id: 'riskMonitoring', icon: ShieldAlert, accent: 'blue' },
  { id: 'reports', icon: BarChart3, accent: 'emerald' },
]);

export const STEPS = Object.freeze([
  { id: 'define', icon: FileText, accent: 'violet' },
  { id: 'evaluate', icon: Users, accent: 'blue' },
  { id: 'recommend', icon: Wand2, accent: 'rose' },
  { id: 'decide', icon: CircleCheck, accent: 'emerald' },
]);

export const SOCIAL_LINKS = Object.freeze([
  { id: 'linkedin', icon: Linkedin, href: '#contact' },
  { id: 'twitter', icon: Twitter, href: '#contact' },
  { id: 'email', icon: Mail, href: 'mailto:hola@sara.app' },
]);

// The product name is a proper noun and the tagline spells out the acronym, so
// neither is translated. Cased to match the wordmark in AuthHeader/TopNavBar.
export const BRAND = Object.freeze({
  name: 'Sara',
  tagline: 'Smart Assignment\nand Risk Analysis',
});
