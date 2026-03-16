
export const normalizeOfficer = (raw: string): string => {
  if (!raw) return "";
  
  // uppercase
  let cleaned = raw.toUpperCase();
  
  // remove punctuation and masonic dots/symbols (., ∴, •)
  cleaned = cleaned.replace(/[.,∴•]/g, "");
  
  // trim
  cleaned = cleaned.trim();
  
  // map common variants
  const mapping: Record<string, string> = {
    "WORSHIPFUL MASTER": "WM",
    "W M": "WM",
    "SENIOR WARDEN": "SW",
    "S W": "SW",
    "JUNIOR WARDEN": "JW",
    "J W": "JW",
    "SENIOR DEACON": "SD",
    "S D": "SD",
    "JUNIOR DEACON": "JD",
    "J D": "JD",
    "INNER GUARD": "IG",
    "I G": "IG",
    "TYLER": "TYLER",
    "TILER": "TYLER",
    "DIRECTOR OF CEREMONIES": "DC",
    "D C": "DC",
    "CHAPLAIN": "CHAP",
    "CANDIDATE": "CANDIDATE"
  };
  
  return mapping[cleaned] || cleaned;
};

export const normalizeWorking = (title: string): { key: string; title: string } => {
  if (!title) return { key: 'general', title: 'General' };
  
  const upper = title.toUpperCase();
  
  if (upper.includes('OPENING')) return { key: 'opening', title: 'Opening' };
  if (upper.includes('CLOSING')) return { key: 'closing', title: 'Closing' };
  if (upper.includes('OBLIGATION')) return { key: 'obligation', title: 'Obligation' };
  if (upper.includes('SECRETS') || upper.includes('ENTRUSTING')) return { key: 'secrets', title: 'Secrets' };
  if (upper.includes('CHARGE')) return { key: 'charge', title: 'The Charge' };
  if (upper.includes('TOOLS')) return { key: 'tools', title: 'Working Tools' };
  if (upper.includes('PREPARATION')) return { key: 'preparation', title: 'Preparation' };
  if (upper.includes('PERAMBULATION')) return { key: 'perambulation', title: 'Perambulation' };
  if (upper.includes('TRACING BOARD')) return { key: 'tracing-board', title: 'Tracing Board' };
  if (upper.includes('ADMISSION')) return { key: 'admission', title: 'Admission' };
  if (upper.includes('INSTALLATION')) return { key: 'installation', title: 'Installation' };

  return { 
    key: title.toLowerCase().replace(/\s+/g, '-'), 
    title: title 
  };
};

export interface WorkingCard {
  id: string;
  title: string;
  workingKey: string;
  count: number;
  section: any; // RitualSection
}

export const buildWorkingsIndex = (
  selectedDegree: string,
  selectedOfficerRaw: string,
  sections: any[] // RitualSection[]
): WorkingCard[] => {
  const cards: WorkingCard[] = [];
  const selectedOfficer = normalizeOfficer(selectedOfficerRaw);
  
  sections.forEach(section => {
    // Filter by degree
    if (section.degree !== selectedDegree && section.degree !== 'General/Installation') return;
    
    // Filter steps for the selected officer
    const officerSteps = section.steps?.filter((s: any) => {
      const stepOfficerKey = s.officerKey || normalizeOfficer(s.officer || "");
      return stepOfficerKey === selectedOfficer || stepOfficerKey === 'ALL';
    }) || [];
    
    if (officerSteps.length > 0) {
      const { title: wTitle, key: wKey } = normalizeWorking(section.title);
      
      // Ensure title follows pattern "OFFICER: Working Title"
      // If it already starts with officer name, don't double it
      let displayTitle = wTitle;
      const officerLabel = selectedOfficer; // Use the short key for the label as requested
      if (!displayTitle.toUpperCase().startsWith(officerLabel.toUpperCase())) {
        displayTitle = `${officerLabel}: ${wTitle}`;
      }

      cards.push({
        id: section.id,
        title: displayTitle,
        workingKey: wKey,
        count: officerSteps.length,
        section: {
          ...section,
          steps: officerSteps,
          content: officerSteps.map((s: any) => s.text)
        }
      });
    }
  });
  
  return cards;
};
