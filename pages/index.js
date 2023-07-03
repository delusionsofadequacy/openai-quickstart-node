import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [plantInput, setplantInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    console.log("button clicked");
    try {
      console.log("trying to fetch " + plantInput)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plant: plantInput }),
      });
      
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setplantInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.log("ERROR! oops!")
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Advice for plants</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="plant"
            placeholder="Enter a plant"
            value={plantInput}
            onChange={(e) => setplantInput(e.target.value)}
          />
          <input type="submit" value="Generate advice" />
        </form>
        {/* <div className={styles.result}>{result}</div> */}
        
        {result&&(<div className={styles.result}>
          <h3>Name: {result.plantName||""}</h3>
          <p>Description: {result.plantDescription||""}</p>
          <p>Care: {result.plantCare||""}</p>
          <p>Coldest survivable temperature: {result.plantColdestTemp||""}</p>
          </div>)
          }
      </main>
    </div>
  );
}
