// FILE: src/app/dashboard/entities/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { z } from 'zod';
import { Search, Plus, Trash2, Pencil } from 'lucide-react';

const entitySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum(['AWS', 'GCP', 'Azure', 'On-Premises']),
  status: z.enum(['connected', 'disconnected']),
  createdAt: z.number(),
  updatedAt: z.number(),
});

const EntityForm = ({ entity, onSubmit }: { entity: any; onSubmit: any }) => {
  const [formData, setFormData] = useState<any>(entity || {});
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const result = entitySchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-body">
      <input
        type="text"
        name="name"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        className="input"
      />
      {errors.name && <p className="text-red-500">{errors.name.join(', ')}</p>}
      <select
        name="type"
        value={formData.type || ''}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        className="input"
      >
        <option value="">Select Type</option>
        <option value="AWS">AWS</option>
        <option value="GCP">GCP</option>
        <option value="Azure">Azure</option>
        <option value="On-Premises">On-Premises</option>
      </select>
      {errors.type && <p className="text-red-500">{errors.type.join(', ')}</p>}
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
};

const EntitiesPage = () => {
  const [store, dispatch] = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredEntities = useMemo(() => {
    return store.integrations.filter((entity) =>
      entity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [store.integrations, searchTerm]);

  const handleAddEntity = (entity: any) => {
    dispatch({ type: 'ADD_ENTITY', entity: 'integrations', data: entity });
    setShowModal(false);
  };

  const handleUpdateEntity = (entity: any) => {
    dispatch({ type: 'UPDATE_ENTITY', entity: 'integrations', data: entity });
    setSelectedEntity(null);
    setShowModal(false);
  };

  const handleDeleteEntity = (id: any) => {
    dispatch({ type: 'DELETE_ENTITY', entity: 'integrations', id });
  };

  useEffect(() => {
    if (store.integrations.length === 0) {
      dispatch({ type: 'SEED', payload: {} as any });
    }
  }, [store.integrations, dispatch]);

  return (
    <div className="page">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="mr-2" /> Add Integration
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-panel border-b">Name</th>
            <th className="py-2 px-4 bg-panel border-b">Type</th>
            <th className="py-2 px-4 bg-panel border-b">Status</th>
            <th className="py-2 px-4 bg-panel border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntities.map((entity) => (
            <tr key={entity.id}>
              <td className="py-2 px-4 border-b">{entity.name}</td>
              <td className="py-2 px-4 border-b">{entity.type}</td>
              <td className="py-2 px-4 border-b">{entity.status}</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => setSelectedEntity(entity)} className="btn-ghost mr-2">
                  <Pencil />
                </button>
                <button onClick={() => handleDeleteEntity(entity.id)} className="btn-danger">
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="text-lg font-bold mb-4">
              {selectedEntity ? 'Edit Integration' : 'Add Integration'}
            </h2>
            <EntityForm
              entity={selectedEntity}
              onSubmit={selectedEntity ? handleUpdateEntity : handleAddEntity}
            />
            <button onClick={() => setShowModal(false)} className="btn-ghost mt-4">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntitiesPage;