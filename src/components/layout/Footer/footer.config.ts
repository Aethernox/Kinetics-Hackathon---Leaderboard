export interface SocialLinkItem {
  id: string;
  name: string;
  url: string;
  icon: 'github' | 'linkedin' | 'x' | 'instagram' | 'website' | 'youtube';
  ariaLabel: string;
  label: string;
}

export interface FooterConfig {
  brand: {
    clubName: string;
    tagline: string;
    logoSrc: string;
    logoAlt: string;
  };
  heading: string;
  socialLinks: SocialLinkItem[];
  eventLabel: string;
  copyright: string;
}

/**
 * Safely extracts environment variables with fallback support.
 * Ensures zero hardcoded URLs in components.
 */
const getEnv = (keys: string[], fallback: string = ''): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      for (const key of keys) {
        const val = import.meta.env[key];
        if (typeof val === 'string' && val.trim().length > 0) {
          return val.trim();
        }
      }
    }
  } catch {
    // Graceful fallback for non-Vite execution contexts
  }
  return fallback;
};

export const getSocialFooterConfig = (): FooterConfig => {
  const githubUrl = getEnv(
    ['VITE_KINETIC_GITHUB_URL', 'VITE_GITHUB_URL'],
    'https://github.com/kinetic-robotics'
  );
  const linkedinUrl = getEnv(
    ['VITE_KINETIC_LINKEDIN_URL', 'VITE_LINKEDIN_URL'],
    'https://linkedin.com/company/kinetic-robotics-club'
  );
  const xUrl = getEnv(
    ['VITE_KINETIC_X_URL', 'VITE_X_URL', 'VITE_KINETIC_TWITTER_URL', 'VITE_TWITTER_URL'],
    'https://x.com/kinetic_nitd'
  );
  const instagramUrl = getEnv(
    ['VITE_KINETIC_INSTAGRAM_URL', 'VITE_INSTAGRAM_URL'],
    'https://instagram.com/kinetic_nitdelhi'
  );
  const websiteUrl = getEnv(
    ['VITE_KINETIC_WEBSITE_URL', 'VITE_WEBSITE_URL'],
    'https://kinetic.nitdelhi.ac.in'
  );

  const allSocials: SocialLinkItem[] = [
    {
      id: 'github',
      name: 'GitHub',
      label: 'GitHub',
      url: githubUrl,
      icon: 'github',
      ariaLabel: 'Follow Kinetic Robotics Club on GitHub',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      label: 'LinkedIn',
      url: linkedinUrl,
      icon: 'linkedin',
      ariaLabel: 'Connect with Kinetic Robotics Club on LinkedIn',
    },
    {
      id: 'x',
      name: 'X',
      label: 'X',
      url: xUrl,
      icon: 'x',
      ariaLabel: 'Follow Kinetic Robotics Club on X (formerly Twitter)',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      label: 'Instagram',
      url: instagramUrl,
      icon: 'instagram',
      ariaLabel: 'Follow Kinetic Robotics Club on Instagram',
    },
    {
      id: 'website',
      name: 'Website',
      label: 'Website',
      url: websiteUrl,
      icon: 'website',
      ariaLabel: 'Visit Kinetic Robotics Club Official Website',
    },
  ];

  // Filter out any social link whose URL is empty or unconfigured
  const activeSocials = allSocials.filter(
    (item) => item.url && item.url.trim().length > 0 && item.url !== '#'
  );

  const currentYear = new Date().getFullYear();

  return {
    brand: {
      clubName: 'KINETIC',
      tagline: 'INNOVATION IN MOTION',
      logoSrc: 'logo.png',
      logoAlt: 'KINETIC Robotics Club Logo',
    },
    heading: 'CONNECT WITH US',
    socialLinks: activeSocials,
    eventLabel: 'KINETICS 2026 • AUTONOMOUS ROBOTICS',
    copyright: `© ${currentYear} KINETIC Robotics Club. All rights reserved.`,
  };
};
