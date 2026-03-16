
import { AccessLevel, Degree, Office } from '@/types';

/**
 * Checks if a user has permission to view a specific degree based on their access level.
 */
export const canAccessDegree = (userLevel: AccessLevel, degree: Degree): boolean => {
  if (userLevel === AccessLevel.GUEST) return false;
  if (userLevel === AccessLevel.OFFICER) return true;

  switch (degree) {
    case Degree.FIRST:
      return [AccessLevel.EA, AccessLevel.FC, AccessLevel.MM].includes(userLevel);
    case Degree.SECOND:
      return [AccessLevel.FC, AccessLevel.MM].includes(userLevel);
    case Degree.THIRD:
      return userLevel === AccessLevel.MM;
    case Degree.GENERAL:
      return userLevel === AccessLevel.MM;
    default:
      return false;
  }
};

/**
 * Checks if a user has permission to view officer-specific content.
 */
export const canAccessOfficerContent = (userLevel: AccessLevel): boolean => {
  return userLevel === AccessLevel.OFFICER;
};

/**
 * Checks if a specific ritual section is accessible to the user.
 */
export const canAccessRitual = (userLevel: AccessLevel, degree: Degree, office: Office): boolean => {
  if (userLevel === AccessLevel.GUEST) return false;
  
  // Officers can see everything
  if (userLevel === AccessLevel.OFFICER) return true;

  // Non-officers can only see Candidate content for their degree
  if (office !== Office.CANDIDATE) return false;

  return canAccessDegree(userLevel, degree);
};

/**
 * Returns the numeric rank of an access level for comparison.
 */
export const getLevelRank = (level: AccessLevel): number => {
  const ranks: Record<AccessLevel, number> = {
    [AccessLevel.GUEST]: 0,
    [AccessLevel.EA]: 1,
    [AccessLevel.FC]: 2,
    [AccessLevel.MM]: 3,
    [AccessLevel.OFFICER]: 4,
  };
  return ranks[level];
};
