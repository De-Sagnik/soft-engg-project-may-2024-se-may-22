// src/components/Notes.jsx
import React, {useState, useEffect} from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Container from "@mui/material/Container";
import NotesIcon from "@mui/icons-material/Notes";
import CodeIcon from "@mui/icons-material/Code";
import QuizIcon from "@mui/icons-material/Quiz";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import axios from "axios";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

const drawerWidth = 240;

const paths = {
  Notes: "/",
  "Coding Assignments": "/code",
  "Graded Assignments": "/assignment",
  "Memory Flashcards": "/flashcard",
};

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Sidenav = () => {
  const [allCourses, setAllCourses] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8000/course/getall")
      .then((res) => {
        const courses = {};
        res.data.forEach(course => {
          courses[course.course_id] = course.course_name;
        });
        setAllCourses(courses);
      })
      .catch(err => {
        console.error("Error fetching courses:", err);
      });
  }, []);
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [isNotesClicked, setIsNotesClicked] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNotesClick = () => {
    setIsNotesClicked((prev) => !prev);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };
  
  const material = isNotesClicked
    ? [
        "Notes",
        ...Object.values(allCourses),
        "Coding Assignments",
        "Graded Assignments",
        "Memory Flashcards",
      ]
    : [
        "Notes",
        "Coding Assignments",
        "Graded Assignments",
        "Memory Flashcards",
      ];

  const icons = {
    Notes: <NotesIcon />,
    "Coding Assignments": <CodeIcon />,
    "Graded Assignments": <QuizIcon />,
    "Memory Flashcards": <PsychologyIcon />,
  };
  

  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  console.log("User", user);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Study Buddy
          </Typography>
          {isAuthenticated ? (
            <div>
              <span>Welcome, {user.name}</span>
              <Button variant="" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="" onClick={() => loginWithRedirect()}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {material.map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() =>
                  text === "Notes"
                    ? handleNotesClick()
                    : handleNavigation(paths[text])
                }
              >
                <ListItemIcon>{icons[text]}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["Logout"].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {/* Add your main content here */}
      </Main>
    </Box>
  );
};

export default Sidenav;
