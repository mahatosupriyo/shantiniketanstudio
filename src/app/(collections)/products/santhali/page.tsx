"use client";
import NavBar from '@/components/system/navbar/NavBar'
import styles from './santhali.module.scss'
import SanthaliHero from './SanthaliHero';

function SanthaliPage() {
    return (
        <div className={styles.content}>
            <NavBar />
            
            {/* <div className={styles.hero}>

                <h1 className={styles.title}>
                    Santhali tattoo <br /> inspired ceramics
                </h1>
                <img className={styles.heroimage} src={"/assets/santhali/herosanthali.webp"} />

                <div className={styles.desc}>
                    <h3 className={styles.subheading}>
                        The tattoo is permanent
                        <br />
                        The ceramic is fired
                        <br />
                        Both become marks that remain
                    </h3>
                </div>
            </div> */}

            <SanthaliHero/>


            <div className={styles.imagewraper}>
                <img src="/assets/santhali/insposanthali.webp" className={styles.inspo} />
            </div>

            <div className={styles.gallery}>
                <img className={styles.asset} src="/assets/santhali/1.webp" />
                <img className={styles.asset} src="/assets/santhali/2.webp" />
                <img className={styles.asset} src="/assets/santhali/4.webp" />
                <img className={styles.asset} src="/assets/santhali/5.webp" />
            </div>
        </div>
    )
}

export default SanthaliPage