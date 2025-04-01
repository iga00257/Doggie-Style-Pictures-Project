import BreedImages from "@/components/pages/BreedImages";
import { GetServerSideProps } from "next";

interface BreedImagesProps {
  imagesFromServer: string[];
}

export default function BreedImagesPage({
  imagesFromServer,
}: BreedImagesProps) {
  return <BreedImages imagesFromServer={imagesFromServer} />;
}
const fetchImages = async (breedName: string) => {
  if (!breedName) return;

  try {
    const response = await fetch(
      `https://dog.ceo/api/breed/${breedName}/images/random/10000`
    );
    const data = await response.json();
    if (data.status === "success") {
      return data.message;
    } else {
      console.error("Error fetching images:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      imagesFromServer: await fetchImages(query.id as string),
    },
  };
};
