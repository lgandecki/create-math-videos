import { BusSliceAPI, BusWrapper, createBusWrapper } from "@/core/busWrapper.ts";

export type Cube = {
  side: number;
  density: number;
  units: string;
  cubeType: "steel" | "styrofoam";
  tolerance: number;
};

class CubesDensityAPI implements BusSliceAPI {
  commands: {
    reset: {};
    setCube: Cube;
  };
  responses: {
    completed: { isCorrect: boolean; studentAnswer: number };
  };
}

export const cubesDensityApi = createBusWrapper(
  ["reset", "setCube"],
  ["completed"],
  "cubesDensity"
) as BusWrapper<CubesDensityAPI>;

export type CubesDensityApi = typeof cubesDensityApi;
