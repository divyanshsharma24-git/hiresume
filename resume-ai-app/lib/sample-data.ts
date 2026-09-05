import type { TailoringResult } from '@/types/analysis';
import type { ResumeData } from '@/types/resume';

export const sampleOriginalResume: ResumeData = {
  personal: {
    name: 'DIVYANSH SHARMA',
    email: 'b25bs1093@iitj.ac.in',
    phone: '+91-8077073548',
    location: 'Sambhal, Uttar Pradesh, India (Open to Noida / Delhi NCR)',
    linkedin: 'https://www.linkedin.com/in/divyansh-sharma-a92889340/',
    github: 'https://github.com/divyanshsharma24-git',
    portfolio: 'https://divyansh-portfolio-portfolio.vercel.app/',
    website: 'https://www.divhanyamodulers.tech/',
    links: [
      { label: 'tel', url: 'tel:+918077073548' },
      { label: 'mailto', url: 'mailto:b25bs1093@iitj.ac.in' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/divyansh-sharma-a92889340/' },
      { label: 'GitHub', url: 'https://github.com/divyanshsharma24-git' },
      { label: 'Portfolio', url: 'https://divyansh-portfolio-portfolio.vercel.app/' },
      { label: 'Website', url: 'https://www.divhanyamodulers.tech/' },
    ],
  },
  title: 'Fullstack Developer Intern | React.js • Python • Node.js • MySQL • REST APIs',
  summary:
    'Full Stack Developer and AI & Data Science student at IIT Jodhpur with strong hands-on experience developing responsive web applications, backend services, and relational databases. Proven track record in building and deploying production-grade platforms with React.js, TypeScript, Node.js, Python, and MySQL/PostgreSQL—supporting 1,000+ users. Skilled in REST API integration, CRUD operations, debugging, authentication flows, and clean code architecture.',
  skills: [
    'React.js', 'Next.js', 'FastAPI', 'JavaScript (ES6+)', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS',
    'Node.js', 'Express.js', 'RESTful APIs', 'API Integration',
    'Python', 'SQL', 'Data Structures & Algorithms', 'Object-Oriented Programming', 'Problem-solving', 'Debugging',
    'MySQL', 'PostgreSQL', 'Database Operations (CRUD)', 'Supabase', 'MongoDB', 'Firebase', 'SQL & NoSQL',
    'Git', 'GitHub', 'Docker', 'CI/CD', 'GitHub Actions', 'Vercel',
    'PyTorch', 'TensorFlow', 'LangChain', 'LangGraph', 'Natural Language Processing (NLP)', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'LLM Integration'
  ],
  skillCategories: [
    {
      category: 'Languages',
      skills: ['Python', 'JavaScript (ES6+)', 'TypeScript', 'SQL', 'HTML', 'CSS'],
    },
    {
      category: 'Programming & CS',
      skills: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'RESTful APIs', 'API Integration', 'Problem-solving', 'Debugging'],
    },
    {
      category: 'Frontend / Backend',
      skills: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS'],
    },
    {
      category: 'Databases',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'Firebase', 'SQL & NoSQL'],
    },
    {
      category: 'AI / ML',
      skills: ['Machine Learning', 'Deep Learning', 'Natural Language Processing (NLP)', 'Predictive Modeling', 'Feature Engineering', 'Scikit-learn', 'Computer Vision', 'Symbolic AI', 'Explainable AI'],
    },
    {
      category: 'Generative AI',
      skills: ['LLM Integration', 'Generative AI', 'Retrieval-Augmented Generation (RAG)', 'Prompt Engineering', 'LangChain', 'LangGraph', 'Vector Databases', 'Embeddings', 'OpenAI API', 'Gemini API', 'Llama Models', 'Hugging Face', 'AI Agent Workflows'],
    },
    {
      category: 'MLOps / DevOps',
      skills: ['Docker', 'CI/CD', 'GitHub Actions', 'Model Deployment', 'MLOps', 'LLMOps', 'AWS', 'Vercel'],
    },
    {
      category: 'Tools',
      skills: ['Pandas', 'NumPy', 'Matplotlib', 'Jupyter Notebook', 'Power BI', 'Git', 'GitHub'],
    },
  ],
  experience: [
    {
      company: 'Shri Ram International School (CBSE), Sambhal, UP',
      title: 'Database Management Engineer & Python Developer',
      location: 'Sambhal, UP',
      startDate: 'Mar 2026',
      endDate: 'Present',
      bullets: [
        'Developed Python-based automation and data-processing workflows for institutional operations, while maintaining databases supporting 1,000+ students.',
      ],
    },
    {
      company: 'Wire Fusion Metrics Ltd., Bangalore (Remote)',
      title: 'Junior Data Analyst & Web Development Intern',
      location: 'Bangalore (Remote)',
      startDate: 'Jul 2025',
      endDate: 'Jan 2026',
      links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com' }],
      bullets: [
        'Cleaned, analyzed, and transformed datasets using Python, Pandas, and SQL; built Power BI dashboards that streamlined recurring reporting for the team.',
        'Improved web application UI/UX and delivered feature integrations, contributing to ongoing site maintenance and reliability.',
      ],
    },
    {
      company: 'Bal Vidya Mandir Sr. Sec. School (CBSE)',
      title: 'Computer Science & AI Teacher',
      location: 'Sambhal, UP',
      startDate: 'Jun 2024',
      endDate: 'Mar 2025',
      subtitle: 'Additional Experience — Computer Science & AI Teacher, Bal Vidya Mandir Sr. Sec. School (CBSE), Taught Python, SQL, Informatics Practices, and Artificial Intelligence to Classes IX–XII',
      bullets: [
        'Instructed 100+ students in Python programming, SQL queries, relational database fundamentals, and Object-Oriented software concepts.',
      ],
    },
  ],
  openSourceProjects: [
    {
      name: 'PyRewind',
      subtitle: 'Creator & Maintainer | Published on PyPI',
      description: 'Python Execution Tracing & Debugging Library',
      technologies: ['Python', 'PyPI', 'CLI', 'JSON'],
      links: [
        { label: 'PyPI', url: 'https://pypi.org/project/pyrewind/' },
        { label: 'GitHub', url: 'https://github.com/divyanshsharma24-git/pyrewind' },
        { label: 'Documentation', url: 'https://github.com/divyanshsharma24-git/pyrewind#readme' },
      ],
      bullets: [
        'Developed a Python tracing library that records line-level execution state, local variables, timing, trace analysis, filtering, tagging, JSON serialization, and assisted replay, with CLI and plugin architecture.',
      ],
    },
    {
      name: 'CareerXAI (Independent Research)',
      subtitle: 'Independent Academic Research — IIT Jodhpur | May 2026 – Present',
      description: 'Career Recommendation using Symbolic AI',
      technologies: ['Symbolic AI', 'Rule-based Inference', 'APIs'],
      links: [
        { label: 'State-of-the-Art Seminar', url: 'https://careerxai.vercel.app/seminar' },
        { label: 'Prototype', url: 'https://careerxai.vercel.app' },
        { label: 'Doc1', url: 'https://careerxai.vercel.app/doc1' },
        { label: 'Doc2', url: 'https://careerxai.vercel.app/doc2' },
      ],
      bullets: [
        'Developing CareerXAI, a full-stack research prototype using symbolic knowledge representation, rule-based inference, and Explainable AI for career recommendation',
        'Research explores rule-based expert systems, knowledge bases, IF–THEN production rules, and forward-chaining inference for transparent career recommendations.',
      ],
    },
  ],
  projects: [
    {
      name: 'SRI ERP & SRI Accounts',
      subtitle: 'React, TypeScript, Supabase, Tailwind CSS',
      description: 'Full-Stack School Management Platforms',
      technologies: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
      links: [
        { label: 'ERP Link', url: 'https://sri-erp.vercel.app' },
        { label: 'Accounts Link', url: 'https://sri-accounts.vercel.app' },
        { label: 'GitHub', url: 'https://github.com/divyanshsharma24-git' },
      ],
      bullets: [
        'Architected and launched role-based school ERP and financial-management platforms serving 1,000+ students and 60+ staff, covering attendance, academic records, report cards, and transaction tracking with monthly financial flows of approximately ₹4.5 lakh, using React, TypeScript, Supabase, and Tailwind CSS.',
      ],
    },
    {
      name: 'Pyton3D Engine',
      subtitle: 'Creator & Maintainer | Published on PyPI',
      description: '6-DOF Rigid-Body Physics Engine & Simulation Library',
      technologies: ['Python', 'Physics Engine', 'SAT'],
      links: [
        { label: 'PyPI', url: 'https://pypi.org/project/python3d-engine/' },
        { label: 'GitHub', url: 'https://github.com/divyanshsharma24-git/python3d' },
        { label: 'Documentation', url: 'https://github.com/divyanshsharma24-git/python3d#readme' },
        { label: 'Demo', url: 'https://python3d-demo.vercel.app' },
      ],
      bullets: [
        'Built and published a pure-Python 6-DOF rigid-body physics engine from first principles, implementing AABB broad-phase, 3D SAT collision detection, contact manifolds, sequential impulse solving, Coulomb friction, springs/joints, buoyancy, and multiple numerical integrators.',
      ],
    },
    {
      name: 'J.A.R.V.I.S. (Flagship)',
      subtitle: 'Research AI Assistant | Python, LangChain, LangGraph, Ollama',
      description: 'Multimodal AI Assistant',
      technologies: ['Python', 'LangChain', 'LangGraph', 'Ollama'],
      links: [
        { label: 'GitHub', url: 'https://github.com/divyanshsharma24-git/jarvis' },
      ],
      bullets: [
        'Architected a dual-LLM system — GPT-5.5 (API) for complex planning and a locally-hosted Qwen2.5-14B (via Ollama) for fast, low-cost autonomous execution — orchestrated with LangChain and LangGraph, routing select reasoning tasks to Gemini Pro.',
        'Built an RF-based wall-sensing module: signal capture on an ESP32-S3 DevKitC-1 feeding a custom deep learning model (trained on an RTX 3090) for spatial imaging; working prototype published on GitHub.',
        'Optimized the voice-command pipeline (speech-to-text → parsed execution) down to ~3s response latency while reducing memory usage.',
      ],
    },
    {
      name: 'FleetOS',
      subtitle: 'Smart India Hackathon Submission | React, TypeScript, Node.js, Express, Socket.IO',
      description: 'Smart Fleet Coordination Platform (Smart India Hackathon submission)',
      technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'Socket.IO'],
      links: [
        { label: 'Link', url: 'https://fleetos-live.vercel.app' },
        { label: 'GitHub', url: 'https://github.com/divyanshsharma24-git/fleetos' },
        { label: 'Report', url: 'https://github.com/divyanshsharma24-git/fleetos#report' },
        { label: 'PPT', url: 'https://github.com/divyanshsharma24-git/fleetos#presentation' },
      ],
      bullets: [
        'Built a full-stack fleet-management platform featuring real-time vehicle tracking, automated driver-vehicle allocation, interactive maps, and event-driven communication using React, TypeScript, Node.js, Express, Socket.IO, and Leaflet.',
      ],
    },
    {
      name: 'Resume Analyzer AI',
      subtitle: 'Node.js, React | ATS Score, Keywords, Suggestions.',
      description: 'NLP Web Application',
      technologies: ['Node.js', 'React', 'NLP'],
      links: [
        { label: 'Link', url: 'https://resume-ai-analyzer.vercel.app' },
        { label: 'GitHub', url: 'https://github.com/divyanshsharma24-git' },
      ],
      bullets: [
        'Launched a Node.js NLP application that parses PDF resumes, performs ATS-style keyword analysis, and generates automated feedback reports, supporting 75+ applicants.',
      ],
    },
  ],
  education: [
    {
      institution: 'Indian Institute of Technology, Jodhpur',
      degree: 'BS in Artificial Intelligence & Data Science',
      field: '',
      startDate: '2025',
      endDate: 'Present',
      subtitle: 'Executive Program | 2025 – Present | CGPA: 7.5',
      gpa: '7.5',
    },
    {
      institution: 'Harvard Extension School, USA',
      degree: 'Diploma in Computer Algorithms & Architecture',
      field: '',
      startDate: '2026',
      endDate: 'Present',
      subtitle: 'Harvard Division of Continuing Education | Executive Program | 2026 – Present',
    },
    {
      institution: 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly',
      degree: 'M.Sc. in Chemistry & Quantum Mechanics',
      field: '',
      startDate: '2023',
      endDate: '2025',
      subtitle: '2023 – 2025 | CGPA: 6.8',
      gpa: '6.8',
    },
    {
      institution: 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly',
      degree: 'B.Sc. (Hons.) in Physics',
      field: '',
      startDate: '2020',
      endDate: '2023',
      subtitle: '2020 – 2023 | CGPA: 7.5',
      gpa: '7.5',
    },
  ],
  certifications: [
    { name: 'AWS Knowledge: Cloud Essentials — Training Badge', issuer: 'Amazon Web Services', date: 'July 2026', url: 'https://aws.amazon.com' },
    { name: 'Cybersecurity Essentials', issuer: 'Cisco Networking Academy', date: 'Feb 2026', url: 'https://netacad.com' },
    { name: 'AWS Cloud Practitioner Essentials', issuer: 'Amazon Web Services', date: 'Nov 2025', url: 'https://aws.amazon.com' },
    { name: 'Web Development Fundamentals', issuer: 'IBM SkillsBuild', date: 'Sep 2025', url: 'https://skillsbuild.org' },
    { name: 'Artificial Intelligence Fundamentals', issuer: 'IBM SkillsBuild', date: 'Mar 2025', url: 'https://skillsbuild.org' },
  ],
  achievements: [
    'Secured Rank 1020 in IITJ-SAT among 1.2 lakh applicants.',
    'Completed Master\'s in Advanced Chemistry & Quantum Mechanics with First-Class grade.',
    'Rank 1, Gold Medal — B.Sc. (Hons.), 3rd year, Govt. Dist. PG College.',
    'Rank 2, Silver Medal — B.Sc. (Hons.), 2nd year, Govt. Dist. PG College.',
    'Astrophysics Certificate, ISRO Space Awareness Program.',
  ],
};

export const sampleTailoredResult: TailoringResult = {
  tailoredResume: {
    ...sampleOriginalResume,
    title: 'Fullstack Developer Intern | React.js • Python • Node.js • MySQL • REST APIs',
    summary:
      'Full Stack Developer and AI & Data Science student at IIT Jodhpur with strong hands-on experience developing responsive web applications, backend services, and relational databases. Proven track record in building and deploying production-grade platforms with React.js, TypeScript, Next.js, Node.js, Python, FastAPI, and MySQL/PostgreSQL—supporting 1,000+ users. Skilled in REST API integration, CRUD operations, debugging, authentication flows, and clean code architecture. Available for on-site role in Noida.',
    skillCategories: [
      {
        category: 'Languages',
        skills: ['Python', 'JavaScript (ES6+)', 'TypeScript', 'SQL', 'HTML', 'CSS'],
      },
      {
        category: 'Programming & CS',
        skills: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'RESTful APIs', 'API Integration', 'Problem-solving', 'Debugging'],
      },
      {
        category: 'Frontend / Backend',
        skills: ['React.js', 'Next.js', 'FastAPI', 'Node.js', 'Express.js', 'Tailwind CSS'],
      },
      {
        category: 'Databases',
        skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'Firebase', 'SQL & NoSQL'],
      },
      {
        category: 'AI / ML',
        skills: ['Machine Learning', 'Deep Learning', 'Natural Language Processing (NLP)', 'Predictive Modeling', 'Feature Engineering', 'Scikit-learn', 'Computer Vision', 'Symbolic AI', 'Explainable AI'],
      },
      {
        category: 'Generative AI',
        skills: ['LLM Integration', 'Generative AI', 'Retrieval-Augmented Generation (RAG)', 'Prompt Engineering', 'LangChain', 'LangGraph', 'Vector Databases', 'Embeddings', 'OpenAI API', 'Gemini API', 'Llama Models', 'Hugging Face', 'AI Agent Workflows'],
      },
      {
        category: 'MLOps / DevOps',
        skills: ['Docker', 'CI/CD', 'GitHub Actions', 'Model Deployment', 'MLOps', 'LLMOps', 'AWS', 'Vercel'],
      },
      {
        category: 'Tools',
        skills: ['Pandas', 'NumPy', 'Matplotlib', 'Jupyter Notebook', 'Power BI', 'Git', 'GitHub'],
      },
    ],
  },
  originalScore: {
    overall: 78,
    skills: 75,
    keywords: 72,
    experience: 80,
    responsibilities: 80,
    qualifications: 82,
  },
  tailoredScore: {
    overall: 95,
    skills: 98,
    keywords: 96,
    experience: 92,
    responsibilities: 94,
    qualifications: 95,
  },
  changes: [
    {
      section: 'Professional Summary',
      field: 'summary',
      before:
        'Full Stack Developer and AI & Data Science student at IIT Jodhpur with strong hands-on experience developing responsive web applications, backend services, and relational databases. Proven track record in building and deploying production-grade platforms with React.js, TypeScript, Node.js, Python, and MySQL/PostgreSQL—supporting 1,000+ users.',
      after:
        'Full Stack Developer and AI & Data Science student at IIT Jodhpur with strong hands-on experience developing responsive web applications, backend services, and relational databases. Proven track record in building and deploying production-grade platforms with React.js, TypeScript, Next.js, Node.js, Python, FastAPI, and MySQL/PostgreSQL—supporting 1,000+ users. Skilled in REST API integration, CRUD operations, debugging, authentication flows, and clean code architecture. Available for on-site role in Noida.',
      reason:
        'Injected target JD keywords (Next.js, FastAPI, Noida availability) to elevate ATS match score while preserving candidate authentic background.',
      keywordsAdded: ['Next.js', 'FastAPI', 'Noida on-site'],
    },
    {
      section: 'Technical Skills',
      field: 'skillCategories',
      index: 0,
      before: 'Frontend & Backend: React.js, JavaScript (ES6+), TypeScript, HTML, CSS, Tailwind CSS, Node.js, Express.js, RESTful APIs, API Integration',
      after: 'Frontend & Backend: React.js, Next.js, FastAPI, JavaScript (ES6+), TypeScript, HTML, CSS, Tailwind CSS, Node.js, Express.js, RESTful APIs, API Integration',
      reason: 'Surfaced Next.js and FastAPI directly in primary technical category to trigger critical keyword parser filters.',
      keywordsAdded: ['Next.js', 'FastAPI'],
    },
    {
      section: 'Technical Skills',
      field: 'skillCategories',
      index: 4,
      before: 'AI / ML & Analytics: Natural Language Processing (NLP), Machine Learning, Pandas, NumPy, Scikit-learn, LLM Integration',
      after: 'AI / ML & Analytics: PyTorch, TensorFlow, LangChain, LangGraph, Natural Language Processing (NLP), Machine Learning, Pandas, NumPy, Scikit-learn, LLM Integration',
      reason: 'Added candidate-authorized PyTorch, TensorFlow, LangChain, and LangGraph into AI / ML & Analytics category.',
      keywordsAdded: ['PyTorch', 'TensorFlow', 'LangChain', 'LangGraph'],
    },
  ],
  keywordsAdded: [
    { keyword: 'Next.js', source: 'Component architecture in React.js and modern web apps', reason: 'Primary JD ATS hard requirement #1' },
    { keyword: 'FastAPI', source: 'Python backend services, REST APIs, and automation routines', reason: 'Primary JD ATS hard requirement #2' },
    { keyword: 'MySQL / SQL Joins', source: 'Relational database schema management at Shri Ram School & SRI ERP', reason: 'Primary JD database requirement #3' },
    { keyword: 'REST APIs & CRUD', source: 'Frontend-backend data integration across FleetOS & Resume Analyzer', reason: 'Core JD responsibility' },
    { keyword: 'PyTorch / TensorFlow', source: 'AI & Data Science coursework at IIT Jodhpur and NLP models', reason: 'Advanced AI/ML candidate authorization' },
    { keyword: 'LangChain & LangGraph', source: 'Agentic multi-LLM orchestration in J.A.R.V.I.S. flagship project', reason: 'Modern LLM agent stack' },
  ],
  changeSummary: {
    keywordsAligned: 14,
    bulletsOptimized: 8,
    summaryRewritten: true,
    skillsReordered: true,
    titleOptimized: true,
    projectsPrioritized: 4,
  },
};
