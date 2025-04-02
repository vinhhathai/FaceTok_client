import { useState } from "react";
import CreateGroupModal from "../CreateGroupModal/CreateGroupModal";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { DropdownPaper, MenuButton, IconContainer, TextContainer } from './styles';

function CreateDropdown() {
    const [showModal, setShowModal] = useState(false);
    console.log(showModal);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    return (
        <>
            {/*Modal*/}
            <CreateGroupModal show={showModal} handleClose={toggleModal} />
            {/*End Modal*/}
            <DropdownPaper elevation={3}>
                <Stack spacing={1}>
                    <MenuButton
                        fullWidth
                        disableRipple
                        onClick={toggleModal}
                    >
                        <IconContainer>
                            <GroupIcon />
                        </IconContainer>
                        <TextContainer>
                            <Typography variant="body1" component="span">
                                Group
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Bring people together
                            </Typography>
                        </TextContainer>
                    </MenuButton>
                    
                    <MenuButton
                        fullWidth
                        disableRipple
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <IconContainer>
                            <CalendarTodayIcon />
                        </IconContainer>
                        <TextContainer>
                            <Typography variant="body1" component="span">
                                Post
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Share your interested things to other peoples today
                            </Typography>
                        </TextContainer>
                    </MenuButton>
                </Stack>
            </DropdownPaper>
        </>
    );
}

export default CreateDropdown;
