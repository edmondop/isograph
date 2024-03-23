import React, { useState } from 'react';
import { iso } from '@iso';
import { MenuItem, Select, Button, Input, Box } from '@mui/material';

import { PetId } from './router';

export const PetUpdater = iso(`
  field Pet.PetUpdater @component {
    set_pet_golden_buddy
    potential_new_best_friends {
      id
      name
    },

    set_pet_tagline
    tagline
  }
`)(function PetUpdaterComponent(data) {
  const [selected, setSelected] = useState<PetId | 'NONE'>('NONE');
  const [tagline, setTagline] = useState<string>(data.tagline);

  const updateTagline = () => data.set_pet_tagline({ input: { tagline } });

  return (
    <>
      <Select
        value={selected}
        onChange={(e) => {
          const value = e.target.value;
          if (typeof value === 'string') {
            setSelected('NONE');
            if (value === 'NONE') {
              return;
            }
            data.set_pet_golden_buddy({
              new_best_friend_id: value,
            });
          }
        }}
      >
        <MenuItem value="NONE">Select new best friend</MenuItem>
        {data.potential_new_best_friends.map((potentialNewBestFriend) => (
          <MenuItem
            value={potentialNewBestFriend.id}
            key={potentialNewBestFriend.id}
          >
            {potentialNewBestFriend.name}
          </MenuItem>
        ))}
      </Select>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          color="primary"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateTagline();
            }
          }}
        />
        <Button variant="contained" onClick={updateTagline}>
          Set tagline
        </Button>
      </Box>
    </>
  );
});
