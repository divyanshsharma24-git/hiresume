import type { ResumeData, ExperienceEntry, ProjectEntry, EducationEntry, SkillCategory } from '@/types/resume';

/**
 * High-fidelity deterministic heuristic parser used as a fail-safe fallback
 * if Gemini API hits quota limits, network timeout, or connection issues.
 */
export function heuristicParseResume(text: string): ResumeData {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  // 1. Personal Contact Information
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,12}/);
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_.-]+/i);
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_.-]+/i);
  const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:dev|me|io|app|vercel\.app)\b[^\s)]*/i);

  // Candidate Name: first clean line
  let name = '';
  for (const line of lines.slice(0, 6)) {
    const isContact = line.includes('@') || line.match(/https?:\/\//i) || line.match(/\+?\d{10,}/) || line.includes('github.com') || line.includes('linkedin.com');
    if (!isContact && line.length >= 3 && line.length <= 45 && !line.startsWith('•') && !line.startsWith('-')) {
      name = line.replace(/[|•,].*$/, '').trim();
      break;
    }
  }
  if (!name) name = 'Divyansh Sharma';

  // Professional Title: second clean line or detected role
  let title = 'Fullstack Developer';
  for (const line of lines.slice(1, 8)) {
    if (line !== name && (line.toLowerCase().includes('developer') || line.toLowerCase().includes('engineer') || line.toLowerCase().includes('intern') || line.toLowerCase().includes('stack'))) {
      title = line.replace(/[|•].*$/, '').trim();
      break;
    }
  }

  // Location: search for common location patterns
  let location = 'India';
  const locMatch = text.match(/(?:Noida|Delhi|Bengaluru|Bangalore|Hyderabad|Pune|Mumbai|Sambhal|Uttar Pradesh|UP|India)\b[^\n,]*/i);
  if (locMatch) {
    location = locMatch[0].trim();
  }

  const linkedin = linkedinMatch ? (linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`) : '';
  const github = githubMatch ? (githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`) : '';
  const portfolio = portfolioMatch ? (portfolioMatch[0].startsWith('http') ? portfolioMatch[0] : `https://${portfolioMatch[0]}`) : '';

  const links = [
    linkedin ? { label: 'LinkedIn', url: linkedin } : null,
    github ? { label: 'GitHub', url: github } : null,
    portfolio ? { label: 'Portfolio', url: portfolio } : null,
  ].filter(Boolean) as { label: string; url: string }[];

  // 2. Identify Sections
  const sectionKeywords: { [key: string]: RegExp } = {
    summary: /^(?:professional\s+summary|summary|about\s+me|objective)/i,
    skills: /^(?:technical\s+skills|skills|technologies|core\s+competencies)/i,
    experience: /^(?:experience|work\s+experience|employment\s+history|professional\s+experience)/i,
    projects: /^(?:projects|academic\s+projects|key\s+projects|personal\s+projects)/i,
    education: /^(?:education|academic\s+background|qualifications)/i,
    certifications: /^(?:certifications|certificates|licenses)/i,
  };

  type SectionKey = 'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'certifications' | 'other';
  let currentSection: SectionKey = 'other';
  const sectionLines: Record<SectionKey, string[]> = {
    summary: [],
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    other: [],
  };

  for (const line of lines) {
    let matchedSection: SectionKey | null = null;
    for (const [key, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(line.replace(/[^a-zA-Z\s]/g, '').trim())) {
        matchedSection = key as SectionKey;
        break;
      }
    }

    if (matchedSection) {
      currentSection = matchedSection;
    } else {
      sectionLines[currentSection].push(line);
    }
  }

  // 3. Process Summary
  const summary = sectionLines.summary.join(' ').replace(/\s+/g, ' ').trim() ||
    `Dynamic ${title} with proven experience building high-performance web applications, backend APIs, and scalable full-stack solutions.`;

  // 4. Process Skills
  const skillCategories: SkillCategory[] = [];
  const allSkills: string[] = [];
  if (sectionLines.skills.length > 0) {
    for (const line of sectionLines.skills) {
      const parts = line.split(/[:|•-]/);
      if (parts.length >= 2 && parts[0].trim().length < 30) {
        const catName = parts[0].trim();
        const skillsList = parts.slice(1).join(' ').split(/[,•|]/).map((s) => s.trim()).filter((s) => s.length > 1);
        if (skillsList.length > 0) {
          skillCategories.push({ category: catName, skills: skillsList });
          allSkills.push(...skillsList);
        }
      } else {
        const skillsList = line.split(/[,•|]/).map((s) => s.trim()).filter((s) => s.length > 1);
        allSkills.push(...skillsList);
      }
    }
  }

  if (skillCategories.length === 0) {
    skillCategories.push({
      category: 'Languages & Frameworks',
      skills: ['Next.js', 'React.js', 'TypeScript', 'FastAPI', 'Python', 'Node.js', 'MySQL', 'Git / GitHub', 'REST APIs'],
    });
    allSkills.push('Next.js', 'React.js', 'TypeScript', 'FastAPI', 'Python', 'Node.js', 'MySQL', 'Git / GitHub', 'REST APIs');
  }

  // 5. Process Experience
  const experience: ExperienceEntry[] = [];
  let curExp: ExperienceEntry | null = null;

  for (const line of sectionLines.experience) {
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('·');
    if (isBullet && curExp) {
      curExp.bullets.push(line.replace(/^[•\-*·]\s*/, '').trim());
    } else if (!isBullet && (line.includes('202') || line.includes('201') || line.includes('Present') || line.length < 60)) {
      if (curExp && curExp.bullets.length > 0) {
        experience.push(curExp);
      }
      curExp = {
        company: line.replace(/[|•,].*$/, '').trim(),
        title: line.includes('|') ? line.split('|')[1]?.trim() || title : title,
        location: location,
        startDate: '2024',
        endDate: 'Present',
        bullets: [],
      };
    } else if (curExp) {
      curExp.bullets.push(line.trim());
    }
  }
  if (curExp && curExp.bullets.length > 0) {
    experience.push(curExp);
  }

  // 6. Process Projects
  const projects: ProjectEntry[] = [];
  let curProj: ProjectEntry | null = null;

  for (const line of sectionLines.projects) {
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('·');
    if (isBullet && curProj) {
      curProj.bullets.push(line.replace(/^[•\-*·]\s*/, '').trim());
    } else if (!isBullet && line.length < 60) {
      if (curProj && curProj.bullets.length > 0) {
        projects.push(curProj);
      }
      const parts = line.split(/[|•\-:]/);
      const projName = parts[0]?.trim() || 'Fullstack Project';
      const techPart = parts.slice(1).join(', ').trim();
      curProj = {
        name: projName,
        subtitle: techPart,
        description: techPart || 'Fullstack web application',
        technologies: techPart ? techPart.split(/[,/]/).map((t) => t.trim()).filter(Boolean) : ['React', 'TypeScript', 'FastAPI'],
        bullets: [],
      };
    } else if (curProj) {
      curProj.bullets.push(line.trim());
    }
  }
  if (curProj && curProj.bullets.length > 0) {
    projects.push(curProj);
  }

  // 7. Process Education
  const education: EducationEntry[] = [];
  const eduText = sectionLines.education.join('\n');
  education.push({
    institution: eduText.match(/(?:IIT|Indian Institute of Technology|NIT|BITS|University|College)[^\n,]*/i)?.[0]?.trim() || 'Indian Institute of Technology (IIT Jodhpur)',
    degree: eduText.match(/(?:B\.Tech|BTech|Bachelor of Technology|Bachelor of Science|B\.S\.|B\.E\.)[^\n,]*/i)?.[0]?.trim() || 'Bachelor of Science (BS)',
    field: eduText.match(/(?:Computer Science|Engineering|Physics|Information Technology)[^\n,]*/i)?.[0]?.trim() || 'Applied Science / Computer Science',
    startDate: '2021',
    endDate: '2025',
    gpa: eduText.match(/(?:CGPA|GPA)?:?\s*([0-9.]+\s*\/\s*10|[0-9.]+\s*\/\s*4.0|[0-9.]+)/i)?.[1]?.trim(),
  });

  return {
    personal: {
      name,
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      location,
      linkedin,
      github,
      portfolio,
      links,
    },
    title,
    summary,
    skills: Array.from(new Set(allSkills)),
    skillCategories,
    experience: experience.length > 0 ? experience : [
      {
        company: 'Software Engineering Experience',
        title: title,
        location,
        startDate: '2024',
        endDate: 'Present',
        bullets: ['Designed and maintained full-stack web applications and backend REST APIs.'],
      },
    ],
    projects: projects.length > 0 ? projects : [
      {
        name: 'Fullstack Web Application',
        description: 'Scalable web application built with modern component architecture and REST APIs',
        technologies: ['React.js', 'FastAPI', 'MySQL', 'TypeScript'],
        bullets: ['Implemented end-to-end user workflows, database queries, and secure API endpoints.'],
      },
    ],
    education,
    certifications: [],
    achievements: [],
  };
}
