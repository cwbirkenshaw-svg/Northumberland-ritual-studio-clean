import { AccessLevel, Degree, Office } from '../types';

export const canAccessDegree = (level: AccessLevel, degree: Degree): boolean => {
  if (level === AccessLevel.OFFICER) return true;

  if (degree === Degree.FIRST) {
    return [
      AccessLevel.EA,
      AccessLevel.FC,
      AccessLevel.MM,
      AccessLevel.OFFICER,
    ].includes(level);
  }

  if (degree === Degree.SECOND) {
    return [
      AccessLevel.FC,
      AccessLevel.MM,
      AccessLevel.OFFICER,
    ].includes(level);
  }

  if (degree === Degree.THIRD || degree === Degree.GENERAL) {
    return [
      AccessLevel.MM,
      AccessLevel.OFFICER,
    ].includes(level);
  }

  return false;
};

export const canAccessOfficerContent = (level: AccessLevel, office?: Office | null): boolean => {
  if (!office) return false;
  if (office === Office.CANDIDATE) return true;
  return level === AccessLevel.OFFICER;
};

export const canAccessRitual = (
  level: AccessLevel,
  degree: Degree,
  office?: Office | null
): boolean => {
  if (!canAccessDegree(level, degree)) return false;
  if (!office) return true;
  return canAccessOfficerContent(level, office);
};
