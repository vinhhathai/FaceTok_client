import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Box,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Grid
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import StarIcon from '@mui/icons-material/Star';

// Emoji categories
const EMOJI_CATEGORIES = {
  popular: {
    icon: <StarIcon />,
    label: 'Phổ biến',
    emojis: [
      '😂', '❤️', '😍', '🤣', '😊', '🙏', '💕', '😭', '😘', '👍',
      '😅', '👏', '😁', '🔥', '🥰', '💔', '💖', '💙', '😢', '🤔',
      '😆', '🙄', '💪', '😉', '☺️', '👌', '🤗', '💜', '😔', '😎',
      '😇', '🌹', '🤦', '🎉', '💞', '✌️', '✨', '🤷', '😱', '😌',
      '🌸', '🙌', '😋', '💗', '💚', '😏', '💛', '🙂', '💓', '🤩',
      '🥺', '😤', '👉', '💋', '😮', '😫', '😴', '😪', '🌟', '😑'
    ]
  },
  smileys: {
    icon: <SentimentSatisfiedAltIcon />,
    label: 'Mặt cười',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
      '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
      '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
      '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
      '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓'
    ]
  },
  emotions: {
    icon: <FavoriteIcon />,
    label: 'Cảm xúc',
    emojis: [
      '😥', '😢', '😭', '😤', '😠', '😡', '🤬', '😈', '👿', '💀',
      '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺',
      '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '❤️', '🧡',
      '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕',
      '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️'
    ]
  },
  gestures: {
    icon: <EmojiNatureIcon />,
    label: 'Cử chỉ',
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟',
      '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎',
      '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏',
      '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻',
      '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸'
    ]
  },
  animals: {
    icon: <SportsEsportsIcon />,
    label: 'Động vật',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
      '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
      '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
      '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜',
      '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙'
    ]
  },
  objects: {
    icon: <EmojiObjectsIcon />,
    label: 'Đồ vật',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
      '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁',
      '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️',
      '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️',
      '🤾', '🏌️', '🏇', '🧘', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴'
    ]
  }
};

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const [activeTab, setActiveTab] = useState('popular');

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    // Don't close the picker, let user select multiple emojis
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        mb: 1,
        width: 360,
        maxHeight: 400,
        zIndex: 1300,
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ minHeight: 48 }}
        >
          {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
            <Tab
              key={key}
              value={key}
              icon={category.icon}
              sx={{ minHeight: 48, minWidth: 0, px: 1 }}
            />
          ))}
        </Tabs>
      </Box>

      <Box
        sx={{
          p: 1,
          height: 300,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: 8
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'background.default'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'divider',
            borderRadius: 4
          }
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          {EMOJI_CATEGORIES[activeTab].label}
        </Typography>
        <Grid container spacing={0.5}>
          {EMOJI_CATEGORIES[activeTab].emojis.map((emoji, index) => (
            <Grid item key={index}>
              <IconButton
                size="small"
                onClick={() => handleEmojiClick(emoji)}
                sx={{
                  fontSize: 24,
                  p: 0.5,
                  minWidth: 40,
                  minHeight: 40,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.2)',
                  },
                  transition: 'transform 0.1s'
                }}
              >
                {emoji}
              </IconButton>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          p: 1,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'background.default'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Click để thêm emoji vào tin nhắn
        </Typography>
      </Box>
    </Paper>
  );
};

EmojiPicker.propTypes = {
  onEmojiSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default EmojiPicker;
