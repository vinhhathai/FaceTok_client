const styles = {
  dialogPaper: {
    borderRadius: 3,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    overflow: "hidden",
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 3,
    py: 2.5,
    borderBottom: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
  },
  titleLeft: {
    display: "flex",
    alignItems: "center",
  },
  groupIcon: {
    mr: 1.5,
    color: "primary.main",
  },
  closeButton: {
    color: "text.secondary",
    "&:hover": {
      backgroundColor: "action.hover",
    },
  },
  dialogContent: { p: 0 },
  contentContainer: { p: 3 },
  inputSpacingLarge: { mb: 3 },
  inputSpacingSmall: { mb: 2 },
  searchIcon: { mr: 1, color: "text.secondary" },
  sectionSpacing: { mb: 3 },
  sectionTitle: { mb: 1 },
  friendsList: {
    maxHeight: 300,
    overflow: "auto",
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 1,
  },
  checkboxLabel: { mr: 0 },
  selectedChip: {
    "& .MuiChip-deleteIcon": {
      color: "error.main",
    },
  },
  alertSpacing: { mb: 2 },
  currentUserBox: { p: 2, bgcolor: "action.hover", borderRadius: 1 },
  dialogActions: { px: 3, py: 2 },
};

export default styles;


