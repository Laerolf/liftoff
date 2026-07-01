# liftoff/domain

The domain model of Liftoff.

## Models

```mermaid
erDiagram
    FlightPlan {
        string id
        string name
        string workflowBranch
        string environment
        string[] services
        map exposedWorkflowInputs
    }

    Mission {
        string id
        string correlationId
        string workflowBranch
        string environment
        string[] services
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
        map workflowInputs
        string workflowOutcome
    }

    FlightPlan ||--o{ Mission : " "
    Mission ||--o{ Phase : " "
    Phase ||--o{ Step : " "
```
