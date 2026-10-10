import React, { useState, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';
import type { UserItem } from '../types';
import { api } from '../services/api';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Lead Inspector' | 'Quality Engineer' | 'Technician'>('Lead Inspector');

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    try {
      await api.createUser({ name, email, role, status: 'Active' });
      setShowModal(false);
      setName('');
      setEmail('');
      loadUsers();
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-brand-blue" />
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              User Management & Operator Roles
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Manage system access permissions, quality engineering roles, and inspector accounts
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-glow-blue flex items-center space-x-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Team Member</span>
        </button>
      </div>

      <div className="bg-navy-800 border border-navy-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-850 text-slate-400 uppercase text-[10px] border-b border-navy-600">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-600/60 text-slate-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-navy-750 transition-colors">
                  <td className="p-4 flex items-center space-x-3 font-bold text-white">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-navy-600 object-cover" />
                    <span>{u.name}</span>
                  </td>
                  <td className="p-4 text-slate-300">{u.email}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded bg-navy-850 border border-navy-600 text-[10px] text-brand-blue font-bold">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'Active' ? 'bg-brand-green/10 text-brand-green border border-brand-green/30' : 'bg-slate-800 text-slate-400'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{u.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddUser} className="bg-navy-850 border border-navy-600 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b border-navy-600 pb-3">
              <h3 className="font-bold text-base text-white">Add Team Member</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3 py-2 text-xs text-white" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3 py-2 text-xs text-white" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role</label>
                <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3 py-2 text-xs text-white">
                  <option value="Admin">Admin</option>
                  <option value="Lead Inspector">Lead Inspector</option>
                  <option value="Quality Engineer">Quality Engineer</option>
                  <option value="Technician">Technician</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-navy-800 text-slate-300 rounded-xl text-xs">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-brand-blue text-white font-bold rounded-xl text-xs">Create User</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
