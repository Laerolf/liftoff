/**
 * Represents a status of Mission.
 */
export enum MissionStatus {
  /**
   * The Mission is about to be launched.
   */
  Launching = 'LAUNCHING',
  /**
   * The Mission is in-orbit.
   */
  InOrbit = 'IN-ORBIT',
  /**
   * The Mission has landed.
   */
  Landed = 'LANDED',
  /**
   * The Mission was aborted.
   */
  Aborted = 'ABORTED'
}

/**
 * Represents a status of a Phase.
 */
export enum PhaseStatus {
  /**
   * The Phase is waiting to be run.
   */
  Waiting = 'WAITING',
  /**
   * The Phase is running.
   */
  Running = 'RUNNING',
  /**
   * The Phase has been comppleted.
   */
  Completed = 'COMPLETED',
  /**
   * The Phase has failed.
   */
  Failed = 'FAILED',
  /**
   * The Phase was skipped.
   */
  Skipped = 'SKIPPED'
}
