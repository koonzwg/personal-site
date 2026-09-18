import { join } from "node:path";
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { resume } from "@/lib/resume";

// ATS-friendly by construction: one column, real selectable text, standard section names,
// contact details in the body (not a header/footer), no tables or images.

const font = (f: string) => join(process.cwd(), "src/assets/fonts", f);
Font.register({
  family: "Inter",
  fonts: [
    { src: font("inter-latin-400-normal.woff"), fontWeight: 400 },
    { src: font("inter-latin-500-normal.woff"), fontWeight: 500 },
    { src: font("inter-latin-600-normal.woff"), fontWeight: 600 },
  ],
});
Font.registerHyphenationCallback((word: string) => [word]); // never hyphenate

const ink = "#111111";
const body = "#3F3F3F";
const muted = "#8C8C8C";
const rule = "#E8E8E8";

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 8.5,
    color: body,
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 44,
    lineHeight: 1.32,
  },
  name: {
    fontSize: 20,
    fontWeight: 600,
    color: ink,
    letterSpacing: -0.5,
    lineHeight: 1.15,
  },
  title: {
    fontSize: 11,
    fontWeight: 500,
    color: muted,
    marginTop: 1,
    letterSpacing: -0.2,
    lineHeight: 1.2,
  },
  contact: { marginTop: 7, fontSize: 8.5, color: body, lineHeight: 1.45 },
  link: { color: ink, textDecoration: "none" },
  section: { marginTop: 10 },
  heading: {
    fontSize: 7.5,
    fontWeight: 600,
    color: muted,
    letterSpacing: 0.9,
    textTransform: "uppercase",
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: rule,
    marginBottom: 6,
  },
  role: { marginBottom: 5 },
  roleTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  company: { fontSize: 10, fontWeight: 600, color: ink, letterSpacing: -0.15 },
  dates: { fontSize: 8.5, fontWeight: 500, color: muted },
  roleLine: { flex: 1, marginBottom: 2 },
  roleTitle: { fontSize: 9.5, fontWeight: 500, color: ink },
  bullet: { flexDirection: "row", marginTop: 1 },
  bulletMark: { width: 9, color: "#B0B0B0" },
  bulletText: { flex: 1 },
  skillRow: { marginBottom: 2 },
  skillGroup: { fontWeight: 600, color: ink },
  skillItems: {},
});

const Sep = () => <Text style={{ color: "#C4C4C4" }}>{"   ·   "}</Text>;

function Contact() {
  return (
    <View style={s.contact}>
      <Text>
        {resume.location}
        <Sep />
        {resume.availability}
      </Text>
      <Text>
        <Link src={`mailto:${resume.email}`} style={s.link}>
          {resume.email}
        </Link>
        <Sep />
        {resume.phone}
        {resume.links.map((l) => (
          <Text key={l.href}>
            <Sep />
            <Link src={l.href} style={s.link}>
              {l.label}
            </Link>
          </Text>
        ))}
      </Text>
    </View>
  );
}

export function ResumeDocument() {
  return (
    <Document
      title={`${resume.name} — Resume`}
      author={resume.name}
      subject={resume.title}
      keywords="product design, design engineer, AI, iOS, SwiftUI, React, Next.js, TypeScript"
    >
      <Page size="LETTER" style={s.page}>
        <Text style={s.name}>{resume.name}</Text>
        <Text style={s.title}>{resume.title}</Text>
        <Contact />

        <View style={s.section}>
          <Text style={s.heading}>Profile</Text>
          <Text>{resume.profile}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.heading}>Experience</Text>
          {resume.experience.map((r) => (
            <View key={r.company} style={s.role} wrap={false}>
              <View style={s.roleTop}>
                <Text style={s.roleLine}>
                  <Text style={s.company}>{r.company}</Text>
                  <Text style={{ color: "#C4C4C4" }}>{"  —  "}</Text>
                  <Text style={s.roleTitle}>{r.title}</Text>
                </Text>
                <Text style={s.dates}>{r.dates}</Text>
              </View>
              {r.bullets.map((b, i) => (
                <View key={i} style={s.bullet}>
                  <Text style={s.bulletMark}>•</Text>
                  <Text style={s.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.heading}>Education</Text>
          {resume.education.map((e) => (
            <View key={e.school} style={[s.roleTop, s.role]}>
              <Text>
                <Text style={s.company}>{e.school}</Text>
                <Sep />
                <Text style={{ color: ink, fontWeight: 500 }}>{e.program}</Text>
              </Text>
              <Text style={s.dates}>{e.dates}</Text>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.heading}>Skills</Text>
          {resume.skills.map((k) => (
            <Text key={k.group} style={s.skillRow}>
              <Text style={s.skillGroup}>{k.group}: </Text>
              {k.items}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
