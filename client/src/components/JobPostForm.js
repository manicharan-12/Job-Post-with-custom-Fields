import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { ThreeDots } from 'react-loader-spinner';
import styled from 'styled-components';
import CustomField from './CustomField';
import axios from 'axios';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
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

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const FieldLabel = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  display: block;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
  display: block;
`;

const JobPostForm = () => {
  const [registrationFields, setRegistrationFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const { control, register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      salary: '',
      salaryNotDisclosed: false,
      description: '',
      aboutUs: '',
      qualifications: '',
      role: '',
      industryType: '',
      employmentType: '',
      keySkillsMandatory: '',
      keySkillsNiceToHave: '',
      customFields: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFields",
  });

  const watchSalaryNotDisclosed = watch("salaryNotDisclosed");

  useEffect(() => {
    const fetchRegistrationFields = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/registrationFields');
        setRegistrationFields(response.data);
      } catch (error) {
        console.error('Error fetching registration fields:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationFields();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/jobPosts', data);
      console.log('Job Post Created:', response.data);
      alert('Job post created successfully!');
      reset();
    } catch (error) {
      console.error('Error creating job post:', error.response?.data?.message || error.message);
      alert('Error creating job post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addCustomField = () => {
    append({ label: '', value: '', mandatory: false });
  };

  return (
    <FormContainer>
    {loading && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <ThreeDots height="80" width="80" color="#007bff" />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldLabel>Job Title</FieldLabel>
        <Input {...register("title", { required: "Job title is required" })} placeholder="Job Title" />
        {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}

        <FieldLabel>Salary Range</FieldLabel>
        <Input {...register("salary")} placeholder="Salary Range" disabled={watchSalaryNotDisclosed} />

        <Checkbox type="checkbox" {...register("salaryNotDisclosed")} />
        <span>Do not disclose</span>

        <FieldLabel>Job Description</FieldLabel>
        <TextArea {...register("description", { required: "Job description is required" })} placeholder="Job Description" />
        {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}

        <FieldLabel>About Us</FieldLabel>
        <TextArea {...register("aboutUs")} placeholder="About Us" />

        <FieldLabel>Qualifications</FieldLabel>
        <Input {...register("qualifications")} placeholder="Qualifications" />

        <FieldLabel>Role/Position</FieldLabel>
        <Input {...register("role")} placeholder="Role/Position" />

        <FieldLabel>Industry Type</FieldLabel>
        <Input {...register("industryType")} placeholder="Industry Type" />

        <FieldLabel>Employment Type</FieldLabel>
        <Select {...register("employmentType", { required: "Employment type is required" })}>
          <option value="">Select Employment Type</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="contract">Contract</option>
          <option value="temporary">Temporary</option>
          <option value="internship">Internship</option>
          <option value="freelance">Freelance</option>
        </Select>
        {errors.employmentType && <ErrorMessage>{errors.employmentType.message}</ErrorMessage>}

        <FieldLabel>Key Skills - Mandatory</FieldLabel>
        <Input {...register("keySkillsMandatory")} placeholder="Mandatory Key Skills" />

        <FieldLabel>Key Skills - Nice to Have</FieldLabel>
        <Input {...register("keySkillsNiceToHave")} placeholder="Nice to Have Key Skills" />

        <Button type="button" onClick={addCustomField}>Add Custom Field</Button>

        {fields.map((field, index) => (
          <CustomField
            key={field.id}
            field={field}
            control={control}
            index={index}
            register={register}
            remove={() => remove(index)}
            options={registrationFields}
          />
        ))}

        <Button type="submit">Submit Job Post</Button>
      </form>
    </FormContainer>
  );
};

export default JobPostForm;