import Link from 'next/link';
import styles from './NavBar.module.scss'

export default function NavBar() {
    return (
        <nav className={styles.navbar}>
            <div
                className={styles.toplayer}

            >
                <div>
                    <Link href="/" className={styles.element}>Shantiniketan studio</Link>
                </div>
                <Link className={styles.element} href="/catalogue">
                    Courses
                </Link>
                <Link className={styles.element} href="/products/prashanta">Products</Link>
            </div>
        </nav>
    )
}