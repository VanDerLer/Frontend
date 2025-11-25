// src/pages/Home/Home.jsx
import HeroBanner from "../../components/Hero/HeroBanner";
import BookCard from "../../components/BookCard/BookCard";
import BooksShowcase from "../../components/BookShowCase/BookShowCase";
const mockBooks = [
  {
    id: 1,
    title: "A Hipótese do Amor",
    author: "Autor A",
    cover: "/covers/hipotese.jpg",
  },
  {
    id: 2,
    title: "Como eu era antes de você",
    author: "Jojo Moyes",
    cover: "/covers/como-era.jpg",
  },
];

export default function Home() {
  return (
    <>
      <HeroBanner />
      <BooksShowcase />
    </>
  );
}
