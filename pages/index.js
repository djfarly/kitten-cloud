import Image from "next/image";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";

export default function HomePage() {
  const [kittens, setKittens] = useLocalStorageState("kittens", {
    defaultValue: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const newImage = await response.json();
        event.target.reset();
        setKittens([
          ...kittens,
          { id: newImage.id, image: newImage, name: data.name },
        ]);
      } else {
        const { error } = await response.json();
        throw new Error(error);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <h1>
        Kitten Cloud aka. Catatouille 👨‍🍳😻
        <span style={{ position: "relative", top: "-0.5em", left: "-1em" }}>
          ☁️
        </span>
      </h1>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={isSubmitting}>
          <legend>Your kitten</legend>
          <div>
            <label htmlFor="image-upload">Kittenpic</label>
            <input type="file" name="image" id="image-upload" required />
          </div>
          <div>
            <label htmlFor="name-input">Name</label>
            <input type="text" name="name" id="name-input" required />
          </div>
        </fieldset>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Uploading kitten…" : "Upload kitten"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <section>
        <h2>Your kittens</h2>
        {kittens.length > 0 ? (
          kittens.map(({ id, image, name }) => (
            <div key={id}>
              <h3>{name} 🐱</h3>
              <Image
                src={image.src}
                width={image.width}
                height={image.height}
                alt={`a super cute photo of ${name}`}
              />
            </div>
          ))
        ) : (
          <p>No kittens uploaded yet 😿</p>
        )}
      </section>
    </main>
  );
}
