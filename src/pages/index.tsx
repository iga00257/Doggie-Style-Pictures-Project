import { GetServerSideProps } from "next";
import Home from "@/components/pages/Home";

interface Breed {
  name: string;
  subBreeds: string[];
}

interface HomeProps {
  initialBreeds: Breed[];
}

export default function HomePage({ initialBreeds }: HomeProps) {
  return <Home breeds={initialBreeds} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await response.json();
    const breeds = Object.entries(data.message).map(([name, subBreeds]) => ({
      name,
      subBreeds: subBreeds as string[],
    }));
    return {
      props: {
        initialBreeds: breeds,
      },
    };
  } catch (error) {
    console.error("Error fetching breeds:", error);
    return {
      props: {
        initialBreeds: [],
      },
    };
  }
};
