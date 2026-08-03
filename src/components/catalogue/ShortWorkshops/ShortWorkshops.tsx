'use client';

import type { Course, Stage } from '../../../app/catalogue/data/courses';
import RevealOnScroll from '../RevealOnScroll/RevealOnScroll';
import styles from './ShortWorkshops.module.scss';

interface ShortWorkshopsProps {
  stage: Stage;
  course: Course;
}

export default function ShortWorkshops({ stage, course }: ShortWorkshopsProps) {
  return (
    <div className={styles.wrap}>
      <RevealOnScroll className={styles.section}>
        <p className={styles.stageNo}>Stage {String(stage.order).padStart(2, '0')}</p>
        <h2 className={styles.word}>{stage.label}</h2>
        <p className={styles.intro}>{stage.description}</p>

        <div className={styles.grid}>
          {course.lessons.map((l) => (
            <div key={l.lesson_number} className={styles.card}>
              <span className={styles.cardNo}>{String(l.lesson_number).padStart(2, '0')}</span>
              <span className={styles.cardName}>{l.name}</span>
            </div>
          ))}
        </div>

        <p className={styles.comingSoon}>
          Dates and fees announced per workshop — coming soon.
        </p>
      </RevealOnScroll>
    </div>
  );
}
