export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
}

export interface ProjectGroup {
  groupTitle: string;
  items: Project[];
}

export interface ExperienceEntry {
  period: string;
  role: string;
  place: string;
  description: string;
}

export interface EducationEntry {
  title: string;
  detail: string;
}

export interface SkillItem {
  name: string;
  level: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteContent {
  meta: {
    title: string;
    languageName: string;
  };
  nav: NavItem[];
  hero: {
    greeting: string;
    name: string;
    bio: string;
    downloadCv: string;
    photoAlt: string;
  };
  projects: {
    heading: string;
    groups: ProjectGroup[];
  };
  experience: {
    heading: string;
    entries: ExperienceEntry[];
  };
  education: {
    heading: string;
    entries: EducationEntry[];
  };
  skills: {
    heading: string;
    categories: SkillCategory[];
  };
  contact: {
    heading: string;
    email: string;
    phone: string;
    city: string;
    githubUrl: string;
    githubLabel: string;
  };
}
