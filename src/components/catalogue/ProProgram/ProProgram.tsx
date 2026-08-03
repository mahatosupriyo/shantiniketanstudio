'use client';

import type { Course, Stage } from '../../../app/catalogue/data/courses';
import { formatFee, formatDuration } from '../../../app/catalogue/data/courses';
import RevealOnScroll from '../RevealOnScroll/RevealOnScroll';
import styles from './ProProgram.module.scss';

interface Props {
  stage: Stage;
  course: Course;
}

export default function ProProgram({ stage, course }: Props) {
  const fee = formatFee(course.studio_fee);
  const duration = formatDuration(course.duration);
  const mid = Math.ceil(course.lessons.length / 2);

  return (
    <RevealOnScroll className={styles.finale}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{duration} · Certification</p>

        <div className={styles.head}>
          <h2 className={styles.title}>
            The whole process, in order, over twelve weekends.
          </h2>
          <a className={styles.circle} href="#">
            <span>Grab your <br /> seat at {fee}</span>
          </a>
        </div>

        <div className={styles.curriculum}>
          <ul>
            {course.lessons.slice(0, mid).map((l) => (
              <li key={l.lesson_number}>
                <sup>{l.lesson_number}</sup>{l.name}
              </li>
            ))}
          </ul>
          <ul>
            {course.lessons.slice(mid).map((l) => (
              <li key={l.lesson_number}>
                <sup>{l.lesson_number}</sup>{l.name}
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.foot}>{stage.description}</p>
      </div>
    </RevealOnScroll>
  );
}