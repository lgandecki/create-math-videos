import { motion } from "motion/react";
import { type DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";

import { useRobotAnimationContext } from "@/hooks/useRobotAnimationContext";

interface RobotAnimationProps {
  className?: string;
  showSlideRule?: boolean;
}

const RobotAnimation: React.FC<RobotAnimationProps> = ({ showSlideRule = false, className }) => {
  const { setDotLottie } = useRobotAnimationContext();

  const handleDotLottieCallback = (dotLottie: DotLottie | null) => {
    console.log("🤖 RobotAnimation: DotLottie instance received:", dotLottie);
    setDotLottie(dotLottie);
  };

  const handleDotLottieError = (event: React.SyntheticEvent<HTMLCanvasElement, Event>) => {
    console.error("🤖 RobotAnimation: Lottie component error:", event);
  };

  return (
    <motion.div
      className={`absolute flex items-center justify-center ${className ?? ""}`}
      initial={{
        opacity: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 0,
      }}
      animate={{
        opacity: 1,
        top: showSlideRule ? 4 : 0,
        left: showSlideRule ? 4 : 0,
        bottom: showSlideRule ? "auto" : 0,
        right: showSlideRule ? "auto" : 0,
        width: showSlideRule ? "auto" : "",
        height: showSlideRule ? "auto" : "",
        zIndex: showSlideRule ? 10 : 0,
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          width: showSlideRule ? "" : 384,
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
      >
        <DotLottieReact
          src="robot.lottie"
          dotLottieRefCallback={handleDotLottieCallback}
          onError={handleDotLottieError}
        />
      </motion.div>
    </motion.div>
  );
};

export default RobotAnimation;
