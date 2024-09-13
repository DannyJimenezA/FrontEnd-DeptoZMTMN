
import Slider from 'react-slick';
import '../styles/Banner.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Importa las imágenes desde la carpeta img
import image1 from '../img/ZMT1.jpg';
import image2 from '../img/ZMT2.jpg';
import image3 from '../img/ZMT3.jpg';

function Banner () {
  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="banner">
      <Slider {...settings}>
        <div>
          <img src={image1} alt="Imagen 1" className="banner-image" />
        </div>
        <div>
          <img src={image2} alt="Imagen 2" className="banner-image" />
        </div>
        <div>
          <img src={image3} alt="Imagen 3" className="banner-image" />
        </div>
      </Slider>
      <h1/>

      <h2> La Zona Marítimo Terrestre es la franja territorial de doscientos metros de ancho a 
        todo lo largo de los litorales Atlántico y Pacífico de la República, cualquiera que sea 
        su naturaleza, medidos horizontalmente a partir de la línea de la pleamar ordinaria, 
        los terrenos y rocas que deje el mar en descubierto en la marea baja. </h2>
      <h1/>
        <h2> Esta zona marítima se extiende también por las márgenes de los ríos hasta el sitio 
          en que sean navegables o se hagan sensibles las mareas, con un ancho de doscientos metros 
          desde cada orilla, contados desde la línea que marque la marea alta. Su uso y aprovechamiento 
          se encuentra regulado por la Ley No. 6043.   </h2>
    </div>
  );
};

export default Banner;
