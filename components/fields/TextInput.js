import { styled } from '@stitches/react';
import {
  Textarea,
  FileInput,
  TextInput,
  Button,
  Select,
  Divider,
  Group,
  ActionIcon,
  Text,
  Stack,
  Switch,
} from '@mantine/core';
import { TbTrash, TbPlaylistAdd, TbCameraPlus, TbFileUpload, TbChevronDown, TbChevronRight } from 'react-icons/tb';
import { Spacer } from './LayoutUtils';
import { randomId } from '@mantine/hooks';

/* * */
/* NEW FIELD */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$gray0',
  border: '1px solid $gray7',
  borderRadius: '$md',
  overflow: 'hidden',
});

const InnerWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '$md',
});

const FieldHeader = styled(InnerWrapper, {
  padding: '$sm $md',
  backgroundColor: '$gray1',
});

const FieldTitle = styled('p', {
  color: '$gray12',
  opacity: 1,
  fontSize: '18px',
  fontWeight: '$bold',
  lineHeight: 1.3,
  variants: {
    untitled: {
      true: {
        opacity: 0.3,
        fontStyle: 'italic',
        fontWeight: '$regular',
      },
    },
  },
});

const FieldId = styled('p', {
  color: '$gray12',
  opacity: 0.6,
  fontFamily: 'monospace',
  fontSize: '13px',
  lineHeight: 1.4,
  variants: {
    untitled: {
      true: {
        opacity: 0.3,
        fontStyle: 'italic',
        fontWeight: '$regular',
      },
    },
  },
});

/* */
/* LOGIC */

export default function TextInput2({ form, fieldTemplate, formPathForField }) {
  //

  return (
    <div key={fieldTemplate.key}>
      <TextInput
        label={fieldTemplate.label}
        placeholder={fieldTemplate.placeholder}
        description={fieldTemplate.description}
        {...form.getInputProps(formPathForField)}
      />
    </div>
  );
}
