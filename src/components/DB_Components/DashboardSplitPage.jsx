// src/components/DB_Components/DashboardSplitPage.jsx
import React from 'react';
import { Box } from '@mui/material';
import ProfileCard from '../DB_Components/ProfileCard';
import ContactCard from '../DB_Components/ContactCard';
import AcademicCalendar from '../DB_Components/Calendar';

export default function DashboardSplitPage() {
  return (
    <Box
      sx={{
        mt: 3,
        display: 'grid',
        // عمود واحد لحد lg (>=1200px يخليها عمودين)
        gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr', lg: '1fr 1fr' },
        gap: 2,
        alignItems: 'start',
        // عشان أي طفل ما يضغطش الشبكة (خصوصاً الكاليندر)
        '& > *': { minWidth: 0 },
      }}
    >
      {/* العمود الشِمال */}
      <Box sx={{ display: 'grid', gap: 2, width: '100%', minWidth: 0 }}>
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <ProfileCard />
        </Box>
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <ContactCard />
        </Box>
      </Box>

      {/* العمود اليمين */}
      <Box sx={{ width: '100%', minWidth: 0 }}>
        <Box sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
          <AcademicCalendar />
        </Box>
      </Box>
    </Box>
  );
}
