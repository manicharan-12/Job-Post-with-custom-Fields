import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { ThreeDots } from 'react-loader-spinner';

const DashboardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Button = styled.button`
  padding: 5px 10px;
  margin: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  margin: 5px 0;
  padding: 8px;
  width: calc(100% - 18px);
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Label = styled.label`
  margin-right: 10px;
`;

const Select = styled.select`
  margin: 5px 0;
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const AdminDashboard = () => {
  const [customFieldsUsage, setCustomFieldsUsage] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [registrationFields, setRegistrationFields] = useState([]);
  const [newCustomField, setNewCustomField] = useState({ label: '', value: '', mandatory: false });
  const [selectedJobPosts, setSelectedJobPosts] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    setLoading(true);
    fetchCustomFieldsUsage();
    fetchJobPosts();
    fetchRegistrationFields();
    setLoading(false);
  }, []);

  const fetchCustomFieldsUsage = async () => {
    try {
      const response = await axios.get('https://job-post-with-custom-fields.onrender.com/api/admin/custom-fields-usage');
      setCustomFieldsUsage(response.data);
    } catch (error) {
      console.error('Error fetching custom fields usage:', error);
    }
  };

  const fetchJobPosts = async () => {
    try {
      const response = await axios.get('https://job-post-with-custom-fields.onrender.com/api/jobPosts');
      setJobPosts(response.data);
    } catch (error) {
      console.error('Error fetching job posts:', error);
    }
  };

  const fetchRegistrationFields = async () => {
    try {
      const response = await axios.get('https://job-post-with-custom-fields.onrender.com/api/registrationFields');
      setRegistrationFields(response.data);
    } catch (error) {
      console.error('Error fetching registration fields:', error);
    }
  };

  const addCustomField = async () => {
    if (!newCustomField.label || !newCustomField.value || selectedJobPosts.length === 0) {
      alert('Please fill in all fields and select at least one job post.');
      return;
    }
    setLoading(true); 
    try {
      await axios.post('https://job-post-with-custom-fields.onrender.com/api/admin/add-custom-field', {
        jobPostIds: selectedJobPosts,
        ...newCustomField,
      });
      setNewCustomField({ label: '', value: '', mandatory: false });
      setSelectedJobPosts([]);
      fetchCustomFieldsUsage();
      fetchJobPosts(); 
    } catch (error) {
      console.error('Error adding custom field:', error);
    } finally {
      setLoading(false); 
    }
  };

  const deleteCustomField = async (jobId, fieldId) => {
    setLoading(true); 
    try {
      await axios.delete(`https://job-post-with-custom-fields.onrender.com/api/admin/${jobId}/customField/${fieldId}`);
      fetchJobPosts();
      fetchCustomFieldsUsage();
    } catch (error) {
      console.error('Error deleting custom field:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContainer>
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#007bff"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      )}
      <h2>Custom Fields Usage</h2>
      <Table>
        <thead>
          <tr>
            <Th>Field</Th>
            <Th>Usage Count</Th>
          </tr>
        </thead>
        <tbody>
          {customFieldsUsage.map((field) => (
            <tr key={field._id}>
              <Td>{field._id}</Td>
              <Td>{field.count}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Add New Custom Field</h3>
      <Select
        value={newCustomField.label}
        onChange={(e) => setNewCustomField({ ...newCustomField, label: e.target.value })}
      >
        <option value="">Select Label</option>
        {registrationFields.map((field) => (
          <option key={field.value} value={field.label}>
            {field.label}
          </option>
        ))}
      </Select>
      <Input
        type="text"
        value={newCustomField.value}
        onChange={(e) => setNewCustomField({ ...newCustomField, value: e.target.value })}
        placeholder="Value"
      />
      <Label>
        <input
          type="checkbox"
          checked={newCustomField.mandatory}
          onChange={(e) => setNewCustomField({ ...newCustomField, mandatory: e.target.checked })}
        />
        Mandatory
      </Label>
      <Select
        multiple
        value={selectedJobPosts}
        onChange={(e) =>
          setSelectedJobPosts([...e.target.options].filter(option => option.selected).map(option => option.value))
        }
      >
        {jobPosts.map((job) => (
          <option key={job._id} value={job._id}>
            {job.title}
          </option>
        ))}
      </Select>
      <Button onClick={addCustomField}>Add Field</Button>

      <h3>Job Posts</h3>
      <Table>
        <thead>
          <tr>
            <Th>Job Title</Th>
            <Th>Custom Fields</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {jobPosts.map((job) => (
            <tr key={job._id}>
              <Td>{job.title}</Td>
              <Td>
                {job.customFields.map((field) => (
                  <div key={field._id}>
                    {field.label}: {field.value}
                  </div>
                ))}
              </Td>
              <Td>
                {job.customFields.map((field) => (
                  <div key={field._id}>
                    <Button onClick={() => deleteCustomField(job._id, field._id)}>Delete</Button>
                  </div>
                ))}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </DashboardContainer>
  );
};

export default AdminDashboard;
