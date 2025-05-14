import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MilitaryTechOutlinedIcon from "@mui/icons-material/MilitaryTechOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography fontSize="0.85rem">{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const image = localStorage.getItem("image");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found in localStorage");

      const response = await fetch("https://edunova-back-rqxc.onrender.com/api/auth/signout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error.message);
      alert("Logout error: " + error.message);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "6px 35px 6px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#00bcd4 !important",
        },
        "& .pro-menu-item.active": {
          color: "#03a9f4 !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="circle">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            
            icon={<DashboardCustomizeIcon />}
            style={{ margin: "10px 0 20px 0", color: colors.primary }}
          >
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                <Typography fontSize="1rem" variant="h3" color={colors.grey[100]}>
                  ADMIN PANEL
                </Typography>
                
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile"
                  width="100px"
                  height="100px"
                  src={image}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography fontSize="0.85rem" variant="h6" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
                  {firstName && lastName ? `${firstName} ${lastName}` : "Guest"}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item title="Dashboard" to="/dashboard" icon={<DashboardCustomizeIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Home Page" to="/home" icon={<HomeIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Manage Team" to="/dashboard/team" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Lessons List" to="/dashboard/lessons" icon={<LibraryBooksOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Modules List" to="/dashboard/listModulesBack" icon={<CollectionsBookmarkOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Questions" to="/dashboard/contacts" icon={<HelpOutlineIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Badges" to="/dashboard/badgeForm" icon={<MilitaryTechOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Profile Form" to="/dashboard/form" icon={<AccountCircleOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Level" to="/dashboard/Level" icon={<LeaderboardOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Change Password" to="/dashboard/changePassword" icon={<VpnKeyOutlinedIcon />} selected={selected} setSelected={setSelected} />
          </Box>

          <Box display="flex" justifyContent="center" mt={4} mb={4}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ width: "80%", padding: "10px", borderRadius: "10px" }}
            >
              Logout
            </Button>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
