import { Player } from "@/game/pirates/scripts/models/Player.ts";
import { Enemy } from "@/game/pirates/scripts/models/Enemy.ts";
import { Lesson } from "@/stores/lessonsStore.ts";

export class GameState {
  private player: Player;
  private enemy: Enemy;
  private lesson: Lesson;
}
