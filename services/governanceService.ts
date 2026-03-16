import { RitualPack, RitualStep, RitualPackSection, RitualRole, Degree, Working, Office } from '../types';

export const NORTHUMBERLAND_CORE_ID = 'core-northumberland';
export const EMULATION_CORE_ID = 'core-emulation';

export const validatePack = (pack: any): { pass: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  try {
    if (!pack || typeof pack !== 'object') {
      return { pass: false, errors: ["Invalid pack format: must be a JSON object"] };
    }

    if (!pack.schema_version || pack.schema_version !== "1.0.0") {
      errors.push("schema_version must be '1.0.0'");
    }
    
    if (pack.pack_type !== "CUSTOM") {
      errors.push("pack_type must be 'CUSTOM' for uploads");
    }
    
    const forbiddenNames = ["Northumberland", "Emulation"];
    if (forbiddenNames.some(name => pack.pack_name?.toLowerCase()?.includes(name.toLowerCase()))) {
      errors.push(`pack_name must not match or resemble: ${forbiddenNames.join(", ")}`);
    }
    
    const roles = pack.roles || [];
    const roleIds = Array.isArray(roles) ? roles.map((r: any) => r?.id) : [];
    
    const minimumRoles = ["WM", "SW", "JW", "SD", "JD", "IG", "T", "CHAP", "DC"];
    minimumRoles.forEach(role => {
      if (!roleIds.includes(role)) {
        errors.push(`roles must include at minimum: ${role}`);
      }
    });
    
    if (!pack.sections || !Array.isArray(pack.sections) || pack.sections.length === 0) {
      errors.push("sections array must exist and contain at least 1 section");
    } else {
      pack.sections.forEach((section: any, sIdx: number) => {
        if (!section || !section.steps || !Array.isArray(section.steps) || section.steps.length === 0) {
          errors.push(`sections[${sIdx}].steps must exist and contain at least 1 step`);
        } else {
          let lastSeq = -1;
          section.steps.forEach((step: any, stIdx: number) => {
            const path = `sections[${sIdx}].steps[${stIdx}]`;
            if (!step) {
              errors.push(`${path} is null or undefined`);
              return;
            }
            if (typeof step.seq !== 'number') errors.push(`${path}.seq is missing or not an integer`);
            if (!roleIds.includes(step.officer)) errors.push(`${path}.officer '${step.officer}' not in roles list`);
            if (!["speech", "stage", "dialogue"].includes(step.type)) errors.push(`${path}.type must be speech, stage, or dialogue`);
            if (!step.text) errors.push(`${path}.text is missing or empty`);
            
            if (typeof step.seq === 'number' && step.seq <= lastSeq) {
              errors.push(`${path}.seq must be ascending (duplicate or out of order)`);
            }
            lastSeq = step.seq;
          });
        }
      });
    }
    
    const prohibitedFields = ["core_override", "replace_core", "merge_core", "rename_core"];
    prohibitedFields.forEach(field => {
      if (pack[field] !== undefined) {
        errors.push(`Prohibited field found: ${field}`);
      }
    });
  } catch (err) {
    errors.push(`Validation engine error: ${err instanceof Error ? err.message : String(err)}`);
  }
  
  return { pass: errors.length === 0, errors };
};

export const getPackSummary = (pack: RitualPack) => {
  try {
    const sections = pack?.sections || [];
    const roles = pack?.roles || [];
    const stepCount = sections.reduce((acc, section) => acc + (section?.steps?.length || 0), 0);
    const degrees = Array.from(new Set(sections.map(s => s?.degree).filter(Boolean)));
    
    return {
      pack_name: pack?.pack_name || "Unknown",
      lodge_name: pack?.lodge_name || "N/A",
      degreesCount: degrees.length,
      sectionsCount: sections.length,
      officerList: roles.map(r => r?.name || "Unknown"),
      estimatedStepCount: stepCount
    };
  } catch (err) {
    return {
      pack_name: "Error parsing summary",
      lodge_name: "N/A",
      degreesCount: 0,
      sectionsCount: 0,
      officerList: [],
      estimatedStepCount: 0
    };
  }
};
