import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>
        Custom Free Mind For Notion
      </h1>

      <div className={styles.description}>
        <h2>
          example:
        </h2>
        <Image
              src="/demo.jpg"
              alt="demo"
              width={300}
              height={224}
              priority
            />
      </div>

      <div>
        <h2>
          fast Deploy on vercel:
        </h2>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTheOne1006%2Fnotion-mind&env=NOTION_TOKEN&env=CACHE_FILE_DIR&env=CACHE_FILE_DIVISION&env=CACHE_DURATION&project-name=notion-mind&repository-name=notion-mind">
          <img src={"https://vercel.com/button"} alt="button" />
        </a>
      </div>

      <div>
        <h2>
          How to use:
        </h2>
        <p>
          1. select page to you integrations
        </p>
        <p>
          2. copy page id
        </p>
        <p>
              3. create link
        </p>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={280}
          height={100}
          priority
        />
      </div>
    </main>
  );
}
