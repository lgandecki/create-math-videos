import { useDinoStore } from "@/stores/dinoStore";

const Dino = () => {
  const { dinoScale } = useDinoStore();

  return (
    <div id="dino" className="flex items-center justify-center z-[1]" style={{ display: "none" }}>
      {dinoScale >= 9 ? (
        <img
          className="w-full h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `scale(${dinoScale ? dinoScale / 6 : 0})` }}
          src="/explode.png"
          alt="dino-exploded"
        />
      ) : (
        <img
          //TODO: Fix the styles for dino
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: `scale(${dinoScale ? dinoScale / 3 : 0})` }}
          src="/dino.png"
          alt="dino"
        />
      )}
    </div>
  );
};

export default Dino;
