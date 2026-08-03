'use client';

import { STAGES, PRO_STAGE, WORKSHOPS_STAGE, COURSES, coursesForStage } from './data/courses';
import Hero from '@/components/catalogue/Hero/Hero';
import StageSection from '@/components/catalogue/StageSection/StageSection';
import ProProgram from '@/components/catalogue/ProProgram/ProProgram';
import styles from './page.module.scss';
import { useSmoothScroll } from '../(collections)/products/prashanta/useSmoothScroll';

// Promo config — remove or update as needed
const CLAY_PROMO = {
  currentPrice: '₹499',
  originalPrice: '₹1,099',
  saveText: '₹599',
  deadline: '14 Sept',
};

export default function CourseCataloguePage() {
  const proCourse = COURSES.find((c) => c.stage === 'pro')!;
  const workshopsCourse = COURSES.find((c) => c.stage === 'later')!;
  useSmoothScroll();

  // Combine regular stages + workshops stage (rendered same way)
  const allStages = [...STAGES, WORKSHOPS_STAGE];

  return (
    <main className={styles.page}>
      <Hero />

      {allStages.map((stage, i) => {
        const courses = coursesForStage(stage.id);
        if (!courses.length) return null;

        return (
          <StageSection
            key={stage.id}
            stage={stage}
            courses={courses}
            showCatalogueLabel={i === 0}
            promo={stage.id === 'clay' ? CLAY_PROMO : undefined}
          />
        );
      })}

      <ProProgram stage={PRO_STAGE} course={proCourse} />
    </main>
  );
}