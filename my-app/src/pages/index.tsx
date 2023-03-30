import Head from 'next/head'
import styles from '@src/styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>Tender Hack</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
          hello world
      </main>
    </>
  )
}
