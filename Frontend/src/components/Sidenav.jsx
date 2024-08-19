// src/components/Notes.jsx
import React, {useEffect, useState} from "react";
import {styled, useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NotesIcon from "@mui/icons-material/Notes";
import CodeIcon from "@mui/icons-material/Code";
import QuizIcon from "@mui/icons-material/Quiz";
import PsychologyIcon from "@mui/icons-material/Psychology";
import {useNavigate, useParams} from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import {CheckIcon} from "primereact/icons/check";

const drawerWidth = 240;

const paths = {
    Notes: (courseId) => `/notes/${courseId}`,
    Coding_Assignments: (courseId) => `/code/${courseId}`,
    Graded_Assignments: (courseId) => `/assignments/${courseId}`,
    Memory_Flashcards: (courseId) => `/flashcards/${courseId}`,
};


const Main = styled("main", {shouldForwardProp: (prop) => prop !== "open"})(
    ({theme, open}) => {
        const marginLeftValue = `-${drawerWidth}px`;
        return {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: marginLeftValue,
            ...(open && {
                transition: theme.transitions.create("margin", {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0,
            }),
        };
    }
);


const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({theme, open}) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`, // Corrected to a valid template literal
        marginLeft: `${drawerWidth}px`, // Corrected to a valid template literal
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

const Sidenav = () => {
    const [allCourses, setAllCourses] = useState([]);
    const params = useParams()
    const courseId = params.courseId;
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
        if (!isNotesClicked && allCourses.length > 0) {
            const defaultCourse = Object.entries(allCourses)[0]; // Get first course
            navigate(paths.Notes(defaultCourse[1], defaultCourse[0])); // Navigate to default course
        }
    };

    const handleNavigation = (path, courseName = "", courseId = "") => {
        const resolvedPath = typeof path === 'function' ? path(courseName, courseId) : path;
        navigate(resolvedPath);
    };


    return (
        <Box sx={{display: "flex"}}>
            <CssBaseline/>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Study Buddy
                    </Typography>
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
                        <ChevronLeftIcon/>
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon><CheckIcon/></ListItemIcon>
                            <ListItemText primary={allCourses[courseId]}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                handleNavigation(paths.Notes(courseId))
                            }}>
                            <ListItemIcon><NotesIcon/></ListItemIcon>
                            <ListItemText primary="Notes"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                handleNavigation(paths.Graded_Assignments(courseId))
                            }}>
                            <ListItemIcon><QuizIcon/></ListItemIcon>
                            <ListItemText primary="Graded Assignments"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                handleNavigation(paths.Memory_Flashcards(courseId))
                            }}>
                            <ListItemIcon><PsychologyIcon/></ListItemIcon>
                            <ListItemText primary="Flashcards"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                handleNavigation(paths.Coding_Assignments(courseId))
                            }}>
                            <ListItemIcon><CodeIcon/></ListItemIcon>
                            <ListItemText primary="Coding Assignments"/>
                        </ListItemButton>
                    </ListItem>

                </List>


                <Divider/>
                <List onClick={() => handleNavigation('/')}>
                    {["Course"].map((text) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <LogoutIcon/>
                                </ListItemIcon>
                                <ListItemText primary={text}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <List onClick={() => handleNavigation('/login')}>
                    {["Logout"].map((text) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <LogoutIcon/>
                                </ListItemIcon>
                                <ListItemText primary={text}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader/>
            </Main>
        </Box>
    )
        ;
};

export default Sidenav;
