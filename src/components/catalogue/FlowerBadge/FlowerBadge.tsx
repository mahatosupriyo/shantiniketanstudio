'use client';

import styles from './FlowerBadge.module.scss';

const FLOWER =
  'M128 0C147.68 0 164.04 14.213 167.377 32.934C182.974 22.055 204.594 23.574 218.51 37.49C232.426 51.406 233.944 73.025 223.066 88.622C241.787 91.96 256 108.32 256 128C256 147.68 241.787 164.04 223.065 167.377C233.944 182.974 232.426 204.594 218.51 218.51C204.594 232.426 182.974 233.944 167.377 223.065C164.04 241.787 147.68 256 128 256C108.32 256 91.959 241.787 88.622 223.065C73.025 233.944 51.406 232.426 37.49 218.51C23.574 204.594 22.055 182.974 32.934 167.377C14.213 164.04 0 147.68 0 128C0 108.32 14.213 91.96 32.934 88.622C22.056 73.025 23.574 51.406 37.49 37.49C51.406 23.574 73.025 22.055 88.622 32.934C91.96 14.213 108.32 0 128 0Z';

interface Props {
  currentPrice: string;
  originalPrice?: string;
  label?: string;
}

export default function FlowerBadge({ currentPrice, originalPrice, label = 'Now at' }: Props) {
  return (
    <div className={styles.badge}>
      <svg className={styles.flower} viewBox="0 0 256 256" aria-hidden="true">
        <path d={FLOWER} />
      </svg>
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <span className={styles.price}>{currentPrice}</span>
        {originalPrice && <span className={styles.was}>{originalPrice}</span>}
      </div>
    </div>
  );
}