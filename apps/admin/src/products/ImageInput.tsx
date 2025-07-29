import React from 'react';
import { ArrayInput, SimpleFormIterator, TextInput } from 'react-admin';
import { Box } from '@mui/material';

export const ImageInput = ({ source, label }: { source: string; label: string }) => {
  return (
    <ArrayInput source={source} label={label}>
      <SimpleFormIterator>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <TextInput 
            source="." 
            label="URL изображения" 
            fullWidth 
            helperText="Введите полный URL изображения (например: /uploads/products/image.jpg)"
          />
        </Box>
      </SimpleFormIterator>
    </ArrayInput>
  );
}; 