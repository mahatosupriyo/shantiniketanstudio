'use client';

import RevealOnScroll from '../RevealOnScroll/RevealOnScroll';
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <RevealOnScroll className={styles.hero}>
      <h1 className={styles.title}>Course catalogue</h1>
      <p className={styles.lead}>
        10 courses on the bench, the wheel and the kiln. 
        <br /><br />
        Each one runs over consecutive weekends and covers a set of lessons, and one fee buys the
        whole course, not a lesson at a time. 
        <br /><br />
        Clay, tools, glazes and firing
        are included.
      </p>
    </RevealOnScroll>
  );
}