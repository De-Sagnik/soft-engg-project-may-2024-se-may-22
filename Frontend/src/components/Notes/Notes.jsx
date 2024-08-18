// import React, { useEffect, useState } from "react";
// import Sidenav from "../Sidenav";
// import {
//   Typography,
//   MenuItem,
//   Select,
//   Button,
//   FormControl,
//   InputLabel,
//   Box,
//   TextField,
//   CircularProgress,
// } from "@mui/material";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// import { Sidebar } from "primereact/sidebar";
// // import { Button } from "primereact/button";

// const Notes = () => {
//   const { courseId, courseName } = useParams();
//   const [courseMaterials, setCourseMaterials] = useState([]);
//   const [selectedWeek, setSelectedWeek] = useState(1);
//   const [availableWeeks, setAvailableWeeks] = useState([]);

//   const [visibleRight, setVisibleRight] = useState(false);
//   const [conversation, setConversation] = useState([]);
//   const [userMessage, setUserMessage] = useState("");

//   useEffect(() => {
//     axios
//       .get(`http://localhost:8000/course/course_material/${courseId}`, {
//         headers: {
//           Authorization: `Bearer ` + localStorage.getItem("token"),
//         },
//       })
//       .then((res) => {
//         console.log(res.data); // Debugging API response
//         const sortedMaterials = res.data.sort((a, b) => a.week - b.week);
//         setCourseMaterials(sortedMaterials);

//         const weeks = [
//           ...new Set(sortedMaterials.map((material) => material.week)),
//         ];
//         setAvailableWeeks(weeks);
//         setSelectedWeek(weeks); // Select all weeks by default
//       })
//       .catch((err) => {
//         console.error("Error fetching course material:", err);
//       });
//   }, [courseId]);

//   const handleWeekChange = (event) => {
//     setSelectedWeek(event.target.value);
//   };

//   async function aiChat() {
//     await axios
//       .post(
//         "http://localhost:8000/user/search_generate",
//         {
//           query: messages,
//           subject_code: courseId,
//           week: selectedWeek
//         },
//         {
//           headers: {
//             Authorization: `Bearer ` + localStorage.getItem("token"),
//           },
//         }
//       )
//       .then((res) => {
//         console.log(res.data); // Debugging API response
//         setAIresponse(res.data);
//       });
//   }

//   const renderMaterial = (material) => {
//     if (material.material_type === "notes") {
//       return (
//         <Typography key={material._id} variant="body1" paragraph>
//           {material.content}
//         </Typography>
//       );
//     } else if (material.material_type === "video_URL") {
//       return (
//         <Box key={material._id} mb={2}>
//           <Typography variant="body1">
//             <a href={material.url} target="_blank" rel="noopener noreferrer">
//               {material.content || material.url}
//             </a>
//           </Typography>
//         </Box>
//       );
//     } else {
//       return null;
//     }
//   };

//   const [messages, setMessages] = useState([]);
//   const [userInput, setUserInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [AIresponse, setAIresponse] = useState("");

//   const handleSend = () => {
//     if (userInput.trim() === "") return;

//     const newMessage = { sender: "user", text: userInput };
//     setMessages([...messages, newMessage]);
//     setUserInput("");
//     setLoading(true);

//     axios
//       .post("http://localhost:8000/ai_chat", {
//         query: userInput,
//         subject_code: courseId,
//       })
//       .then((res) => {
//         setMessages([
//           ...messages,
//           newMessage,
//           { sender: "ai", text: res.data.reply },
//         ]);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error with AI response:", err);
//         setLoading(false);
//       });
//   };

//   return (
//     <>
//       <Sidenav />
//       <div>
//         <Typography variant="h3" align="center">
//           {" "}
//           Notes for {courseName}{" "}
//         </Typography>
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
//               renderValue={(selected) => selected.join(", ")}
//             >
//               {availableWeeks.map((week) => (
//                 <MenuItem key={week} value={week}>
//                   {week}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Box>
//         <Button
//           variant="contained"
//           color="primary"
//           sx={{ mb: 2 }}
//           onClick={() => {
//             setVisibleRight(true);
//             aiChat();
//           }}
//         >
//           Chat with Notes
//         </Button>
//         <Box>
//           {courseMaterials
//             .filter((material) => selectedWeeks.includes(material.week))
//             .map((material) => renderMaterial(material))}
//         </Box>
//       </div>
//       <Sidebar
//         visible={visibleRight}
//         position="right"
//         onHide={() => setVisibleRight(false)}
//       >
//         <Typography variant="h3">AI Chat for {courseName}</Typography>
//         <Typography variant="h5" align="center">
//           {" "}
//           Hey there! How can I help you today?{" "}
//         </Typography>
//         <Box sx={{ maxHeight: "400px", overflowY: "auto", mt: 2 }}>
//           {messages.map((msg, index) => (
//             <Typography
//               key={index}
//               variant="body1"
//               align={msg.sender === "user" ? "right" : "left"}
//             >
//               {msg.text}
//             </Typography>
//           ))}
//           {loading && <CircularProgress size={24} />}
//         </Box>
//         <TextField
//           fullWidth
//           placeholder="Type your message..."
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           onKeyPress={(e) => e.key === "Enter" && handleSend()}
//           sx={{ mt: 2 }}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSend}
//           sx={{ mt: 2 }}
//         >
//           Send
//         </Button>
//       </Sidebar>
//     </>
//   );
// };

// export default Notes;


import React, { useEffect, useState } from "react";
import Sidenav from "../Sidenav";
import {
  Typography,
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Sidebar } from "primereact/sidebar";

const Notes = () => {
  const { courseId, courseName } = useParams();
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(""); // Single value for week
  const [availableWeeks, setAvailableWeeks] = useState([]);

  const [visibleRight, setVisibleRight] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [AIresponse, setAIresponse] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/course/course_material/${courseId}`, {
        headers: {
          Authorization: `Bearer ` + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const sortedMaterials = res.data.sort((a, b) => a.week - b.week);
        setCourseMaterials(sortedMaterials);

        const weeks = [
          ...new Set(sortedMaterials.map((material) => material.week)),
        ];
        setAvailableWeeks(weeks);
        setSelectedWeek(weeks[0]); // Default to the first available week
      })
      .catch((err) => {
        console.error("Error fetching course material:", err);
      });
  }, [courseId]);

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  const handleSend = () => {
    if (userInput.trim() === "") return;

    const newMessage = { sender: "user", text: userInput };
    setMessages([...messages, newMessage]);
    setUserInput("");
    setLoading(true);

    axios
      .post("http://localhost:8000/user/search_generate", {
        query: userInput,
        subject_code: courseId,
        week: selectedWeek
      })
      .then((res) => {
        setMessages([
          ...messages,
          newMessage,
          { sender: "ai", text: res.data.reply },
        ]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error with AI response:", err);
        setLoading(false);
      });
  };

  const renderMaterial = (material) => {
    if (material.material_type === "notes") {
      return (
        <Typography key={material._id} variant="body1" paragraph>
          {material.content}
        </Typography>
      );
    } else if (material.material_type === "video_URL") {
      return (
        <Box key={material._id} mb={2}>
          <Typography variant="body1">
            <a href={material.url} target="_blank" rel="noopener noreferrer">
              {material.content || material.url}
            </a>
          </Typography>
        </Box>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <Sidenav />
      <div>
        <Typography variant="h3" align="center">
          {" "}
          Notes for {courseName}{" "}
        </Typography>
        <Box display="flex" justifyContent="center" my={2}>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel id="week-select-label">Select Week</InputLabel>
            <Select
              labelId="week-select-label"
              id="week-select"
              value={selectedWeek}
              onChange={handleWeekChange}
              label="Select Week"
            >
              {availableWeeks.map((week) => (
                <MenuItem key={week} value={week}>
                  {week}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => {
            setVisibleRight(true);
            // aiChat();
          }}
        >
          Chat with Notes
        </Button>
        <Box>
          {courseMaterials
            .filter((material) => selectedWeek === material.week)
            .map((material) => renderMaterial(material))}
        </Box>
      </div>
      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
      >
        <Typography variant="h3">AI Chat for {courseName}</Typography>
        <Typography variant="h5" align="center">
          {" "}
          Hey there! How can I help you today?{" "}
        </Typography>
        <Box sx={{ maxHeight: "400px", overflowY: "auto", mt: 2 }}>
          {messages.map((msg, index) => (
            <Typography
              key={index}
              variant="body1"
              align={msg.sender === "user" ? "right" : "left"}
            >
              {msg.text}
            </Typography>
          ))}
          {loading && <CircularProgress size={24} />}
        </Box>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          sx={{ mt: 2 }}
        >
          Send
        </Button>
      </Sidebar>
    </>
  );
};

export default Notes;
