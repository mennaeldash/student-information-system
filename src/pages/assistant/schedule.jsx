// src/pages/assistant/TASchedule.jsx
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import TASectionTabs from "../../components/assistant/as_co_components/TASectionTabs.jsx";
import TAScheduleList from "../../components/assistant/as_co_components/TAScheduleList.jsx";

export default function TASchedule() {
  const [scheduleDataFromApi, setScheduleDataFromApi] = useState([]);

  // دلوقتي هنشتغل بـ mock لحد ما الباك ييجي
  useEffect(() => {

    
//    useEffect(() => {
//   const fetchSchedule = async () => {
//     const res = await fetch("/api/ta/schedule");
//     const json = await res.json();
//     setScheduleDataFromApi(json);
//   };

//   fetchSchedule();
// }, []);

    setScheduleDataFromApi([]); // سيبها فاضية بحيث TAScheduleList تستخدم الـ mock الداخلي
  }, []);

  return (
    <Box sx={{ width: "100%", mx: 0, px: { xs: 1, sm: 1.5, md: 2 } }}>
      <TASectionTabs />

      {/* بعدين لما الـ API يشتغل هتبعتله الداتا هنا */}
      <TAScheduleList data={scheduleDataFromApi} />
    </Box>
  );
}
