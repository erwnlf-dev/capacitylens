// FILE: src/lib/types.ts
'use client';

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
  value: number;
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

// ponytail: no validation schemas defined here. Add when input forms need real-time validation.