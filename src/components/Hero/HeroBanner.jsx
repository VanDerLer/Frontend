import React from "react";
import "../../styles/Hero/HeroBanner.css";

import FoxHero from "../../assets/svg/fox.svg";

export default function HeroBanner() {
  return (
    <section className="hero">
      <div className="hero-card">
        {/* Lado esquerdo - raposinha */}
        <div className="hero-image-wrapper">
          <img
            src={FoxHero}
            alt="Raposa lendo um livro"
            className="hero-image"
          />
        </div>

        {/* Lado direito - textos */}
        <div className="hero-text-wrapper">
          <h1 className="hero-title">
            O Poder das Palavras
            <br />
            em Suas Mãos
          </h1>

          <p className="hero-subtitle">
            Explore livros que não apenas contam histórias, mas que te ajudam a
            crescer, refletir e viver de maneira mais intensa.
          </p>
        </div>
      </div>
    </section>
  );
}
