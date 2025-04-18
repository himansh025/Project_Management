import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ui from '../assets/ui.jpg';
import mobile from '../assets/app.jpg';
import web from '../assets/web.jpg';
import system from '../assets/system.jpg';

function ImageSlider() {
  const slides = [
    {
      img: ui,
      name: "UI/UX Design",
      des: "Creative and User-Centric Interface Designs",
    },
    {
      img: mobile,
      name: "Mobile App Development",
      des: "Native and Cross-platform Mobile Applications",
    },
    {
      img: web,
      name: "Web Designing",
      des: "Responsive Web Design and Development",
    },
    {
      img: system,
      name: "System Design",
      des: "Scalable and Efficient System Architectures",
    },
    {
      img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      name: "Full-Stack Engineering",
      des: "End-to-End Application Development",
    }
  ];

  return (
    <div className="w-full border-zinc-100 border-2 mb-1 h-[400px]">
      <Carousel fade indicators controls interval={2000} color="black" >
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <img
              src={slide.img}
              alt={slide.name}
              className="object-cover w-full h-[400px] p-1"
            />
            <Carousel.Caption className="bg-black bg-opacity-50 rounded p-3">
              <h3 className="text-white text-lg">{slide.name}</h3>
              <p className="text-white text-sm">{slide.des}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider
