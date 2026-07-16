import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuditState {
  recentAudits: string[]; // store recent slugs
  latestAuditSlug: string | null;
}

const initialState: AuditState = {
  recentAudits: [],
  latestAuditSlug: null,
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
    }
  },
});

export const { addAuditSlug, clearAudits } = auditSlice.actions;
export default auditSlice.reducer;
