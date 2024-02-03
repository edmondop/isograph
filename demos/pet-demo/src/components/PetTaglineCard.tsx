import React from 'react';
import { iso } from '@iso';
import { Card, CardContent } from '@mui/material';

import { ResolverParameterType as PetTaglineCardParams } from '@iso/Pet/PetTaglineCard/reader';

export const PetTaglineCard = iso(`
field Pet.PetTaglineCard @component {
  id,
  tagline,
}
`)(PetTaglineCardComponent);

function PetTaglineCardComponent(props: PetTaglineCardParams) {
  return (
    <Card variant="outlined" sx={{ width: 450, boxShadow: 3 }}>
      <CardContent>
        <h2>Tagline</h2>
        <p>"{props.data.tagline}"</p>
      </CardContent>
    </Card>
  );
}
