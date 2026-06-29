# liftoff/domain

The domain model of Liftoff.

## Models

```mermaid
erDiagram
    Mission {
        string id
        string correlationId
        string workflowBranch
        string environment
        string services
        string director
        MissionStatus status
        Date launchedAt
    }

    Phase {
        PhaseStatus status
        PhaseExecution execution
    }

    Step {
        string repository
        string workflowId
        string[] workflowInputs
        string workflowOutcome
    }

    Mission ||--o{ Phase : " "
    Phase ||--o{ Step : " "
```
