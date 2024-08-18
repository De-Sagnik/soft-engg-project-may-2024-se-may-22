// import React, { useEffect, useState } from 'react';
// import Sidenav from "../Sidenav";
// import { Typography, MenuItem, Select, Button, FormControl, InputLabel, Box } from '@mui/material';
// import { useParams } from "react-router-dom";
// import axios from 'axios';

// const Notes = () => {
//   const { courseId, courseName } = useParams();
//   const [courseMaterials, setCourseMaterials] = useState([]);
//   const [selectedWeeks, setSelectedWeeks] = useState([]);
//   const [availableWeeks, setAvailableWeeks] = useState([]);

//   useEffect(() => {
//     axios.get(`http://localhost:8000/course/course_material/${courseId}`)
//       .then((res) => {
//         console.log(res.data);
//         const sortedMaterials = res.data.sort((a, b) => a.week - b.week);
//         setCourseMaterials(sortedMaterials);
        
//         const weeks = [...new Set(sortedMaterials.map(material => material.week))];
//         setAvailableWeeks(weeks);
//         setSelectedWeeks(weeks); // Select all weeks by default
//       })
//       .catch(err => {
//         console.error("Error fetching course material:", err);
//       });
//   }, [courseId]);

//   const handleWeekChange = (event) => {
//     setSelectedWeeks(event.target.value);
//   };

//   const renderMaterial = (material) => {
//     switch (material.material_type) {
//       case "notes":
//         return (
//           <Typography key={material._id} variant="body1" paragraph>
//             {material.content}
//           </Typography>
//         );
//       case "video_URL":
//         return (
//           <Box key={material._id} mb={2}>
//             <Typography variant="body1">
//               <a href={material.url} target="_blank" rel="noopener noreferrer">
//                 {material.content || material.url}
//               </a>
//             </Typography>
//           </Box>
//         );
//       // Add more cases as needed for other material types
//       default:
//         return null;
//     }
//   };
  

//   return (
//     <>
//       <Sidenav />
//       <div>
//         <Typography variant='h3' align='center'> Notes for {courseName} </Typography>
//         <Box display="flex" justifyContent="center" my={2}>
//           <FormControl variant="outlined" sx={{ minWidth: 200 }}>
//             <InputLabel id="week-select-label">Select Week(s)</InputLabel>
//             <Select
//               labelId="week-select-label"
//               id="week-select"
//               multiple
//               value={selectedWeeks}
//               onChange={handleWeekChange}
//               label="Select Week(s)"
//               renderValue={(selected) => selected.join(', ')}
//             >
//               {availableWeeks.map((week) => (
//                 <MenuItem key={week} value={week}>
//                   {week}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Box>
//         <Button variant="contained" color="primary" sx={{ mb: 2 }}>
//           Summary
//         </Button>
//         <Box>
//           {courseMaterials
//             .filter(material => selectedWeeks.includes(material.week))
//             .map(material => renderMaterial(material))}
//         </Box>
//       </div>
//     </>
//   );
// };

// export default Notes;


import React, { useEffect, useState } from 'react';
import Sidenav from "../Sidenav";
import { Typography, MenuItem, Select, Button, FormControl, InputLabel, Box } from '@mui/material';
import { useParams } from "react-router-dom";
import axios from 'axios';

const Notes = () => {
  const { courseId, courseName } = useParams();
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [availableWeeks, setAvailableWeeks] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/course/course_material/${courseId}`)
      .then((res) => {
        console.log(res.data); // Debugging API response
        const sortedMaterials = res.data.sort((a, b) => a.week - b.week);
        setCourseMaterials(sortedMaterials);

        const weeks = [...new Set(sortedMaterials.map(material => material.week))];
        setAvailableWeeks(weeks);
        setSelectedWeeks(weeks); // Select all weeks by default
      })
      .catch(err => {
        console.error("Error fetching course material:", err);
      });
  }, [courseId]);

  const handleWeekChange = (event) => {
    setSelectedWeeks(event.target.value);
  };

  const renderMaterial = (material) => {
    switch (material.material_type) {
      case "notes":
        return (
          <Typography key={material._id} variant="body1" paragraph>
            {material.content}
          </Typography>
        );
      case "video_URL":
        return (
          <Box key={material._id} mb={2}>
            <Typography variant="body1">
              <a href={material.url} target="_blank" rel="noopener noreferrer">
                {material.content || material.url}
              </a>
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Sidenav />
      <div>
        <Typography variant='h3' align='center'> Notes for {courseName} </Typography>
        <Box display="flex" justifyContent="center" my={2}>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel id="week-select-label">Select Week(s)</InputLabel>
            <Select
              labelId="week-select-label"
              id="week-select"
              multiple
              value={selectedWeeks}
              onChange={handleWeekChange}
              label="Select Week(s)"
              renderValue={(selected) => selected.join(', ')}
            >
              {availableWeeks.map((week) => (
                <MenuItem key={week} value={week}>
                  {week}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>
          Summary (Dummy Button)
        </Button>
        <Box>
          {courseMaterials
            .filter(material => selectedWeeks.includes(material.week))
            .map(material => renderMaterial(material))}
        </Box>
      </div>
    </>
  );
};

export default Notes;
