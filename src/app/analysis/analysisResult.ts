import {AnalysisObstacle} from './analysisObstacle';
import {AnalysisMitigation} from './analysisMitigation';
import {AnalysisAspect} from './analysisAspect';

export class AnalysisResult {
  id: number;
  obstacleId: number;
  hasAdverseEffect: boolean;
  allowed: boolean;
  aspectId: number;
  aspect: AnalysisAspect;
  mitigationMeasuresIds: number[];
  mitigationMeasures: AnalysisMitigation[];
  extraDetail: string;

  initialize(obstacle: AnalysisObstacle): AnalysisResult {
    this.obstacleId = obstacle.id;
    this.hasAdverseEffect = obstacle.penetration > 0;
    return this;
  }
}
