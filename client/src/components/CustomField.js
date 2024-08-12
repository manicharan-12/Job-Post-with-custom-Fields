// src/components/CustomField.js
import React from 'react';
import { Controller } from 'react-hook-form';
import styled from 'styled-components';

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const FieldLabel = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  display: block;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const CustomField = ({ field, control, index, register, remove, options }) => (
  <div key={field.id}>
    <FieldLabel>Custom Field</FieldLabel>
    <Select
      {...register(`customFields[${index}].label`, { required: true })}
    >
      <option value="">Select a field</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
    
    <FieldLabel>{field.label || `Custom Field ${index + 1}`}</FieldLabel>
    <Controller
      name={`customFields[${index}].value`}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          placeholder={`Enter ${field.label || `Custom Field ${index + 1}`}`}
        />
      )}
    />
    <Checkbox
      type="checkbox"
      {...register(`customFields[${index}].mandatory`)}
    />
    <span>Mandatory</span>
    <Button type="button" onClick={remove}>Delete</Button>
  </div>
);

export default CustomField;