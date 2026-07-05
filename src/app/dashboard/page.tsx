// FILE: src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Integration, MetricSeries, AlertRule, AlertLog } from '@/lib/types';
import { z } from 'zod';
import { HelpCircle } from 'lucide-react';

const integrationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum(['AWS', 'GCP', 'Azure', 'On-Premises']),
  status: z.enum(['connected', 'disconnected']),
  createdAt: z.number(),
  updatedAt: z.number(),
});

const metricSeriesSchema = z.object({
  id: z.string(),
  integrationId: z.string(),
  metricName: z.enum(['cpu', 'memory', 'disk']),
  dataPoints: z.array(
    z.object({
      timestamp: z.number(),
      value: z.number().min(0).max(100),
    })
  ),
  createdAt: z.number(),
  updatedAt: z.number(),
});

const alertRuleSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  metricName: z.enum(['cpu', 'memory', 'disk']),
  operator: z.enum(['GT', 'LT']),
  threshold: z.number(),
  channel: z.enum(['WhatsApp', 'Email', 'Webhook']),
  recipient: z.string().min(1),
  active: z.boolean(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

const alertLogSchema = z.object({
  id: z.string(),
  ruleId: z.string(),
  message: z.string().min(1),
  triggeredAt: z.number(),
});

const DashboardPage = () => {
  const [state, dispatch] = useStore();
  const [search, setSearch] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredIntegrations = state.integrations.filter((integration) =>
    integration.name.toLowerCase().includes(search)
  );

  const handleAddIntegration = (integration: Integration) => {
    integrationSchema.parse(integration);
    dispatch({ type: 'ADD_ENTITY', entity: 'integrations', data: integration });
  };

  const handleUpdateIntegration = (integration: Integration) => {
    integrationSchema.parse(integration);
    dispatch({ type: 'UPDATE_ENTITY', entity: 'integrations', data: integration });
  };

  const handleDeleteIntegration = (id: string) => {
    dispatch({ type: 'DELETE_ENTITY', entity: 'integrations', id });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text)]">
      <header className="p-4 border-b border-[var(--border)]">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <input
          type="text"
          placeholder="Search integrations..."
          value={search}
          onChange={handleSearchChange}
          className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none mt-2"
        />
      </header>
      <main className="p-4">
        <section className="mb-4">
          <h2 className="text-xl font-bold mb-2">Integrations</h2>
          <button
            onClick={() => handleAddIntegration({
              id: Date.now().toString(),
              name: 'New Integration',
              type: 'AWS',
              status: 'connected',
              createdAt: Date.now(),
              updatedAt: Date.now(),
            })}
            className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--hover)]"
          >
            Add Integration
          </button>
          <ul className="mt-2">
            {filteredIntegrations.map((integration) => (
              <li key={integration.id} className="flex justify-between items-center p-2 border-b border-[var(--border)] last:border-b-0">
                <span>{integration.name}</span>
                <div>
                  <button
                    onClick={() => handleUpdateIntegration({
                      ...integration,
                      name: `${integration.name} (updated)`,
                      updatedAt: Date.now(),
                    })}
                    className="rounded-md border border-[var(--border)] px-4 py-2 text-sm text-[var(--body)]"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteIntegration(integration.id)}
                    className="rounded-md bg-[#ef4444] px-4 py-2 text-sm font-medium text-white"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Metrics</h2>
          <ul>
            {state.metrics.map((metric) => (
              <li key={metric.id} className="p-2 border-b border-[var(--border)] last:border-b-0">
                <span>{metric.metricName}: {metric.dataPoints.length} data points</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Alert Rules</h2>
          <ul>
            {state.rules.map((rule) => (
              <li key={rule.id} className="p-2 border-b border-[var(--border)] last:border-b-0">
                <span>{rule.name}: {rule.threshold}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Alert Logs</h2>
          <ul>
            {state.logs.map((log) => (
              <li key={log.id} className="p-2 border-b border-[var(--border)] last:border-b-0">
                <span>{log.message} at {new Date(log.triggeredAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="p-4 border-t border-[var(--border)]">
        <details className="inline-block">
          <summary className="cursor-pointer flex items-center">
            <HelpCircle className="mr-1" /> Help
          </summary>
          <div className="mt-2">
            <p>Need assistance? Contact support.</p>
          </div>
        </details>
      </footer>
    </div>
  );
};

export default DashboardPage;