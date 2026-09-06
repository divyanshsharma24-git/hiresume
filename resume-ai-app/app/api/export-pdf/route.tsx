import { NextRequest, NextResponse } from 'next/server';
import { Document, Page, Text, View, StyleSheet, Link, renderToBuffer } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';
import React from 'react';

export const runtime = 'nodejs';

// Classic Ivy League / Harvard / Tech ATS Template using built-in serif font (Times-Roman)
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 9.0,
    color: '#0f172a',
    paddingTop: 22,
    paddingBottom: 20,
    paddingHorizontal: 32,
    lineHeight: 1.22,
  },
  // Running header for Page 2
  runningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 0.6,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 3,
    marginBottom: 8,
  },
  runningHeaderText: {
    fontSize: 8.5,
    fontFamily: 'Times-Bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  runningPageNum: {
    fontSize: 8,
    color: '#64748b',
  },
  header: {
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 17,
    fontFamily: 'Times-Bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
    textAlign: 'center',
  },
  title: {
    fontSize: 9.5,
    fontFamily: 'Times-Bold',
    color: '#1e293b',
    marginBottom: 2.5,
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    fontSize: 8.2,
    color: '#334155',
  },
  contactItem: {
    fontSize: 8.2,
    color: '#334155',
  },
  contactSeparator: {
    fontSize: 8.2,
    color: '#64748b',
    marginHorizontal: 2,
  },
  hyperlink: {
    fontSize: 8.2,
    color: '#1d4ed8',
    textDecoration: 'underline',
  },
  // Sections
  section: {
    marginBottom: 5.5,
  },
  sectionTitle: {
    fontSize: 9.2,
    fontFamily: 'Times-Bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  sectionDivider: {
    borderBottomWidth: 0.7,
    borderBottomColor: '#0f172a',
    marginBottom: 3,
  },
  // Paragraph
  bodyText: {
    fontSize: 8.7,
    color: '#1e293b',
    textAlign: 'justify',
    lineHeight: 1.22,
  },
  // Experience & Projects Entries
  entry: {
    marginBottom: 3.5,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 0.5,
  },
  entryTitleLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  entryTitle: {
    fontSize: 8.9,
    fontFamily: 'Times-Bold',
    color: '#0f172a',
  },
  entryCompany: {
    fontSize: 8.9,
    color: '#1e293b',
  },
  entryDate: {
    fontSize: 8.2,
    color: '#334155',
    textAlign: 'right',
    marginLeft: 6,
  },
  entrySubline: {
    fontSize: 8.2,
    fontFamily: 'Times-Italic',
    color: '#475569',
    marginBottom: 1,
  },
  // Bullets
  bullet: {
    flexDirection: 'row',
    marginBottom: 0.8,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 8,
    fontSize: 8.5,
    color: '#1e293b',
  },
  bulletText: {
    flex: 1,
    fontSize: 8.7,
    color: '#1e293b',
    lineHeight: 1.22,
  },
  // Technical Skills (Categorized, not pill badges!)
  skillCategoryRow: {
    flexDirection: 'row',
    marginBottom: 1.2,
  },
  skillCategoryLabel: {
    fontFamily: 'Times-Bold',
    fontSize: 8.7,
    color: '#0f172a',
    marginRight: 3,
  },
  skillCategoryItems: {
    flex: 1,
    fontSize: 8.7,
    color: '#1e293b',
    lineHeight: 1.22,
  },
  footerTag: {
    position: 'absolute',
    bottom: 10,
    right: 32,
    fontSize: 7.5,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});

function ResumeDocument({ data }: { data: ResumeData }) {
  const p = data.personal;

  // Build contact line elements with hyperlinks
  const contactLinks: { label: string; url?: string }[] = [];
  if (p.location) contactLinks.push({ label: p.location });
  if (p.phone) contactLinks.push({ label: p.phone, url: `tel:${p.phone}` });
  if (p.email) contactLinks.push({ label: p.email, url: `mailto:${p.email}` });

  // Custom links or standard social links
  if (p.links && p.links.length > 0) {
    p.links.forEach((l) => contactLinks.push({ label: l.label, url: l.url }));
  } else {
    if (p.linkedin) contactLinks.push({ label: 'LinkedIn', url: p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}` });
    if (p.github) contactLinks.push({ label: 'GitHub', url: p.github.startsWith('http') ? p.github : `https://${p.github}` });
    if (p.portfolio) contactLinks.push({ label: 'Portfolio', url: p.portfolio.startsWith('http') ? p.portfolio : `https://${p.portfolio}` });
    if (p.website) contactLinks.push({ label: 'Website', url: p.website.startsWith('http') ? p.website : `https://${p.website}` });
  }

  // Defensive segregation: Ensure Open-Source & Research entries (like CareerXAI and PyRewind)
  // are ALWAYS presented in the dedicated 'Open-Source Software & Research' section.
  const isResearchOrOs = (pr: { name?: string; subtitle?: string; description?: string }) =>
    /careerxai|pyrewind|symbolic ai|independent research|open-source/i.test(
      `${pr.name || ''} ${pr.subtitle || ''} ${pr.description || ''}`
    );

  const openSourceList = [
    ...(data.openSourceProjects || []),
    ...(data.projects || []).filter(isResearchOrOs),
  ].filter((proj, idx, arr) => arr.findIndex((pr) => pr.name.toLowerCase() === proj.name.toLowerCase()) === idx);

  const standardProjectList = (data.projects || []).filter((proj) => !isResearchOrOs(proj));

  // Determine split for Page 1 and Page 2:
  // Standard projects (up to 5) stay unified on Page 1 to ensure zero mid-section cuts,
  // leaving Page 2 for Education, Technical Skills taxonomy, Certifications, and Achievements.
  const p1Count = standardProjectList.length > 5 ? 5 : standardProjectList.length;
  const p1Projects = standardProjectList.slice(0, p1Count);
  const p2Projects = standardProjectList.slice(p1Count);

  return (
    <Document>
      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── PAGE 1 OF 2 (Standard A4) ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.name}>{p.name}</Text>
          {data.title ? <Text style={styles.title}>{data.title}</Text> : null}
          <View style={styles.contactRow}>
            {contactLinks.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <Text style={styles.contactSeparator}>|</Text>}
                {item.url ? (
                  <Link src={item.url} style={styles.hyperlink}>
                    {item.label}
                  </Link>
                ) : (
                  <Text style={styles.contactItem}>{item.label}</Text>
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Professional Summary ── */}
        {data.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <View style={styles.sectionDivider} />
            <Text style={styles.bodyText}>{data.summary}</Text>
          </View>
        ) : null}

        {/* ── Professional Experience ── */}
        {data.experience?.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            <View style={styles.sectionDivider} />
            {data.experience.map((exp, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryTitleLine}>
                    <Text style={styles.entryTitle}>{exp.title}</Text>
                    {exp.company ? <Text style={styles.entryCompany}> — {exp.company}</Text> : null}
                    {exp.location ? <Text style={styles.entryCompany}>, {exp.location}</Text> : null}
                    {exp.links?.map((l, li) => (
                      <React.Fragment key={li}>
                        <Text style={{ fontSize: 8.2 }}> </Text>
                        <Link src={l.url} style={styles.hyperlink}>{l.label}</Link>
                      </React.Fragment>
                    ))}
                  </View>
                  <Text style={styles.entryDate}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                {exp.subtitle ? <Text style={styles.entrySubline}>{exp.subtitle}</Text> : null}
                {exp.bullets?.map((b, j) => (
                  <View key={j} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Open-Source Software & Research ── */}
        {openSourceList.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Open-Source Software & Research</Text>
            <View style={styles.sectionDivider} />
            {openSourceList.map((proj, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryTitleLine}>
                    <Text style={styles.entryTitle}>{proj.name}</Text>
                    {proj.description ? <Text style={styles.entryCompany}> — {proj.description}</Text> : null}
                    {proj.links?.map((l, li) => (
                      <React.Fragment key={li}>
                        <Text style={{ fontSize: 8.2, color: '#64748b' }}> | </Text>
                        <Link src={l.url} style={styles.hyperlink}>{l.label}</Link>
                      </React.Fragment>
                    ))}
                  </View>
                  {proj.url && !proj.links?.length ? (
                    <Link src={proj.url} style={styles.hyperlink}>Link</Link>
                  ) : null}
                </View>
                {proj.subtitle ? (
                  <Text style={styles.entrySubline}>{proj.subtitle}</Text>
                ) : proj.technologies?.length > 0 ? (
                  <Text style={styles.entrySubline}>{proj.technologies.join(', ')}</Text>
                ) : null}
                {proj.bullets?.map((b, j) => (
                  <View key={j} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Key Projects (Part 1 - Top Projects) ── */}
        {p1Projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{openSourceList.length ? 'Key Projects' : 'Key Projects & Research'}</Text>
            <View style={styles.sectionDivider} />
            {p1Projects.map((proj, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryTitleLine}>
                    <Text style={styles.entryTitle}>{proj.name}</Text>
                    {proj.description ? <Text style={styles.entryCompany}> — {proj.description}</Text> : null}
                    {proj.links?.map((l, li) => (
                      <React.Fragment key={li}>
                        <Text style={{ fontSize: 8.2, color: '#64748b' }}> | </Text>
                        <Link src={l.url} style={styles.hyperlink}>{l.label}</Link>
                      </React.Fragment>
                    ))}
                  </View>
                  {proj.url && !proj.links?.length ? (
                    <Link src={proj.url} style={styles.hyperlink}>Link</Link>
                  ) : null}
                </View>
                {proj.subtitle ? (
                  <Text style={styles.entrySubline}>{proj.subtitle}</Text>
                ) : proj.technologies?.length > 0 ? (
                  <Text style={styles.entrySubline}>{proj.technologies.join(', ')}</Text>
                ) : null}
                {proj.bullets?.map((b, j) => (
                  <View key={j} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Bottom Page 1 Indicator */}
        <Text style={styles.footerTag}>Page 1 of 2</Text>
      </Page>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── PAGE 2 OF 2 (Standard A4) ── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        {/* Page 2 Running Header */}
        <View style={styles.runningHeader}>
          <Text style={styles.runningHeaderText}>
            {p.name} — {data.title ? data.title.split('|')[0].trim() : 'Resume'}
          </Text>
          <Text style={styles.runningPageNum}>Page 2 of 2</Text>
        </View>

        {/* ── Key Projects (Part 2 - Continued) ── */}
        {p2Projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects (Continued)</Text>
            <View style={styles.sectionDivider} />
            {p2Projects.map((proj, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryTitleLine}>
                    <Text style={styles.entryTitle}>{proj.name}</Text>
                    {proj.description ? <Text style={styles.entryCompany}> — {proj.description}</Text> : null}
                    {proj.links?.map((l, li) => (
                      <React.Fragment key={li}>
                        <Text style={{ fontSize: 8.2, color: '#64748b' }}> | </Text>
                        <Link src={l.url} style={styles.hyperlink}>{l.label}</Link>
                      </React.Fragment>
                    ))}
                  </View>
                  {proj.url && !proj.links?.length ? (
                    <Link src={proj.url} style={styles.hyperlink}>Link</Link>
                  ) : null}
                </View>
                {proj.subtitle ? (
                  <Text style={styles.entrySubline}>{proj.subtitle}</Text>
                ) : proj.technologies?.length > 0 ? (
                  <Text style={styles.entrySubline}>{proj.technologies.join(', ')}</Text>
                ) : null}
                {proj.bullets?.map((b, j) => (
                  <View key={j} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Education ── */}
        {data.education?.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.sectionDivider} />
            {data.education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 3 }} wrap={false}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryTitleLine}>
                    <Text style={styles.entryTitle}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </Text>
                    {edu.institution ? <Text style={styles.entryCompany}> — {edu.institution}</Text> : null}
                  </View>
                  <Text style={styles.entryDate}>{edu.startDate} – {edu.endDate}</Text>
                </View>
                {edu.subtitle ? (
                  <Text style={styles.entrySubline}>{edu.subtitle}</Text>
                ) : (edu.gpa || edu.honors) ? (
                  <Text style={styles.entrySubline}>
                    {[edu.gpa ? `CGPA/GPA: ${edu.gpa}` : '', edu.honors].filter(Boolean).join(' | ')}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Technical Skills (Categorized) ── */}
        {(data.skillCategories?.length || data.skills?.length) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.sectionDivider} />
            {data.skillCategories && data.skillCategories.length > 0 ? (
              data.skillCategories.map((cat, i) => (
                <View key={i} style={styles.skillCategoryRow} wrap={false}>
                  <Text style={styles.skillCategoryLabel}>{cat.category}:</Text>
                  <Text style={styles.skillCategoryItems}>{cat.skills.join(', ')}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.bodyText}>{data.skills.join(', ')}</Text>
            )}
          </View>
        ) : null}

        {/* ── Certifications & Professional Training ── */}
        {data.certifications?.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications & Professional Training</Text>
            <View style={styles.sectionDivider} />
            {data.certifications.map((cert, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 1.8 }} wrap={false}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
                  <Text style={styles.entryTitle}>{cert.name}</Text>
                  {cert.issuer ? <Text style={styles.entryCompany}> — {cert.issuer}</Text> : null}
                  {cert.url ? (
                    <React.Fragment>
                      <Text style={{ fontSize: 8.2 }}> </Text>
                      <Link src={cert.url} style={styles.hyperlink}>(view)</Link>
                    </React.Fragment>
                  ) : null}
                </View>
                {cert.date ? <Text style={styles.entryDate}>{cert.date}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Scholastic Achievements ── */}
        {data.achievements?.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scholastic Achievements</Text>
            <View style={styles.sectionDivider} />
            {data.achievements.map((a, i) => (
              <View key={i} style={styles.bullet} wrap={false}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{a}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Bottom Page 2 Indicator */}
        <Text style={styles.footerTag}>Page 2 of 2</Text>
      </Page>
    </Document>
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeData } = body as { resumeData: ResumeData };

    if (!resumeData) {
      return NextResponse.json({ error: 'resumeData is required' }, { status: 400 });
    }

    const pdfBuffer = await renderToBuffer(<ResumeDocument data={resumeData} />);

    const candidateName = resumeData.personal?.name?.replace(/\s+/g, '_') || 'resume';
    const filename = `${candidateName}_tailored.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (err: unknown) {
    console.error('[export-pdf] Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
