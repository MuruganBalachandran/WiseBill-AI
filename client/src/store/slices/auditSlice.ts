import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuditInput } from '../../types/audit';

interface AuditState {
  recentAudits: string[]; // store recent slugs
  latestAuditSlug: string | null;
  inputs: AuditInput[];
  globalSettings: { teamSize: number };
}

const initialState: AuditState = {
  recentAudits: [],
  latestAuditSlug: null,
  inputs: [],
  globalSettings: { teamSize: 10 },
};

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    addAuditSlug: (state, action: PayloadAction<string>) => {
      state.latestAuditSlug = action.payload;
      if (!state.recentAudits.includes(action.payload)) {
        state.recentAudits.unshift(action.payload);
      }
      // keep only the last 5
      if (state.recentAudits.length > 5) {
        state.recentAudits.pop();
      }
    },
    clearAudits: (state) => {
      state.recentAudits = [];
      state.latestAuditSlug = null;
    },
    updateInputs: (state, action: PayloadAction<AuditInput[]>) => {
      state.inputs = action.payload;
    },
    updateGlobalSettings: (state, action: PayloadAction<{ teamSize: number }>) => {
      state.globalSettings = action.payload;
    },
  },
});

export const { addAuditSlug, clearAudits, updateInputs, updateGlobalSettings } = auditSlice.actions;
export default auditSlice.reducer;
