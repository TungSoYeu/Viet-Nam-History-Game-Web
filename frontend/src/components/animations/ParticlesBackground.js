import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = ({ type = "dust" }) => {
  const [init, setInit] = useState(false);

  // Chỉ khởi tạo engine một lần duy nhất
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const dustOptions = {
    background: { color: "transparent" },
    fpsLimit: 120,
    particles: {
      color: { value: "#FFD700" }, // Màu vàng Gold
      move: {
        enable: true,
        speed: { min: 0.1, max: 0.5 },
        direction: "top", // Bay lên nhẹ nhàng
        outModes: { default: "out" },
      },
      number: { density: { enable: true }, value: 80 },
      opacity: { value: { min: 0.1, max: 0.5 } },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
  };

  const embersOptions = {
    background: { color: "transparent" },
    particles: {
      color: { value: ["#ff4d00", "#ffae00", "#ff0000"] }, // Tông đỏ cam của lửa
      move: {
        enable: true,
        speed: { min: 1, max: 3 },
        direction: "top",
        outModes: { default: "out" },
      },
      number: { value: 50 },
      opacity: { value: { min: 0.3, max: 0.8 } },
      size: { value: { min: 1, max: 4 } },
      wobble: { enable: true, distance: 10, speed: 10 }, // Hiệu ứng lảo đảo
    },
  };

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={type === "dust" ? dustOptions : embersOptions}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1, // Luôn nằm dưới nội dung
        }}
      />
    );
  }

  return null;
};

export default ParticlesBackground;
