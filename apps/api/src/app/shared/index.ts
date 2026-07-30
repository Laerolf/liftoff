import { MissionRepository, MissionPhaseRepository } from '@/app/missions/repository'
import { MissionCommandService, MissionQueryService } from '@/app/missions/service'
import { PhaseRepository, PhaseStepRepository } from '@/app/phases/repository'
import { PhaseCommandService, PhaseQueryService } from '@/app/phases/service'
import { StepRepository } from '@/app/steps/repository'
import { StepCommandService, StepQueryService } from '@/app/steps/service'

/**
 * Represent the request context.
 */
export class RequestContext {
  readonly stepQueryService: StepQueryService
  readonly stepCommandService: StepCommandService

  readonly phaseQueryService: PhaseQueryService
  readonly phaseCommandService: PhaseCommandService

  readonly missionQueryService: MissionQueryService
  readonly missionCommandService: MissionCommandService

  /**
   * Creates a new {@link RequestContext}.
   * @param stepQueryService - The {@link StepQueryService} to use.
   * @param stepCommandService - The {@link StepCommandService} to use.
   * @param phaseQueryService - The {@link PhaseQueryService} to use.
   * @param phaseCommandService - The {@link PhaseCommandService} to use.
   * @param missionQueryService - The {@link MissionQueryService} to use.
   * @param missionCommandService - The {@link MissionCommandService} to use.
   */
  private constructor(
    stepQueryService: StepQueryService,
    stepCommandService: StepCommandService,
    phaseQueryService: PhaseQueryService,
    phaseCommandService: PhaseCommandService,
    missionQueryService: MissionQueryService,
    missionCommandService: MissionCommandService
  ) {
    this.stepQueryService = stepQueryService
    this.stepCommandService = stepCommandService
    this.phaseQueryService = phaseQueryService
    this.phaseCommandService = phaseCommandService
    this.missionQueryService = missionQueryService
    this.missionCommandService = missionCommandService
  }

  /**
   * Creates a new {@link RequestContext} with default instances.
   */
  static default(): RequestContext {
    const stepRepository = new StepRepository()
    const stepQueryService = new StepQueryService(stepRepository)
    const stepCommandService = new StepCommandService(stepRepository, stepQueryService)

    const phaseRepository = new PhaseRepository()
    const phaseStepRepository = new PhaseStepRepository()
    const phaseQueryService = new PhaseQueryService(phaseRepository)
    const phaseCommandService = new PhaseCommandService(
      phaseRepository,
      phaseStepRepository,
      phaseQueryService,
      stepCommandService
    )

    const missionRepository = new MissionRepository()
    const missionPhaseRepository = new MissionPhaseRepository()
    const missionQueryService = new MissionQueryService(missionRepository)
    const missionCommandService = new MissionCommandService(
      missionRepository,
      missionPhaseRepository,
      missionQueryService,
      phaseCommandService
    )

    return new RequestContext(
      stepQueryService,
      stepCommandService,
      phaseQueryService,
      phaseCommandService,
      missionQueryService,
      missionCommandService
    )
  }
}
