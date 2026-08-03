'use client';

import type { Stage, Course } from '../../../app/catalogue/data/courses';
import { formatFee } from '../../../app/catalogue/data/courses'
import CourseBlock from '../CourseBlock/CourseBlock';
import FlowerBadge from '../FlowerBadge/FlowerBadge';
import RevealOnScroll from '../RevealOnScroll/RevealOnScroll';
import styles from './StageSection.module.scss';


interface Promo {
  currentPrice: string;
  originalPrice: string;
  saveText: string;
  deadline: string;
}

interface Props {
  stage: Stage;
  courses: Course[];
  showCatalogueLabel?: boolean;
  promo?: Promo;
  /** Callback ref for ScrollBackground tracking */
  sectionRef?: (el: HTMLElement | null) => void;
}

export default function StageSection({ stage, courses, showCatalogueLabel, promo }: Props) {
  return (
    <RevealOnScroll className={styles.section}>
      <div className={styles.row}>
        {/* ---- text ---- */}
        <div className={styles.text}>
          <div className={styles.intro}>
            <p className={styles.stageNo}>Stage {String(stage.order).padStart(2, '0')}</p>
            <h2 className={styles.word}>{stage.label}</h2>
            <p className={styles.desc}>{stage.description}</p>
          </div>

          {courses.map((c, i) => (
            <CourseBlock key={c.code} course={c} showRule={i > 0} />
          ))}
        </div>

        {/* ---- media ---- */}
        <div className={styles.media}>
          {stage.image ? (
            <figure className={styles.photo}>
              <img
                src={stage.image}
                alt={`${stage.label} — ceramics studio`}
                width={960}
                height={641}
                className={styles.img}
              // priority={stage.order <= 2}
              />
              {promo && (
                <FlowerBadge
                  currentPrice={promo.currentPrice}
                  originalPrice={promo.originalPrice}
                />
              )}
            </figure>
          ) : (
            <div className={styles.placeholder}>
              <span>{stage.label}</span>
            </div>
          )}

          {promo && (
            <p className={styles.save}>
              <b>Save {promo.saveText}</b>{' '}
              <span>if purchased before {promo.deadline}.</span>
            </p>
          )}
        </div>
      </div>
    </RevealOnScroll>
  );
}