'use client';

import { relative } from 'path';
import type { Course } from '../../../app/catalogue/data/courses';
import { formatFee, formatDuration } from '../../../app/catalogue/data/courses';
import styles from './CourseBlock.module.scss';

interface Props {
  course: Course;
  showRule?: boolean;
}

export default function CourseBlock({ course, showRule = false }: Props) {
  const fee = formatFee(course.studio_fee);
  const duration = formatDuration(course.duration);

  const meta = course.prerequisite
    ? `Prerequisite: ${course.prerequisite} · ${duration}`
    : course.experience_required
      ? `Experience required · ${duration}`
      : `No prior experience required · ${duration}`;

  const twoCol = course.lessons.length >= 4;

  return (
    <div className={styles.block}>
      {showRule && <hr className={styles.rule} />}

      <div className={styles.header}>
        <h3 className={styles.title}>{course.name}</h3>
        <p className={styles.meta}>{meta}</p>

        <div>
          {course.studio_fee !== null ? (
            <a className={styles.pill} href="#">
              <span className={styles.pilldata}>
                Grab your seat at&nbsp;<b>{fee}</b>
              </span>
              <span className={styles.pilbg} />
            </a>

          ) : (
            <span className={styles.soon}>Coming soon</span>
          )}
        </div>



        {course.notes && <p className={styles.note}>{course.notes}</p>}
      </div>

      <ol className={`${styles.lessons} ${twoCol ? styles.twoCol : ''}`}>
        {course.lessons.map((l) => (
          <li key={l.lesson_number} className={styles.lesson}>
            <span className={styles.lessonNo}>
              Lesson {l.lesson_number}
              {l.is_professional_elective && <span className={styles.pro}> · Pro</span>}
            </span>
            <span className={styles.lessonName}>
              {l.name}
              {l.format && <span className={styles.format}> ({l.format.join(' / ')})</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}