import Link from 'next/link';
import styles from './NavBar.module.scss'

export default function NavBar() {
    return (
        <nav className={styles.navbar}>
            <div
                className={styles.toplayer}

            >

                <p className={styles.element}>Shantiniketan studio</p>
                <Link className={styles.element} href="/">
                    Studio Life
                </Link>
                <Link className={styles.element} href="/">
                    Enroll today
                </Link>
            </div>
        </nav>
    )
}