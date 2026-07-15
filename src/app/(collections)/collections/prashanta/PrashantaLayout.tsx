'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import lottie from 'lottie-web'
import NavBar from '@/components/system/navbar/NavBar'
import styles from './Prashanta.module.scss'
import AnimatedSignature from '@/components/system/animatedsignature/AnimatedSign'

// Register GSAP ScrollTrigger plugin for scroll-linked animations
gsap.registerPlugin(ScrollTrigger)

// Type extraction for the Lottie Animation instance
type LottieAnimation = ReturnType<typeof lottie.loadAnimation>

// Constants for text and media assets
const INTRO_LINE = 'Every meal begins long before food is served'
const QUOTE_LINE = 'all souls are equal and alike, and have the similar nature and qualities'

const MORPH_VIDEO_SRC = '/assets/prashanta/ring-to-plate.mp4'
const WORDMARK_LOTTIE_SRC = '/assets/prashanta/prashanta-reveal.lottie.json'

/**
 * Renders a string of text into individual spans for word-by-word animation.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.text - The full sentence or string to be split.
 * @param {string} props.wordClass - The CSS class applied to each word wrapper.
 */
function Words({ text, wordClass }: { text: string; wordClass: string }) {
    return (
        <>
            {text.split(' ').map((word, i) => (
                <span className={wordClass} key={`${word}-${i}`} aria-hidden="true">
                    {word}
                </span>
            ))}
        </>
    )
}

/**
 * Prashanta Cinematic Scroll Component.
 * Orchestrates a scroll-driven timeline using GSAP, Lottie, and HTML5 Video.
 * Handles graceful degradation for users with 'prefers-reduced-motion'.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function Prashanta() {
    const rootRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const lottieContainerRef = useRef<HTMLDivElement>(null)
    const fallbackRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const lenisRef = useRef<Lenis | null>(null)

    /* -------------------------------------------------------------------------- */
    /*                               Smooth Scroll                                */
    /* -------------------------------------------------------------------------- */
    useLayoutEffect(() => {
        // Bypass smooth scrolling for accessibility if requested by user system
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) return

        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
        lenisRef.current = lenis

        lenis.on('scroll', ScrollTrigger.update)

        const raf = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(raf)

        // Prevent GSAP from jumping timelines if frame rates drop
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(raf)
            lenis.destroy()
            lenisRef.current = null
        }
    }, [])

    /* -------------------------------------------------------------------------- */
    /*                              Master Timeline                               */
    /* -------------------------------------------------------------------------- */
    useLayoutEffect(() => {
        const root = rootRef.current
        const stage = stageRef.current
        const lottieContainer = lottieContainerRef.current
        const fallback = fallbackRef.current
        const video = videoRef.current

        if (!root || !stage || !lottieContainer || !fallback || !video) return

        const q = gsap.utils.selector(stage)
        const mm = gsap.matchMedia()

        const EASE = 'power2.inOut'

        let anim: LottieAnimation | null = null
        const lottieState = { ready: false, failed: false }

        // Set up context matching for responsiveness and accessibility
        mm.add(
            {
                desktop: '(min-width: 769px) and (prefers-reduced-motion: no-preference)',
                mobile: '(max-width: 768px) and (prefers-reduced-motion: no-preference)',
                reduced: '(prefers-reduced-motion: reduce)',
            },
            (ctx) => {
                const { reduced, mobile } = ctx.conditions as {
                    desktop: boolean
                    mobile: boolean
                    reduced: boolean
                }

                const introWords = q(`.${styles.introWord}`)

                // Graceful fallback for reduced motion users (skip complex timelines)
                if (reduced) {
                    gsap.set(fallback, { clearProps: 'all', opacity: 1 })
                    gsap.set(
                        [introWords, q(`.${styles.videoWrap}`)],
                        { clearProps: 'all', opacity: 1 }
                    )
                    return
                }

                // Initialize Lottie Animation
                anim = lottie.loadAnimation({
                    container: lottieContainer,
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    path: WORDMARK_LOTTIE_SRC,
                    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
                })

                anim.addEventListener('DOMLoaded', () => {
                    lottieState.ready = true
                    ScrollTrigger.refresh()
                })

                anim.addEventListener('data_failed', () => {
                    lottieState.failed = true
                })

                /* ------------------------ Initial State ----------------------- */
                gsap.set(introWords, { opacity: 0.16 })
                gsap.set([lottieContainer, fallback, q(`.${styles.videoWrap}`)], { opacity: 0 })

                /* ------------------------ Video Setup ------------------------- */
                const proxy = { t: 0 }
                let targetTime = 0

                const applyTime = () => {
                    // Mobile bypass: native playback is preferred over manual scrubbing
                    if (mobile || !video.duration) return

                    const current = video.currentTime
                    const next = current + (targetTime - current) * 0.18

                    if (Math.abs(next - current) > 0.001) {
                        video.currentTime = next
                    }
                }

                gsap.ticker.add(applyTime)
                const wordmarkProxy = { p: 0 }

                /* ------------------------ Core Timeline ----------------------- */
                const tl = gsap.timeline({
                    defaults: { ease: EASE },
                    scrollTrigger: {
                        trigger: stage,
                        start: 'top top',
                        end: mobile ? '+=13600' : '+=16000',
                        pin: true,
                        scrub: mobile ? 0.6 : 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                })

                /* ACT 1 — Intro text animation */
                tl.to(introWords, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                    stagger: { each: 0.32, ease: 'none' },
                })
                    .to({}, { duration: 0.6 })
                    .to(q(`.${styles.intro}`), {
                        opacity: 0,
                        y: -60,
                        scale: 0.96,
                        duration: 1,
                    })

                    /* ACT 2 — Lottie wordmark draw */
                    .to({}, { duration: 0.05 }, '-=0.25')
                    .to(
                        wordmarkProxy,
                        {
                            p: 1,
                            duration: mobile ? 1.4 : 1.8,
                            ease: 'none',
                            onUpdate: () => {
                                if (anim && lottieState.ready && !lottieState.failed) {
                                    lottieContainer.style.opacity = '1'
                                    fallback.style.opacity = '0'
                                    const lastFrame = Math.max(anim.totalFrames - 1, 0)
                                    anim.goToAndStop(wordmarkProxy.p * lastFrame, true)
                                } else {
                                    fallback.style.opacity = `${wordmarkProxy.p}`
                                }
                            },
                        },
                        '<'
                    )
                    .to({}, { duration: 0.2 }) // Hold state briefly after draw

                /* ACT 3 — Video Appearance */
                tl.to(q(`.${styles.videoWrap}`), {
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.inOut',
                    onStart: () => {
                        // Allow natural playback on mobile environments
                        if (mobile) {
                            video.currentTime = 0;
                            video.play().catch(() => {
                                // Gracefully handle low-power mode or auto-play blocks
                            });
                        }
                    }
                })

                /* ACT 4 — Split logic (Mobile vs Desktop scrub) */
                if (mobile) {
                    // Mobile: hold empty pin so user can watch the video play natively
                    tl.to({}, { duration: 3.4 })
                } else {
                    // Desktop: engage smooth scroll-scrub behavior
                    tl.to(proxy, {
                        t: 1,
                        duration: 3.4,
                        ease: 'none',
                        onUpdate: () => {
                            if (video.duration) {
                                targetTime = proxy.t * video.duration
                            }
                        },
                    })
                }

                // Cleanup scroll listener for this matchMedia context
                return () => {
                    gsap.ticker.remove(applyTime)
                    tl.scrollTrigger?.kill()
                }
            },
            root
        )

        // Metadata load refresh for accurate timeline duration limits
        video.load()
        const onMeta = () => {
            if (video) video.currentTime = 0.001;
            ScrollTrigger.refresh();
        }
        video.addEventListener('loadedmetadata', onMeta)

        // Global cleanup
        return () => {
            video.removeEventListener('loadedmetadata', onMeta)
            anim?.destroy()
            mm.revert()
        }
    }, [])



    const signaturePaths = [
        "M1018.77 594.427C1019.46 597.861 1021.48 600.883 1024.4 602.825C1027.31 604.768 1030.88 605.474 1034.31 604.787C1037.75 604.1 1040.77 602.077 1042.71 599.162C1044.65 596.248 1045.36 592.681 1044.67 589.246C1044.67 589.246 1044.67 589.246 1044.67 589.246C1041.7 562.268 1053.17 523.475 1060.01 489.959C1060.07 489.669 1060.14 489.378 1060.21 489.086C1086.34 374.822 1117 261.154 1137.39 144.215C1137.63 142.785 1137.87 141.366 1138.09 139.958C1141.99 115.346 1145.56 90.5884 1145.68 64.4001C1145.42 51.2445 1145.28 37.6722 1138.45 22.3103C1135.01 14.6966 1127.72 6.0877 1117.98 2.57399C1108.37 -1.01102 1099.48 -0.206216 1092.15 1.13854C1089.49 1.64975 1087.05 2.25698 1084.54 2.98286C1006.59 33.7642 954.945 91.6089 906.37 151.063C904.604 153.334 902.849 155.623 901.105 157.929C895.01 165.992 889.09 174.234 883.418 182.691C816.091 276.873 806.434 401.471 827.704 510.481C828.404 514.376 829.143 518.308 829.919 522.276C878.27 741.551 973.824 942.393 1032.77 1154.08C1034.32 1159.58 1035.83 1165.06 1037.31 1170.51C1087.48 1349.89 1102.42 1542.78 1041.55 1719.49C1039.15 1726.75 1036.69 1733.88 1034.1 1741.09C968.877 1918.6 851.483 2077.7 701.929 2192.04C694.428 2197.7 686.791 2203.26 679.114 2208.64C556.976 2293.47 396.662 2354.77 256.606 2300.95C247.183 2297.09 238.01 2292.63 229.189 2287.59C92.504 2203.03 59.0579 2019.7 38.9144 1861.88C37.5809 1850.06 36.3781 1838.27 35.2788 1826.36C17.591 1617.63 26.291 1402.43 90.6445 1203.38C95.0628 1190.26 99.8101 1177.22 104.865 1164.46C151.375 1049.82 231.689 924.826 353.798 904.791C367.157 903.423 380.556 904.084 393.433 907.044C506.987 943.862 552.593 1087.12 583.19 1203.54C586.689 1218.16 589.877 1232.82 592.799 1247.58C620.397 1389.72 624.514 1536.3 614.576 1680.94C613.38 1697.49 611.922 1714.01 610.191 1730.47C605.404 1774.94 599.106 1819.61 588.21 1862.28C586.318 1869.46 584.263 1876.55 581.854 1883.28C580.668 1886.58 579.329 1889.95 577.955 1892.68C577.301 1894 576.487 1895.33 576.17 1895.7C576.113 1895.78 576.076 1895.8 576.263 1895.62C576.357 1895.54 576.504 1895.41 576.731 1895.24C576.981 1895.06 577.43 1894.77 578.052 1894.5C578.976 1893.96 582.495 1893.28 585.048 1894.51C587.763 1895.77 588.353 1896.98 588.848 1897.65C588.131 1855.51 602.232 1791.15 614.064 1738.26C617.582 1722.96 621.264 1707.72 625.088 1692.5C654.165 1578.86 688.094 1465.77 729.519 1356.32C735.626 1340.51 742.001 1324.77 748.785 1309.52C760.876 1283.33 775.478 1250.89 794.168 1241.39C802.191 1236.38 816.681 1252.93 825.857 1268.78C851.708 1313.54 870.554 1364.53 892.632 1413.55C901.144 1432.32 909.487 1451.03 921.354 1469.17C926.85 1476.95 932.314 1485.08 943.454 1490.67C948.925 1493.39 956.986 1493.95 963.005 1491.41C969.076 1489.01 973.306 1485.14 976.786 1481.41C992.309 1463.12 999.594 1443.39 1008.1 1423.96C1024.11 1385.27 1037.77 1346.08 1052.09 1307.4C1059.56 1287.58 1066.92 1266.99 1076.31 1249.72C1076.37 1249.6 1076.38 1249.61 1076.29 1249.72C1076.19 1249.83 1075.93 1250.1 1075.52 1250.37C1074.64 1251.02 1072.88 1251.28 1072.28 1251.12C1071.62 1251.01 1071.8 1250.96 1072.16 1251.18C1072.53 1251.39 1073.11 1251.78 1073.75 1252.3C1076.35 1254.41 1079.31 1257.73 1082.13 1261.13C1087.82 1268.03 1093.34 1275.64 1099.09 1283.21C1110.37 1297.56 1120.74 1312.99 1139.26 1324.48C1143.83 1327.16 1150.15 1328.65 1155.96 1327.49C1161.83 1326.36 1166.11 1323.6 1169.69 1320.69C1176.58 1314.87 1180.99 1308.35 1185.04 1301.9C1192.97 1288.88 1198.77 1275.61 1204.29 1262.29C1215.19 1235.6 1224.28 1208.69 1233.87 1182.11C1238.89 1168.18 1244.05 1154.23 1249.63 1140.76C1256.31 1122.16 1284.33 1121.12 1309.1 1121.96C1334.62 1122.61 1361.21 1126.28 1389.61 1120.28C1399.71 1117.99 1410.17 1114 1419.17 1106.92C1434.32 1094.9 1441.67 1077.99 1447.25 1062.98C1448.86 1058.6 1450.34 1054.28 1451.83 1050.31C1453.2 1046.51 1455.21 1042.2 1455.84 1041.76C1455.99 1041.59 1456.08 1041.55 1455.9 1041.74C1455.71 1041.92 1455.27 1042.46 1453.78 1043.12C1452.35 1043.84 1449.24 1044.17 1447.19 1043.44C1446.67 1043.28 1446.21 1043.1 1445.8 1042.9C1445.43 1042.72 1445.14 1042.55 1444.87 1042.37C1444.61 1042.2 1444.38 1042.04 1444.2 1041.89C1444.05 1041.77 1443.92 1041.66 1443.82 1041.57C1443.39 1041.17 1443.36 1041.11 1443.38 1041.18C1443.4 1041.25 1443.52 1041.47 1443.65 1041.76C1443.77 1042.03 1443.94 1042.42 1444.1 1042.82C1444.25 1043.2 1444.42 1043.64 1444.6 1044.14C1445.94 1047.93 1447.14 1052.82 1448.19 1057.61C1450.29 1067.34 1451.99 1077.58 1453.58 1087.74C1456.76 1108.19 1459.52 1128.69 1462.65 1149.44C1463.91 1157.81 1465.14 1166.2 1466.38 1174.84C1492.4 1360.86 1514.74 1548.27 1519.11 1735.76C1519.3 1746.16 1519.41 1756.67 1519.43 1766.98C1518.57 1883.53 1512.33 2004.87 1464.63 2108.56C1459.71 2118.53 1454.22 2128.13 1448.07 2137C1436.28 2154.14 1420.15 2170 1404.97 2172.24C1390.89 2175.1 1377.22 2161.15 1368.84 2142.47C1363.6 2131.15 1359.85 2118.59 1356.95 2105.61C1332.45 1962.12 1357.73 1809.37 1389.26 1664.57C1392.7 1649.6 1396.31 1634.72 1400.12 1619.81C1445.37 1446.85 1509.65 1277.41 1594.78 1120.48C1603.11 1105.49 1611.67 1090.7 1620.62 1076.18C1648.64 1032.46 1681.94 979.908 1723.92 967.416C1736.32 964.957 1745.85 972.446 1752.99 986.862C1776.56 1045.81 1770.16 1120.63 1762.86 1188.44C1760.56 1206.83 1757.62 1225.18 1754.03 1243.28C1746.02 1283.17 1734.95 1322.56 1718.63 1358.92C1711.1 1375.35 1701.6 1393.08 1690.96 1402.5C1691.04 1402.45 1691.44 1402.1 1692.42 1401.72C1693.54 1401.24 1695.94 1400.86 1698.08 1401.49C1700.25 1402.07 1701.61 1403.32 1702.01 1403.76C1702.54 1404.33 1702.58 1404.51 1702.55 1404.44C1702.25 1403.99 1701.41 1401.37 1700.94 1398.8C1699.93 1393.5 1699.43 1387.14 1699.17 1380.94C1698.68 1368.29 1699.05 1355.47 1699.75 1342.46C1701.2 1316.61 1704.07 1290.47 1707.64 1264.54C1714.86 1212.59 1725.03 1160.95 1737.61 1109.91C1741.14 1095.62 1744.85 1081.47 1748.79 1067.25C1759.68 1028.61 1776.47 989.904 1803.23 962.882C1812.48 953.628 1824.71 946.091 1832.67 946.798C1874.83 949.255 1887.77 1009.64 1893.69 1056.24C1894.41 1061.71 1895.08 1067.23 1895.85 1072.86C1896.24 1075.69 1896.65 1078.5 1897.23 1081.65C1897.38 1082.44 1897.52 1083.14 1897.7 1083.97C1897.9 1084.86 1898.11 1085.73 1898.34 1086.58C1899.05 1088.57 1898.88 1090.24 1902.31 1094.77C1903.26 1095.87 1904.4 1096.98 1905.9 1097.97C1907.65 1099.14 1910.19 1100.23 1913.04 1100.38C1919.33 1100.64 1922.9 1097.37 1924.52 1095.89C1928.1 1092.24 1929.11 1089.82 1930.47 1087.28C1932.86 1082.44 1934.43 1078.01 1935.93 1073.65C1938.87 1064.98 1941.32 1056.42 1943.77 1048.03C1948.68 1031.27 1953.37 1014.5 1959.72 999.544C1962.3 993.512 1965.57 987.389 1968.46 984.418C1977.63 971.365 2002.36 988.516 2019.79 1005.49C2038.36 1023.01 2054.86 1043.13 2074.8 1062.31C2077.72 1065.05 2080.93 1067.92 2084.28 1070.55C2090.27 1075.53 2100.53 1079.62 2110.11 1077.31C2119.51 1075.14 2125.56 1069.9 2130.54 1064.95C2140.08 1055.02 2146.3 1044.25 2152.18 1033.62C2163.66 1012.3 2172.81 990.517 2182.04 969.085C2200.63 926.592 2217.55 881.808 2244.91 848.346C2246.42 846.59 2247.73 845.686 2248.59 845.342C2249.73 843.473 2259.25 848.519 2266.26 856.5C2273.64 864.304 2280.57 873.563 2287.61 882.912C2303.24 900.716 2310.66 924.668 2345.67 935.205C2359.39 937.072 2373.34 931.036 2382.38 923.244C2440.69 858.024 2447.53 778.965 2485.81 714.865C2487.06 712.674 2488.45 710.759 2489.71 709.5C2490.94 708.195 2492.02 707.874 2491.51 708.045C2491.28 708.104 2490.73 708.079 2490.5 707.994C2490.24 707.917 2490.32 707.893 2490.66 708.17C2491.34 708.688 2492.64 710.279 2493.74 712.261C2505.35 736.626 2504.27 772.584 2503.29 804.616C2502.78 817.15 2502.07 829.702 2501.37 842.341C2491.42 994.255 2464.34 1147.3 2409.89 1288.81C2405.8 1299.17 2401.53 1309.41 2397.09 1319.53C2353.37 1415.79 2286.24 1529.81 2207.51 1567.39C2206.67 1567.46 2206.51 1567.33 2206.75 1567.41C2206.99 1567.46 2207.44 1567.78 2207.37 1567.73C2207.25 1567.73 2205.77 1565.42 2204.94 1561.97C2197.79 1498.84 2227.79 1418.65 2254.58 1349.57C2259.47 1337.51 2264.6 1325.49 2269.92 1313.54C2327.26 1186.05 2401.78 1065.71 2483.03 950.981C2489.82 941.433 2496.63 932 2503.55 922.549C2528.59 888.351 2554.62 854.819 2581.73 822.444C2595.28 806.302 2609.06 790.458 2623.39 775.307C2630.53 767.777 2637.77 760.456 2645.09 753.846C2648.76 750.541 2652.49 747.409 2655.82 745.05C2656.71 744.42 2657.45 743.925 2658.16 743.493C2658.93 743.018 2659.47 742.735 2659.85 742.559C2660.15 742.397 2660.28 742.493 2658.96 742.763C2658.45 742.857 2656.97 743.072 2655.06 742.786C2653.27 742.586 2649.91 741.403 2647.65 739.383C2644.94 737.118 2643.7 734.212 2643.4 733.248C2642.98 731.978 2642.96 731.378 2642.93 731.214C2642.92 730.999 2642.93 731.129 2642.92 731.337C2642.91 731.551 2642.88 731.901 2642.82 732.357C2642.72 733.218 2642.55 734.263 2642.3 735.505C2642.08 736.598 2641.79 737.911 2641.45 739.249C2640.13 744.52 2638.39 750.058 2636.47 755.84C2605.96 840.577 2570.06 927.378 2544.64 1016.78C2540.98 1029.44 2537.47 1042.2 2534.12 1054.93C2500.17 1186.15 2478.37 1319.37 2465.35 1453.95C2464.31 1465.7 2463.38 1477.65 2462.77 1489.48C2462.53 1494.37 2462.34 1499.09 2462.3 1504.06C2462.28 1506.71 2462.28 1509.1 2462.43 1512.08C2462.53 1513.58 2462.55 1514.96 2463.03 1517.76C2463.1 1518.17 2463.19 1518.6 2463.3 1519.08C2463.36 1519.32 2463.42 1519.58 2463.5 1519.85C2463.53 1519.98 2463.57 1520.12 2463.62 1520.26C2463.64 1520.34 2463.66 1520.41 2463.68 1520.48C2463.72 1520.6 2463.77 1520.75 2463.81 1520.89C2464.22 1522.05 2464.69 1523.49 2466.22 1525.76C2466.62 1526.32 2467.09 1526.94 2467.69 1527.6C2468.01 1527.94 2468.29 1528.24 2468.74 1528.65C2469.45 1529.32 2470.32 1530.01 2471.36 1530.66C2475.37 1533.59 2483.53 1534.05 2487.71 1531.79C2488.79 1531.3 2489.71 1530.76 2490.48 1530.23C2490.67 1530.1 2490.88 1529.95 2491.02 1529.85C2491.11 1529.78 2491.19 1529.71 2491.28 1529.65C2491.45 1529.51 2491.61 1529.38 2491.77 1529.25C2492.39 1528.73 2492.9 1528.24 2493.34 1527.78C2494.2 1526.86 2494.78 1526.08 2495.23 1525.4C2496.1 1524.11 2496.66 1522.89 2496.8 1522.6C2497.24 1521.62 2497.52 1520.84 2497.77 1520.11C2501.42 1506.2",  // First stroke (e.g., First Name)
    ];

    /* -------------------------------------------------------------------------- */
    /*                                 Render                                     */
    /* -------------------------------------------------------------------------- */
    return (
        <div ref={rootRef} className={styles.root}>
            <NavBar />

            {/* ============ PINNED CINEMATIC STAGE ============ */}
            <section className={styles.stage} ref={stageRef} aria-label="Prashanta story">

                {/* ACT 1: Intro sequence */}
                <h1 className={styles.intro} aria-label={INTRO_LINE}>
                    <Words text={INTRO_LINE} wordClass={styles.introWord} />
                </h1>

                {/* ACT 2: Wordmark reveal */}
                <div className={styles.prashanta}>
                    <span className={styles.visuallyHidden}>Prashānta</span>

                    {/* Primary Lottie Container */}
                    <div ref={lottieContainerRef} className={styles.prashantaLottie} aria-hidden="true" />

                    {/* Fallback displayed if reduced motion is enabled or Lottie fails */}
                    <div
                        ref={fallbackRef}
                        className={styles.prashantaFallback}
                        aria-hidden="true"
                    >
                        <span>Prashānta</span>
                    </div>
                </div>

                {/* ACT 3: Video interaction */}
                <div className={styles.videoWrap} aria-hidden="true">
                    <video
                        ref={videoRef}
                        className={styles.video}
                        src={MORPH_VIDEO_SRC}
                        muted
                        playsInline
                        preload="auto"
                    />
                </div>
            </section>

            {/* ============ NATURAL SCROLL RESUMES ============ */}
            <section className={styles.after}>
                {/* STATIC QUOTE: Restores standard flow */}
                <div className={styles.quotesection}>
                    <p className={styles.quote} aria-label={QUOTE_LINE}>
                        {QUOTE_LINE}
                    </p>
                    <span className={styles.by}>
                        ~ Lord Mahavira
                    </span>
                </div>

                <img style={{ userSelect: 'none', pointerEvents: 'none' }} src={"/assets/prashanta/bowl.webp"} />
                <div className={styles.lineargallery}>
                    <img style={{ userSelect: 'none', pointerEvents: 'none' }} src={"/assets/prashanta/one-set.webp"} />
                    <img style={{ userSelect: 'none', pointerEvents: 'none' }} src={"/assets/prashanta/set.webp"} />
                    <img style={{ userSelect: 'none', pointerEvents: 'none' }} src={"/assets/prashanta/two-set.webp"} />
                </div>

                <div
                    style={{
                        userSelect: 'none',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '10rem',
                    }}
                >
                    <AnimatedSignature
                        className="flex flex-col justify-center items-center w-40"
                        paths={signaturePaths} // Passing the array here
                        viewBox="0 0 2680 2353" // Adjust to match your SVG's original viewBox
                        strokeColor="#000" // Sky blue stroke
                        fillColor="none"
                        strokeWidth={40}
                        duration={1.5} // Each line takes 1.5s to draw
                        staggerDelay={0.4} // Wait 0.4s between starting each line
                    />
                </div>
            </section>
        </div>
    )
}

