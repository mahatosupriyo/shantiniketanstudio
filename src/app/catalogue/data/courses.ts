// ============================================================
// Course Catalogue — Typed Data
// Source of truth for Shantiniketan Studio courses.
// ============================================================

export interface Lesson {
  lesson_number: number;
  name: string;
  format?: ('online' | 'offline')[];
  is_professional_elective?: boolean;
}

export interface Duration {
  value: number | null;
  unit: 'weekend' | 'day';
  range?: [number, number];
}

export interface Course {
  course_number: number;
  code: string;
  name: string;
  stage: string;
  duration: Duration;
  studio_fee: number | null;
  fee_note?: string;
  prerequisite: string | null;
  experience_required: boolean;
  notes: string | null;
  status?: 'coming_soon';
  lessons: Lesson[];
}

export interface Stage {
  id: string;
  label: string;
  order: number;
  description: string;
  image?: string;         // path under /images/courses/
}

// ---- Stage metadata (descriptions + images) ----

export const STAGES: Stage[] = [
  {
    id: 'clay',
    label: 'Clay',
    order: 1,
    description:
      'Where everyone starts. One weekend, three lessons, and enough time at both the bench and the wheel to find out which one your hands prefer.',
    image: '/assets/courses/stdiosix.jpeg',
  },
  {
    id: 'form',
    label: 'Forming',
    order: 2,
    description:
      'Building height, wall control and repeatability — by hand, on the wheel, in the round, or out of a plaster mould.',
    image: '/assets/courses/stdioseven.jpeg',
  },
  {
    id: 'surface',
    label: 'Surface',
    order: 3,
    image: '/assets/courses/stdioeight.jpeg',
    description:
      'Texture, carving and pattern — the marks that stay after the clay is fired. Surface is where a piece stops being generic and starts being yours.',
  },
  {
    id: 'glaze',
    label: 'Glaze',
    order: 4,
    image: '/assets/courses/stdionine.jpeg',
    description:
      'Chemistry you can see. From dipping and pouring to formulating your own recipes — colour, opacity and melt, controlled.',
  },
  {
    id: 'fire',
    label: 'Firing',
    order: 5,
    image: '/assets/courses/stdioone.jpeg',
    description:
      'Raku, gas, experimental — the kiln transforms everything before it. Bring bisque-fired work and fire it live.',
  },
];

// ---- Professional Foundation Program ----

export const PRO_STAGE: Stage = {
  id: 'pro',
  label: 'Professional',
  order: 6,
  description:
    'The longform curriculum. Fourteen lessons that take you from a bag of clay to a finished body of work, ending in a portfolio project, a studio exhibition and a certificate. One fee covers all of it.',
};

// ---- Short Workshops ----

export const WORKSHOPS_STAGE: Stage = {
  id: 'later',
  label: 'Short Workshops',
  order: 7,
  image: '/assets/courses/stdiotwo.jpeg',
  description:
    'One-off and themed workshops — miniatures, corporate team days, community sessions. Dates and fees announced per workshop.',
};

// ---- All courses ----

export const COURSES: Course[] = [
  {
    course_number: 1,
    code: 'FD·01',
    name: 'Beginner Foundation Courses',
    stage: 'clay',
    duration: { value: 1, unit: 'weekend' },
    studio_fee: 500,
    prerequisite: null,
    experience_required: false,
    notes: null,
    lessons: [
      { lesson_number: 1, name: 'Intensive Beginner Hand-building' },
      { lesson_number: 2, name: 'Intensive Beginner Wheel Throwing' },
      { lesson_number: 3, name: 'From Clay to Creation' },
    ],
  },
  {
    course_number: 2,
    code: 'IN·02',
    name: 'Intermediate Courses',
    stage: 'form',
    duration: { value: 2, unit: 'weekend' },
    studio_fee: 1000,
    prerequisite: 'Basic hand-building knowledge',
    experience_required: true,
    notes: null,
    lessons: [
      { lesson_number: 1, name: 'Hand-building Level 02' },
      { lesson_number: 2, name: 'Advanced construction techniques' },
      { lesson_number: 3, name: 'Functional and sculptural forms' },
    ],
  },
  {
    course_number: 3,
    code: 'WT·03',
    name: 'Wheel Throwing',
    stage: 'form',
    duration: { value: 4, unit: 'weekend' },
    studio_fee: 3000,
    prerequisite: null,
    experience_required: false,
    notes: null,
    lessons: [
      { lesson_number: 1, name: 'Beginner Wheel Throwing' },
      { lesson_number: 2, name: 'Centering' },
      { lesson_number: 3, name: 'Wedging' },
      { lesson_number: 4, name: 'Pulling' },
      { lesson_number: 5, name: 'Trimming' },
      { lesson_number: 6, name: 'Altering cylinders into bottles and vessels' },
    ],
  },
  {
    course_number: 4,
    code: 'SC·04',
    name: 'Sculpture',
    stage: 'form',
    duration: { value: 4, unit: 'weekend' },
    studio_fee: 4000,
    prerequisite: null,
    experience_required: false,
    notes: null,
    lessons: [
      { lesson_number: 1, name: 'Relief Sculpture' },
      { lesson_number: 2, name: 'Figurative Sculpture' },
      { lesson_number: 3, name: 'Ceramic sculptural techniques' },
      { lesson_number: 4, name: 'Surface modelling' },
    ],
  },
  {
    course_number: 5,
    code: 'SD·05',
    name: 'Surface Decoration',
    stage: 'surface',
    duration: { value: 2, unit: 'weekend' },
    studio_fee: 2000,
    prerequisite: null,
    experience_required: false,
    notes: null,
    lessons: [
      { lesson_number: 1, name: 'Ceramic surface decoration' },
      { lesson_number: 2, name: 'Texture' },
      { lesson_number: 3, name: 'Carving' },
      { lesson_number: 4, name: 'Decorative finishes' },
    ],
  },
  {
    course_number: 6,
    code: 'GL·06',
    name: 'Glaze Courses',
    stage: 'glaze',
    duration: { value: 4, unit: 'weekend' },
    studio_fee: 5000,
    prerequisite: null,
    experience_required: false,
    notes: null,
    lessons: [
      { lesson_number: 1, name: 'Principles of Glaze Application' },
      { lesson_number: 2, name: 'Glaze Application Level 1' },
      { lesson_number: 3, name: 'Glaze Formulation Theory & Practical'},
      { lesson_number: 4, name: 'Making your own glazes', is_professional_elective: true },
    ],
  },
  {
    course_number: 7,
    code: 'MM·07',
    name: 'Slip Casting & Mold Making',
    stage: 'form',
    duration: { value: 3, unit: 'weekend' },
    studio_fee: 3000,
    prerequisite: null,
    experience_required: false,
    notes: null,
    lessons: [
      { lesson_number: 1, name: 'Introduction to Slip Casting' },
      { lesson_number: 2, name: 'Mold Making and Slip Casting', is_professional_elective: true },
      { lesson_number: 3, name: 'Industrial ceramic production techniques' },
    ],
  },
  {
    course_number: 8,
    code: 'AF·08',
    name: 'Alternative Firing',
    stage: 'fire',
    duration: { value: 2, unit: 'weekend' },
    studio_fee: 5000,
    prerequisite: 'Bisque-fired work to bring to class',
    experience_required: false,
    notes: null,
    lessons: [
      { lesson_number: 1, name: 'Raku Firing' },
      { lesson_number: 2, name: 'Gas Firing' },
      { lesson_number: 3, name: 'Experimental firing methods' },
    ],
  },
  {
    course_number: 9,
    code: 'PF·09',
    name: 'Professional Foundation Program',
    stage: 'pro',
    duration: { value: 12, unit: 'weekend' },
    studio_fee: 12000,
    prerequisite: null,
    experience_required: false,
    notes: 'Long-term professional curriculum. Ends in a portfolio project, a final exhibition, and certification.',
    lessons: [
      { lesson_number: 1, name: 'Understanding Clay' },
      { lesson_number: 2, name: 'Hand Building' },
      { lesson_number: 3, name: 'Wheel Throwing' },
      { lesson_number: 4, name: 'Surface Decoration' },
      { lesson_number: 5, name: 'Glaze Application' },
      { lesson_number: 6, name: 'Sculpture' },
      { lesson_number: 7, name: 'Alternative Firing' },
      { lesson_number: 8, name: 'Advanced Hand Building' },
      { lesson_number: 9, name: 'Advanced Wheel Throwing' },
      { lesson_number: 10, name: 'Advanced Sculpture' },
      { lesson_number: 11, name: 'Glaze Making' },
      { lesson_number: 12, name: 'Mold Making & Slip Casting' },
      { lesson_number: 13, name: 'Portfolio projects' },
      { lesson_number: 14, name: 'Final exhibition and certification' },
    ],
  },
  {
    course_number: 10,
    code: 'SW·10',
    name: 'Short Workshops',
    stage: 'later',
    duration: { value: null, unit: 'day', range: [1, 4] },
    studio_fee: null,
    fee_note: 'Depends on the workshop.',
    prerequisite: null,
    experience_required: false,
    status: 'coming_soon',
    notes: null,
    lessons: [
      { lesson_number: 1, name: 'Miniature Ceramics' },
      { lesson_number: 2, name: 'Theme-based ceramic workshops' },
      { lesson_number: 3, name: 'Corporate pottery workshops' },
      { lesson_number: 4, name: 'Community studio practice sessions' },
    ],
  },
];

// ---- Helpers ----

/** Returns all courses belonging to a given stage id */
export function coursesForStage(stageId: string): Course[] {
  return COURSES.filter((c) => c.stage === stageId);
}

/** Formats fee as ₹X,XXX or returns a fallback for null */
export function formatFee(fee: number | null, fallback = 'TBA'): string {
  if (fee === null) return fallback;
  return `₹${fee.toLocaleString('en-IN')}`;
}

/** Formats duration as "1 weekend" / "4 weekends" / "1–4 days" */
export function formatDuration(d: Duration): string {
  if (d.value === null && d.range) {
    return `${d.range[0]}–${d.range[1]} ${d.unit}s`;
  }
  const plural = d.value !== 1 ? 's' : '';
  return `${d.value} ${d.unit}${plural}`;
}
