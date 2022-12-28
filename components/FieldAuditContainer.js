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

export default function FieldAuditContainer({
  form,
  fieldTemplate,
  section,
  formInputProps,
  sectionIndex,
  fieldIndex,
  formPathForSection,
  formPathForField,
  fieldDragAndDropProps,
}) {
  //

  const renderField = () => {
    switch (fieldTemplate.type) {
      case 'text_short':
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
      case 'select':
        return (
          <div key={fieldTemplate.key}>
            <Select
              clearable
              label={fieldTemplate.label}
              placeholder={fieldTemplate.placeholder}
              description={fieldTemplate.description}
              data={fieldTemplate.options || []}
              {...form.getInputProps(formPathForField)}
            />
          </div>
        );
      case 'truefalse':
        return (
          <div key={fieldTemplate.key}>
            <Switch
              label={fieldTemplate.label}
              placeholder={fieldTemplate.placeholder}
              description={fieldTemplate.description}
              {...form.getInputProps(formPathForField, { type: 'checkbox' })}
            />
          </div>
        );
      case 'text_long':
        return (
          <div key={fieldTemplate.key}>
            <Textarea
              label={fieldTemplate.label}
              placeholder={fieldTemplate.placeholder}
              description={fieldTemplate.description}
              {...form.getInputProps(formPathForField)}
            />
          </div>
        );
      case 'file_image':
        return (
          <div key={fieldTemplate.key}>
            <FileInput
              label={fieldTemplate.label}
              placeholder={fieldTemplate.placeholder}
              description={fieldTemplate.description}
              icon={<TbCameraPlus />}
              {...form.getInputProps(formPathForField)}
            />
          </div>
        );
      case 'file_document':
        return (
          <div key={fieldTemplate.key}>
            <FileInput
              label={fieldTemplate.label}
              placeholder={fieldTemplate.placeholder}
              description={fieldTemplate.description}
              icon={<TbFileUpload />}
              {...form.getInputProps(formPathForField)}
            />
          </div>
        );
      default:
        return <div key={fieldTemplate.key}>{fieldTemplate.type}</div>;
    }
  };

  return renderField();
}
