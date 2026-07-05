// FILE: src/lib/store.tsx
'use client';
import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Integration, MetricSeries, AlertRule, AlertLog, AppState } from './types';

type State = AppState & { loaded: boolean; toast: { message: string; type: string } | null };
type Action =
  | { type: 'SEED'; payload: AppState }
  | { type: 'ADD_ENTITY'; entity: keyof AppState; data: Integration | MetricSeries | AlertRule | AlertLog }
  | { type: 'UPDATE_ENTITY'; entity: keyof AppState; data: Integration | MetricSeries | AlertRule | AlertLog }
  | { type: 'DELETE_ENTITY'; entity: keyof AppState; id: string }
  | { type: 'TOAST'; message: string; toastType: string }
  | { type: 'DISMISS_TOAST' };

const STORAGE_KEYS = {
  integrations: 'app_integrations',
  metrics: 'app_metrics',
  rules: 'app_rules',
  logs: 'app_logs',
};

function generateSeed(): AppState {
  const now = Date.now();
  const day = 86400000;
  const integrations: Integration[] = Array.from({ length: 10 }, (_, i) => ({
    id: `int-${i}`,
    name: `Integration ${i + 1}`,
    type: (['AWS', 'GCP', 'Azure', 'On-Premises'] as const)[i % 4],
    status: i % 3 === 0 ? 'disconnected' : 'connected',
    createdAt: now - Math.floor(Math.random() * 30) * day,
    updatedAt: now - Math.floor(Math.random() * 30) * day,
  }));

  const metrics: MetricSeries[] = [];
  for (const int of integrations) {
    for (const metricName of ['cpu', 'memory', 'disk'] as const) {
      const points = Array.from({ length: 30 }, (_, j) => ({
        timestamp: now - (29 - j) * day,
        value: Math.floor(Math.random() * 80) + 10,
      }));
      metrics.push({
        id: `met-${int.id}-${metricName}`,
        integrationId: int.id,
        metricName,
        dataPoints: points,
        createdAt: int.createdAt,
        updatedAt: int.updatedAt,
      });
    }
  }

  const rules: AlertRule[] = Array.from({ length: 8 }, (_, i) => ({
    id: `rule-${i}`,
    name: `Rule ${i + 1}`,
    metricName: (['cpu', 'memory', 'disk'] as const)[i % 3],
    operator: i % 2 === 0 ? 'GT' : 'LT',
    threshold: 70 + Math.floor(Math.random() * 20),
    channel: (['WhatsApp', 'Email', 'Webhook'] as const)[i % 3],
    recipient: `user${i}@example.com`,
    active: i % 4 !== 0,
    createdAt: now - Math.floor(Math.random() * 30) * day,
    updatedAt: now - Math.floor(Math.random() * 30) * day,
  }));

  const logs: AlertLog[] = Array.from({ length: 12 }, (_, i) => ({
    id: `log-${i}`,
    ruleId: rules[i % rules.length].id,
    message: `Alert triggered for ${rules[i % rules.length].metricName} at ${new Date(now - i * day).toISOString()}`,
    triggeredAt: now - i * day,
  }));

  return { integrations, metrics, rules, logs };
}

const initialState: State = {
  integrations: [],
  metrics: [],
  rules: [],
  logs: [],
  loaded: false,
  toast: null,
};

function reducer(state: State, action: Action): State {
  const persist = (key: string, data: unknown) => localStorage.setItem(key, JSON.stringify(data));
  const newState = { ...state, toast: action.type !== 'DISMISS_TOAST' && action.type !== 'TOAST' ? state.toast : null };

  switch (action.type) {
    case 'SEED':
      Object.entries(STORAGE_KEYS).forEach(([k, v]) => persist(v, action.payload[k as keyof AppState]));
      return { ...newState, ...action.payload, loaded: true };
    case 'ADD_ENTITY':
      const addList = [...state[action.entity], action.data];
      persist(STORAGE_KEYS[action.entity], addList);
      return { ...newState, [action.entity]: addList };
    case 'UPDATE_ENTITY':
      const updList = state[action.entity].map(item =>
        (item as { id: string }).id === (action.data as { id: string }).id ? action.data : item
      );
      persist(STORAGE_KEYS[action.entity], updList);
      return { ...newState, [action.entity]: updList };
    case 'DELETE_ENTITY':
      const delList = state[action.entity].filter(item => (item as { id: string }).id !== action.id);
      persist(STORAGE_KEYS[action.entity], delList);
      return { ...newState, [action.entity]: delList };
    case 'TOAST':
      return { ...newState, toast: { message: action.message, type: action.toastType } };
    case 'DISMISS_TOAST':
      return newState;
    default:
      return state;
  }
}

const StoreContext = createContext<[State, React.Dispatch<Action>]>([initialState, () => {}]);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const toastTimer = useRef<NodeJS.Timeout>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loaded: Partial<AppState> = {};
    for (const [key, storageKey] of Object.entries(STORAGE_KEYS)) {
      const raw = localStorage.getItem(storageKey);
      if (raw) loaded[key as keyof AppState] = JSON.parse(raw);
    }
    if (Object.keys(loaded).length === 4) {
      dispatch({ type: 'SEED', payload: loaded as AppState });
    } else {
      dispatch({ type: 'SEED', payload: generateSeed() });
    }
  }, []);

  useEffect(() => {
    if (state.toast) {
      toastTimer.current = setTimeout(() => dispatch({ type: 'DISMISS_TOAST' }), 3000);
      return () => clearTimeout(toastTimer.current);
    }
  }, [state.toast]);

  if (!mounted) return null; // ponytail: SSR hydration mismatch avoided, add loading spinner when needed

  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
