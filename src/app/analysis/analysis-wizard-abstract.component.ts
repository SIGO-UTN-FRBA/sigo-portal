import {UiError} from '../main/uiError';
import {ROLE_READONLY, ROLE_WORKER} from '../auth/role';
import {Analysis} from './analysis';
import {AppError} from '../main/ierror';
import {ApiError} from '../main/apiError';
import {AnalysisService} from './analysis.service';
import {AnalysisWizardService} from './analysis-wizard.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {STATUS_INDICATOR} from '../commons/status-indicator';

export abstract class AbstractAnalysisWizardComponent {
  indicator;
  analysis:Analysis;
  analysisId:number;
  allowEdit: boolean;
  onSubmitError:AppError;
  onInitError: ApiError;

  constructor(
    protected analysisService: AnalysisService,
    protected wizardService: AnalysisWizardService,
    protected authService: AuthService,
    protected route: ActivatedRoute,
    protected router: Router
  ){
    this.indicator = STATUS_INDICATOR;
  }

  protected resolveAnalysis() : Promise<any> {
    return this.analysisService
      .get(this.analysisId)
      .then(data => this.analysis = data)
  }

  protected resolveEdition() {
    this.allowEdit = !([ROLE_WORKER, ROLE_READONLY].includes(this.authService.getUserRole()))
      || (this.authService.getUserRole() == ROLE_WORKER && this.analysis.userId == this.authService.getUserId());
  }

  protected validateCurrentStage(): Promise<any> {
    return (this.analysis.stageId != this.stageId()) ?
      Promise.reject(new UiError("You try to access invalid stage view for this analysis.", "Error"))
      :
      Promise.resolve();
  }

  abstract stageId(): number;
}
