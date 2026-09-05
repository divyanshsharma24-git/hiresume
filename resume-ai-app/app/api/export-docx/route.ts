import { NextRequest, NextResponse } from 'next/server';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
  AlignmentType,
  BorderStyle,
} from 'docx';
import type { ResumeData } from '@/types/resume';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeData } = body as { resumeData: ResumeData };

    if (!resumeData) {
      return NextResponse.json({ error: 'resumeData is required' }, { status: 400 });
    }

    const p = resumeData.personal;
    const children: Paragraph[] = [];

    // Helper for section headings with solid bottom border
    const createSectionHeading = (title: string) => {
      return new Paragraph({
        spacing: { before: 180, after: 80 },
        border: {
          bottom: {
            color: '1E293B',
            space: 2,
            style: BorderStyle.SINGLE,
            size: 8,
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 20, // 10pt
            font: 'Times New Roman',
            color: '0F172A',
          }),
        ],
      });
    };

    // 1. Name
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 40 },
        children: [
          new TextRun({
            text: p.name.toUpperCase(),
            bold: true,
            size: 36, // 18pt
            font: 'Times New Roman',
            color: '0F172A',
          }),
        ],
      })
    );

    // 2. Title / Headline
    if (resumeData.title) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 60 },
          children: [
            new TextRun({
              text: resumeData.title,
              bold: true,
              size: 21, // 10.5pt
              font: 'Times New Roman',
              color: '1E293B',
            }),
          ],
        })
      );
    }

    // 3. Contact Line with Hyperlinks
    const contactRuns: (TextRun | ExternalHyperlink)[] = [];
    const contactItems: { label: string; url?: string }[] = [];

    if (p.location) contactItems.push({ label: p.location });
    if (p.phone) contactItems.push({ label: p.phone, url: `tel:${p.phone}` });
    if (p.email) contactItems.push({ label: p.email, url: `mailto:${p.email}` });

    if (p.links && p.links.length > 0) {
      p.links.forEach((l) => contactItems.push({ label: l.label, url: l.url }));
    } else {
      if (p.linkedin) contactItems.push({ label: 'LinkedIn', url: p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}` });
      if (p.github) contactItems.push({ label: 'GitHub', url: p.github.startsWith('http') ? p.github : `https://${p.github}` });
      if (p.portfolio) contactItems.push({ label: 'Portfolio', url: p.portfolio.startsWith('http') ? p.portfolio : `https://${p.portfolio}` });
      if (p.website) contactItems.push({ label: 'Website', url: p.website.startsWith('http') ? p.website : `https://${p.website}` });
    }

    contactItems.forEach((item, idx) => {
      if (idx > 0) {
        contactRuns.push(
          new TextRun({
            text: ' | ',
            size: 18,
            font: 'Times New Roman',
            color: '64748B',
          })
        );
      }
      if (item.url) {
        contactRuns.push(
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: item.label,
                size: 18,
                font: 'Times New Roman',
                color: '1D4ED8',
                underline: {},
              }),
            ],
            link: item.url,
          })
        );
      } else {
        contactRuns.push(
          new TextRun({
            text: item.label,
            size: 18,
            font: 'Times New Roman',
            color: '334155',
          })
        );
      }
    });

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 140 },
        children: contactRuns,
      })
    );

    // 4. Professional Summary
    if (resumeData.summary) {
      children.push(createSectionHeading('Professional Summary'));
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 100 },
          children: [
            new TextRun({
              text: resumeData.summary,
              size: 19,
              font: 'Times New Roman',
              color: '1E293B',
            }),
          ],
        })
      );
    }

    // 5. Professional Experience
    if (resumeData.experience?.length > 0) {
      children.push(createSectionHeading('Professional Experience'));
      resumeData.experience.forEach((exp) => {
        const headerRuns: (TextRun | ExternalHyperlink)[] = [
          new TextRun({
            text: exp.title,
            bold: true,
            size: 19,
            font: 'Times New Roman',
            color: '0F172A',
          }),
        ];

        if (exp.company) {
          headerRuns.push(
            new TextRun({
              text: ` — ${exp.company}`,
              size: 19,
              font: 'Times New Roman',
              color: '1E293B',
            })
          );
        }

        if (exp.location) {
          headerRuns.push(
            new TextRun({
              text: `, ${exp.location}`,
              size: 19,
              font: 'Times New Roman',
              color: '1E293B',
            })
          );
        }

        if (exp.startDate || exp.endDate) {
          headerRuns.push(
            new TextRun({
              text: ` | ${exp.startDate} – ${exp.endDate}`,
              size: 18,
              font: 'Times New Roman',
              color: '334155',
            })
          );
        }

        if (exp.links?.length) {
          exp.links.forEach((l) => {
            headerRuns.push(
              new TextRun({ text: ' ', size: 18, font: 'Times New Roman' }),
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: l.label,
                    size: 18,
                    font: 'Times New Roman',
                    color: '1D4ED8',
                    underline: {},
                  }),
                ],
                link: l.url,
              })
            );
          });
        }

        children.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: headerRuns,
          })
        );

        if (exp.subtitle) {
          children.push(
            new Paragraph({
              spacing: { before: 0, after: 30 },
              children: [
                new TextRun({
                  text: exp.subtitle,
                  italics: true,
                  size: 18,
                  font: 'Times New Roman',
                  color: '475569',
                }),
              ],
            })
          );
        }

        exp.bullets?.forEach((b) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: b,
                  size: 19,
                  font: 'Times New Roman',
                  color: '1E293B',
                }),
              ],
            })
          );
        });
      });
    }

    // 6. Open-Source Software & Research & Key Projects
    const renderProjectList = (sectionTitle: string, projectList: typeof resumeData.projects) => {
      children.push(createSectionHeading(sectionTitle));
      projectList.forEach((proj) => {
        const projRuns: (TextRun | ExternalHyperlink)[] = [
          new TextRun({
            text: proj.name,
            bold: true,
            size: 19,
            font: 'Times New Roman',
            color: '0F172A',
          }),
        ];

        if (proj.description) {
          projRuns.push(
            new TextRun({
              text: ` — ${proj.description}`,
              size: 19,
              font: 'Times New Roman',
              color: '1E293B',
            })
          );
        }

        if (proj.links?.length) {
          proj.links.forEach((l, idx) => {
            projRuns.push(
              new TextRun({
                text: idx === 0 ? ': ' : ' | ',
                size: 18,
                font: 'Times New Roman',
                color: '64748B',
              }),
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: l.label,
                    size: 18,
                    font: 'Times New Roman',
                    color: '1D4ED8',
                    underline: {},
                  }),
                ],
                link: l.url,
              })
            );
          });
        } else if (proj.url) {
          projRuns.push(
            new TextRun({ text: ' | ', size: 18, font: 'Times New Roman', color: '64748B' }),
            new ExternalHyperlink({
              children: [
                new TextRun({
                  text: 'Link',
                  size: 18,
                  font: 'Times New Roman',
                  color: '1D4ED8',
                  underline: {},
                }),
              ],
              link: proj.url,
            })
          );
        }

        children.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: projRuns,
          })
        );

        if (proj.subtitle) {
          children.push(
            new Paragraph({
              spacing: { before: 0, after: 30 },
              children: [
                new TextRun({
                  text: proj.subtitle,
                  italics: true,
                  size: 18,
                  font: 'Times New Roman',
                  color: '475569',
                }),
              ],
            })
          );
        } else if (proj.technologies?.length > 0) {
          children.push(
            new Paragraph({
              spacing: { before: 0, after: 30 },
              children: [
                new TextRun({
                  text: proj.technologies.join(', '),
                  italics: true,
                  size: 18,
                  font: 'Times New Roman',
                  color: '475569',
                }),
              ],
            })
          );
        }

        proj.bullets?.forEach((b) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: b,
                  size: 19,
                  font: 'Times New Roman',
                  color: '1E293B',
                }),
              ],
            })
          );
        });
      });
    };

    // Defensive segregation: Ensure Open-Source & Research entries (like CareerXAI and PyRewind)
    // are ALWAYS presented in the dedicated 'Open-Source Software & Research' section.
    const isResearchOrOs = (pr: { name?: string; subtitle?: string; description?: string }) =>
      /careerxai|pyrewind|symbolic ai|independent research|open-source/i.test(
        `${pr.name || ''} ${pr.subtitle || ''} ${pr.description || ''}`
      );

    const openSourceList = [
      ...(resumeData.openSourceProjects || []),
      ...(resumeData.projects || []).filter(isResearchOrOs),
    ].filter((proj, idx, arr) => arr.findIndex((p) => p.name.toLowerCase() === proj.name.toLowerCase()) === idx);

    const standardProjectList = (resumeData.projects || []).filter((proj) => !isResearchOrOs(proj));

    if (openSourceList.length > 0) {
      renderProjectList('Open-Source Software & Research', openSourceList);
    }

    if (standardProjectList.length > 0) {
      const projTitle = openSourceList.length ? 'Key Projects' : 'Key Projects & Research';
      renderProjectList(projTitle, standardProjectList);
    }

    // 7. Education
    if (resumeData.education?.length > 0) {
      children.push(createSectionHeading('Education'));
      resumeData.education.forEach((edu) => {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({
                text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`,
                bold: true,
                size: 19,
                font: 'Times New Roman',
                color: '0F172A',
              }),
              new TextRun({
                text: edu.institution ? ` — ${edu.institution}` : '',
                size: 19,
                font: 'Times New Roman',
                color: '1E293B',
              }),
              new TextRun({
                text: (edu.startDate || edu.endDate) ? ` | ${edu.startDate} – ${edu.endDate}` : '',
                size: 18,
                font: 'Times New Roman',
                color: '334155',
              }),
            ],
          })
        );

        if (edu.subtitle) {
          children.push(
            new Paragraph({
              spacing: { before: 0, after: 30 },
              children: [
                new TextRun({
                  text: edu.subtitle,
                  italics: true,
                  size: 18,
                  font: 'Times New Roman',
                  color: '475569',
                }),
              ],
            })
          );
        } else if (edu.gpa || edu.honors) {
          children.push(
            new Paragraph({
              spacing: { before: 0, after: 30 },
              children: [
                new TextRun({
                  text: [edu.gpa ? `CGPA/GPA: ${edu.gpa}` : '', edu.honors].filter(Boolean).join(' | '),
                  italics: true,
                  size: 18,
                  font: 'Times New Roman',
                  color: '475569',
                }),
              ],
            })
          );
        }
      });
    }

    // 8. Technical Skills (Categorized)
    if (resumeData.skillCategories?.length || resumeData.skills?.length) {
      children.push(createSectionHeading('Technical Skills'));
      if (resumeData.skillCategories && resumeData.skillCategories.length > 0) {
        resumeData.skillCategories.forEach((cat) => {
          children.push(
            new Paragraph({
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: `${cat.category}: `,
                  bold: true,
                  size: 19,
                  font: 'Times New Roman',
                  color: '0F172A',
                }),
                new TextRun({
                  text: cat.skills.join(', '),
                  size: 19,
                  font: 'Times New Roman',
                  color: '1E293B',
                }),
              ],
            })
          );
        });
      } else {
        children.push(
          new Paragraph({
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: resumeData.skills.join(', '),
                size: 19,
                font: 'Times New Roman',
                color: '1E293B',
              }),
            ],
          })
        );
      }
    }

    // 9. Certifications & Professional Training
    if (resumeData.certifications?.length > 0) {
      children.push(createSectionHeading('Certifications & Professional Training'));
      resumeData.certifications.forEach((cert) => {
        const certRuns: (TextRun | ExternalHyperlink)[] = [
          new TextRun({
            text: cert.name,
            bold: true,
            size: 19,
            font: 'Times New Roman',
            color: '0F172A',
          }),
        ];

        if (cert.issuer) {
          certRuns.push(
            new TextRun({
              text: ` — ${cert.issuer}`,
              size: 19,
              font: 'Times New Roman',
              color: '1E293B',
            })
          );
        }

        if (cert.date) {
          certRuns.push(
            new TextRun({
              text: ` | ${cert.date}`,
              size: 18,
              font: 'Times New Roman',
              color: '334155',
            })
          );
        }

        if (cert.url) {
          certRuns.push(
            new TextRun({ text: ' ', size: 18, font: 'Times New Roman' }),
            new ExternalHyperlink({
              children: [
                new TextRun({
                  text: '(view)',
                  size: 18,
                  font: 'Times New Roman',
                  color: '1D4ED8',
                  underline: {},
                }),
              ],
              link: cert.url,
            })
          );
        }

        children.push(
          new Paragraph({
            spacing: { before: 30, after: 30 },
            children: certRuns,
          })
        );
      });
    }

    // 10. Scholastic Achievements
    if (resumeData.achievements?.length > 0) {
      children.push(createSectionHeading('Scholastic Achievements'));
      resumeData.achievements.forEach((a) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: a,
                size: 19,
                font: 'Times New Roman',
                color: '1E293B',
              }),
            ],
          })
        );
      });
    }

    // Build the Word document with standard 0.5 in / 720 dxa margins
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,
                bottom: 720,
                left: 720,
                right: 720,
              },
            },
          },
          children,
        },
      ],
    });

    const docxBuffer = await Packer.toBuffer(doc);
    const candidateName = resumeData.personal?.name?.replace(/\s+/g, '_') || 'resume';
    const filename = `${candidateName}_tailored.docx`;

    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': docxBuffer.length.toString(),
      },
    });
  } catch (err: unknown) {
    console.error('[export-docx] Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
