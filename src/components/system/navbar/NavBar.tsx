"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.scss";

export default function NavBar() {
    const pathname = usePathname();

    // Active tab based on current page
    const activeIndex = pathname === "/catalogue" ? 1 : 0;

    return (
        <nav className={styles.navbar}>
            <div className={styles.toplayer}>

                <div>
                    <Link
                        href="/"
                        className={styles.element}
                        style={{ mixBlendMode: "difference" }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="26"
                            viewBox="0 0 62 59"
                            fill="#352E24"
                        >
                            <path d="M29.695 24.8286C32.4397 24.6508 34.8054 26.7281 34.9849 29.4639C35.1643 32.1992 33.0905 34.567 30.3458 34.7483C27.599 34.9294 25.2294 32.8508 25.0499 30.113C24.8707 27.3754 26.9486 25.0068 29.695 24.8286Z" />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M24.6984 0.0359738C35.4656 -0.188105 44.1685 0.438636 52.765 7.6476C58.3151 12.3008 60.5757 19.2431 61.8076 26.26C62.0506 27.6525 62.1392 33.9132 61.6115 35.2317C59.6505 40.1272 57.2117 45.8512 54.0971 50.1317C49.6523 55.6515 44.1868 57.8482 37.3981 58.5199C32.1892 59.204 21.1558 58.6103 16.418 56.6579C1.12261 50.3552 -5.40829 25.065 5.22086 12.1442C10.9508 5.17948 15.9054 1.30918 24.6984 0.0359738ZM39.5886 19.9527C35.7669 16.7479 31.8391 16.5499 27.8266 16.6334L27.6779 16.6368L27.5309 16.6581C25.6346 16.9327 24.0479 17.5078 22.6133 18.4461C21.2122 19.3625 20.0644 20.5561 18.9612 21.897C16.398 25.0128 16.0688 29.3427 16.9927 32.9809C17.916 36.6165 20.2668 40.2564 23.959 41.778C25.1906 42.2855 26.9425 42.534 28.4281 42.6479C29.9344 42.7635 31.5503 42.7667 32.7157 42.6223C35.6313 42.3331 38.2823 41.3273 40.4001 38.6973L40.4372 38.6513L40.4717 38.6032C41.7989 36.7791 42.7785 34.4408 43.4808 32.6873C43.6859 32.1749 43.732 31.5808 43.7509 31.339C43.7794 30.975 43.7913 30.5698 43.794 30.1923C43.7988 29.5177 43.7755 28.6205 43.6892 28.1258V28.1237L43.5946 27.6134C43.0924 25.0365 42.1051 22.0626 39.5886 19.9527Z"
                            />
                        </svg>
                    </Link>
                </div>

                <div className={styles.navbtnlist}>

                    {/* Sliding active background */}
                    <div
                        className={styles.slider}
                        style={{
                            transform: `translateX(${activeIndex * 100}%)`,
                        }}
                    />

                    <Link
                        className={`${styles.btn} ${
                            activeIndex === 0 ? styles.activeText : ""
                        }`}
                        href="/"
                        draggable="false"
                    >
                        Products
                    </Link>

                    <Link
                        className={`${styles.btn} ${
                            activeIndex === 1 ? styles.activeText : ""
                        }`}
                        href="/catalogue"
                        draggable="false"
                    >
                        Courses
                    </Link>

                </div>
            </div>
        </nav>
    );
}