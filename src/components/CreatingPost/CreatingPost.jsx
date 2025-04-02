import React from 'react';
import mediaIcon from "../../assets/images/icons/theme/post-image.png";

import {
  CreatePostWrapper,
  CreatePostInput,
  CreatePostActions,
  MediaButton,
  PublishButton
} from './styles';

function CreatePost() {
  return (
    <CreatePostWrapper elevation={3}>
      <CreatePostInput
        fullWidth
        multiline
        rows={2}
        placeholder="What's on your mind, Vinh đẹp trai?"
        variant="outlined"
      />
      <CreatePostActions>
        <MediaButton startIcon={<img src={mediaIcon} alt="Media" />}>
          Photo/Video+
        </MediaButton>
        <PublishButton variant="contained" size="small">
          Publish
        </PublishButton>
      </CreatePostActions>
    </CreatePostWrapper>
  );
}

export default CreatePost; 