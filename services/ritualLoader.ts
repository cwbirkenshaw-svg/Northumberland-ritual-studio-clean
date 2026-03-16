import { Degree, Working, RitualSection } from '@/src/types';

export type RitualMode = 'ritual' | 'learning';

export async function loadRituals(
  working: Working | string,
  mode: RitualMode,
  degree: Degree | string
): Promise<RitualSection[]> {
  const degreeFolder = degree === Degree.FIRST ? 'firstDegree' :
                       degree === Degree.SECOND ? 'secondDegree' :
                       degree === Degree.THIRD ? 'thirdDegree' : degree;
                       
  const workingFolder = working.toLowerCase();

  try {
    if (mode === 'ritual') {
      if (workingFolder === 'northumberland') {
        if (degreeFolder === 'firstDegree') {
          const module = await import('../rituals/northumberland/firstDegree');
          return module.FIRST_DEGREE_RITUALS || [];
        } else if (degreeFolder === 'secondDegree') {
          const module = await import('../rituals/northumberland/secondDegree');
          return module.SECOND_DEGREE_RITUALS || [];
        } else if (degreeFolder === 'thirdDegree') {
          const module = await import('../rituals/northumberland/thirdDegree');
          return module.THIRD_DEGREE_RITUALS || [];
        }
      } else if (workingFolder === 'emulation') {
        if (degreeFolder === 'firstDegree') {
          const module = await import('../rituals/emulation/firstDegree');
          return module.FIRST_DEGREE_RITUALS || [];
        } else if (degreeFolder === 'secondDegree') {
          const module = await import('../rituals/emulation/secondDegree');
          return module.SECOND_DEGREE_RITUALS || [];
        } else if (degreeFolder === 'thirdDegree') {
          const module = await import('../rituals/emulation/thirdDegree');
          return module.THIRD_DEGREE_RITUALS || [];
        }
      }
    } else if (mode === 'learning') {
      if (workingFolder === 'northumberland') {
        if (degreeFolder === 'firstDegree') {
          const module = await import('../learning/northumberland/firstDegree');
          return module.LEARNING_RITUALS || [];
        } else if (degreeFolder === 'secondDegree') {
          const module = await import('../learning/northumberland/secondDegree');
          return module.LEARNING_RITUALS || [];
        } else if (degreeFolder === 'thirdDegree') {
          const module = await import('../learning/northumberland/thirdDegree');
          return module.LEARNING_RITUALS || [];
        }
      } else if (workingFolder === 'emulation') {
        if (degreeFolder === 'firstDegree') {
          const module = await import('../learning/emulation/firstDegree');
          return module.LEARNING_RITUALS || [];
        } else if (degreeFolder === 'secondDegree') {
          const module = await import('../learning/emulation/secondDegree');
          return module.LEARNING_RITUALS || [];
        } else if (degreeFolder === 'thirdDegree') {
          const module = await import('../learning/emulation/thirdDegree');
          return module.LEARNING_RITUALS || [];
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error(`Failed to load rituals for ${working}/${mode}/${degree}:`, error);
    return [];
  }
}
