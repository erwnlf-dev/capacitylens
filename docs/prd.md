# CapacityLens Product Requirements Document (PRD) & System Design

## 1. Product Overview
CapacityLens is a lightweight capacity monitoring and forecasting SaaS tailored for Indonesian SMB hybrid clouds and regulated financial services. It provides localized compliance, an Indonesian UI, resource forecasting, and automated alerting, avoiding the high cost and complexity of enterprise observability suites.

---

## 2. Core Functional Requirements
1. **Infrastructure Integration Management**: Connect, edit, and delete AWS, GCP, Azure, or on-premise integrations.
2. **Resource Forecasting**: Perform simple linear regression on metrics to predict when CPU, Memory, or Disk will breach thresholds.
3. **Indonesian Alerting & Notification**: Configure alert rules (CPU, RAM, Disk) to trigger alerts via WhatsApp or webhook in Indonesian.
4. **CSV Capacity Data Import**: Import historical usage metrics via CSV file upload to populate dashboards immediately.
5. **Data Export/Import**: Export the entire dashboard configuration and capacity state to a JSON file, or import to restore.

---

## 3. Data Model & Persistence
State is persisted in `localStorage` using JSON serialization under keys prefixed with `app_`.

```typescript
// src/lib/types.ts

export interface Integration {
  id: string;
  name: string;
  type: 'AWS' | 'GCP' | 'Azure' | 'On-Premises';
  status: 'connected' | 'disconnected';
  createdAt: number;
  updatedAt: number;
}

export interface MetricPoint {
  timestamp: number;
  value: number; // 0 to 100
}

export interface MetricSeries {
  id: string;
  integrationId: string;
  metricName: 'cpu' | 'memory' | 'disk';
  dataPoints: MetricPoint[];
  createdAt: number;
  updatedAt: number;
}

export interface AlertRule {
  id: string;
  name: string;
  metricName: 'cpu' | 'memory' | 'disk';
  operator: 'GT' | 'LT';
  threshold: number;
  channel: 'WhatsApp' | 'Email' | 'Webhook';
  recipient: string;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AlertLog {
  id: string;
  ruleId: string;
  message: string;
  triggeredAt: number;
}

export interface AppState {
  integrations: Integration[];
  metrics: MetricSeries[];
  rules: AlertRule[];
  logs: AlertLog[];
}
```

### Storage Keys
* `app_integrations`
* `app_metrics`
* `app_rules`
* `app_logs`

---

## 4. OpenAPI 3.0 REST API Specification
```yaml
openapi: 3.0.3
info:
  title: CapacityLens API
  version: 1.0.0
  description: Minimal API for managing integrations and metrics.
paths:
  /api/v1/integrations:
    get:
      summary: List integrations
      security:
        - ApiKeyAuth: []
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Integration'
    post:
      summary: Create integration
      security:
        - ApiKeyAuth: []
      requestBody:
        required: true
        content