import { BusSliceAPI, BusWrapper, createBusWrapper } from "@/core/busWrapper.ts";

class ChatActionsAPI implements BusSliceAPI {
  commands: {
    restartExercise: undefined;
    goOn: undefined;
    explain: undefined;
  };
  responses: {};
}

export const chatActionsApi = createBusWrapper(
  ["restartExercise", "goOn", "explain"],
  [],
  "chatActions"
) as BusWrapper<ChatActionsAPI>;
