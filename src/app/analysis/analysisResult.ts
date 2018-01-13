import {AnalysisObstacle} from './analysisObstacle';

export class AnalysisResult {
  id: number;
  obstacleId: number;
  obstacle: boolean;
  keep: boolean;
  reason: string;
  reasonDetail: string;
  reasonId: number;

  initialize(obstacle: AnalysisObstacle): AnalysisResult {
    this.obstacleId = obstacle.id;
    this.obstacle = obstacle.penetration > 0;
    this.keep = !this.obstacle;
    return this;
  }
}
