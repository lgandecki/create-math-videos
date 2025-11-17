import { BusSliceAPI, BusWrapper, createBusWrapper } from "@/core/busWrapper";

class EarthquakeAPI implements BusSliceAPI {
  commands: {
    setMagnitude: { value: number };
  };
  responses: {};
}

export const EarthquakeApi = createBusWrapper(["setMagnitude"], [], "Earthquake") as BusWrapper<EarthquakeAPI>;
