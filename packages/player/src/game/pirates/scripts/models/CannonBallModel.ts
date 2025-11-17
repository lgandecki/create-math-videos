export class CannonBallModel {
  public lifeTime: number = 0;
  public path: Phaser.Math.Vector2[] = [];
  public isDone: boolean = false;
  public progress: number = 0;
  public willHit: boolean = false;

  constructor(lifeTime: number, willHit: boolean, path: Phaser.Math.Vector2[]) {
    this.lifeTime = lifeTime;
    this.path = path;
    this.willHit = willHit;
  }

  public getCurrentPosition = (speed: number): Phaser.Math.Vector2 => {
    const distance = this.lifeTime * speed;
    const pathLength = this.path.length;

    if (pathLength < 2) {
      return this.path[0] || new Phaser.Math.Vector2(0, 0);
    }

    let accumulatedDistance = 0;
    for (let i = 1; i < pathLength; i++) {
      const prevPoint = this.path[i - 1];
      const currentPoint = this.path[i];
      const segmentDistance = Phaser.Math.Distance.Between(prevPoint.x, prevPoint.y, currentPoint.x, currentPoint.y);

      if (accumulatedDistance + segmentDistance >= distance) {
        const remainingDistance = distance - accumulatedDistance;
        const t = remainingDistance / segmentDistance;
        return new Phaser.Math.Vector2(
          Phaser.Math.Linear(prevPoint.x, currentPoint.x, t),
          Phaser.Math.Linear(prevPoint.y, currentPoint.y, t)
        );
      }

      accumulatedDistance += segmentDistance;
      this.progress = accumulatedDistance / distance;
    }

    if (pathLength == this.path.length) {
      this.isDone = true;
    }

    return this.path[pathLength - 1];
  };
}
