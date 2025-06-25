import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import "./Member.css";
import axios from 'axios';


// const BASE_URL = "https://iceu.onrender.com";
// const BASE_URL = "http://localhost:5000";


const TeamManager = () => {
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    // console.log("roles updated:", roles);
  }, [roles]);
  

  useEffect(() => {
    axios.get(`/members`)
      .then(response => {
        const grouped = response.data.reduce((acc, member) => {
          const roleName = member.role;
          const priority = member.priority || 0;
  
          if (!acc[roleName]) {
            acc[roleName] = {
              name: roleName,
              priority,
              members: []
            };
          }
  
          acc[roleName].members.push(member);
          return acc;
        }, {});
  
        const groupedRoles = Object.values(grouped);
        setRoles(groupedRoles);
      })
      .catch(error => {
        console.error('Error fetching members:', error);
      });
  }, []);
  

  const handleAddMember = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const role = formData.get('role');
    const priority = parseInt(formData.get('priority'));
    const name = formData.get('name');
    const description = formData.get('description');
    const photo = formData.get('photo');

    const requestData = new FormData();
    requestData.append('role', role);
    requestData.append('priority', priority);
    requestData.append('name', name);
    requestData.append('description', description);
    requestData.append('photo', photo);

    try {
      const response = await axios.post(`${ BASE_URL }/members/add`, requestData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const savedMember = response.data; // this should include _id and photo URL

      
     
      setRoles(prevRoles => {
        const existingRole = prevRoles.find(r => r.name === role);
        const updatedRoles = existingRole
          ? prevRoles.map(r => 
              r.name === role 
                ? { ...r, members: [...r.members, savedMember] }
                : r
            )
          : [
              ...prevRoles,
              {
                name: role,
                priority,
                members: [savedMember]
              }
            ];
        
            
        return updatedRoles;
      });
      

      setShowForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };


  const handleDeleteMember = async (roleName, memberId) => {
    try {
      
      // Send DELETE request to backend
      const response = await axios.delete(`/members/delete/${memberId}`);
  
      // If successful, update local state
      if (response.status === 200) {
        setRoles(prevRoles =>
          prevRoles
            .map(role =>
              role.name === roleName
                ? { ...role, members: role.members.filter(m => m._id !== memberId) }
                : role
            )
            .filter(role => role.members.length > 0) // remove empty roles
        );
      }
    } catch (error) {
      console.error('Failed to delete member:', error);
      // Optionally show an error message to the user
    }
  };
  

  const handleEditMember = (roleName, memberId) => {
    const role = roles.find(r => r.name === roleName);
    const member = role.members.find(m => m._id === memberId);
   
    setSelectedMember({ ...member, roleName });
    console.log(selectedMember);
    setIsEditing(true); // Mark as editing
    setShowForm(true); // Show form
  };

  const handleCloseDetails = () => {
    setSelectedMember(null);
    setIsEditing(false);
    setShowForm(false);
  };

 

  const handleUpdateMember = async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const role = formData.get('role');
    const priority = parseInt(formData.get('priority')) || 0;
    const name = formData.get('name');
    const description = formData.get('description');
    const photoFile = formData.get('photo');
  
    const updateForm = new FormData();
    updateForm.append('role', role);
    updateForm.append('priority', priority);
    updateForm.append('name', name);
    updateForm.append('description', description);
    if (photoFile && photoFile.size > 0) {
      updateForm.append('photo', photoFile);
    }
  
    try {
      
      const response = await axios.put(
        `/members/${selectedMember._id}`,
        updateForm,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      const updatedMember = response.data;
      
  
      setRoles((prevRoles) =>
        prevRoles.map((roleObj) =>
          roleObj.name === role
            ? {
                ...roleObj,
                members: roleObj.members.map((member) =>
                  member._id === selectedMember._id ? updatedMember : member
                ),
              }
            : roleObj
        )
      );
  
      handleCloseDetails(); // Close the form after update
    } catch (error) {
      console.error('Failed to update member:', error);
    }
  };
  

  return (
    <div className="members-container">
      <h1 className="members-title">Team Members</h1>
      <button onClick={() => { setShowForm(true); setIsEditing(false); }} className="members-add-btn">Add Member</button>

      {showForm && (
        <form onSubmit={isEditing ? handleUpdateMember : handleAddMember} className="members-form">
          {/* {isEditing ? console.log(selectedMember.priority): console.log("null")} */}
          <input
            name="role"
            placeholder="Role Name"
            required
            className="members-input"
            defaultValue={isEditing && selectedMember ? selectedMember.roleName : ''} 
            list="role-options"
          />

          <datalist id="role-options">
            <option value="President" />
            <option value="Secretary" />
            <option value="Treasurer" />
            <option value="Prayer Secretary" />
            <option value="Outreach Secretary" />
            <option value="Cell care secretary" />
            <option value="Literature Secretary" />
            <option value="Music Secretary" />
            <option value="Representative" />
            <option value="Senior advisor family" />
            <option value="Young Graduate senior advisor" />
            <option value="Students ministry Secretary" />
            <option value="Staff worker" />
          </datalist>

          <input 
            name="priority" 
            type="number" 
            placeholder="Priority" 
            required 
            className="members-input" 
            defaultValue={isEditing && selectedMember ? selectedMember.priority : 0} 
          />
          <input 
            name="name" 
            placeholder="Member Name" 
              required 
            className="members-input" 
            defaultValue={isEditing && selectedMember ? selectedMember.name : ''} 
          />
          <textarea 
            name="description" 
            placeholder="Description" 
            required 
            className="members-textarea" 
            defaultValue={isEditing && selectedMember ? selectedMember.description : ''} 
          />

          <input 
            name="photo" 
            type="file" 
            accept="image/*" 
            className="members-file"  
          />
          <div className="members-form-actions">
            <button type="submit" className="members-save-btn">{isEditing ? 'Update' : 'Save'}</button>
            <button onClick={handleCloseDetails} type="button" className="members-cancel-btn">Cancel</button>
          </div>
        </form>
      )}
      <div className='members-whole-section'>
      {roles
        .sort((a, b) => a.priority - b.priority)
        .map(role => (
          <div key={role.name} className="members-role-section">
            <h2 className="members-role-title">{role.name}</h2>
            <div className="members-role-grid">
              {role.members.map(member => (
                
                <div key={member._id} className="members-member-card">
                  
                  <img
                    src={
                      member.photo.includes("https")
                        ? member.photo
                        : `/${member.photo}`
                    }
                    alt={member.name}
                    className="members-member-photo"
                    onClick={() => setSelectedMember({ ...member, roleName: role.name })}
                  />
                  <p className="members-member-name">{member.name}</p>
                  <div className="members-actions">
                    <FaEdit
                      className="members-icon edit-icon"
                      onClick={() => handleEditMember(role.name, member._id)}
                    />
                    <FaTrash
                      className="members-icon delete-icon"
                      onClick={() => handleDeleteMember(role.name, member._id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
{selectedMember && !isEditing && (
  <div className="members-overlay">
    <div className="members-detail-card">
      <img
        src={
          selectedMember.photo.startsWith("http")
            ? selectedMember.photo
            : `${selectedMember.photo}`
        }
        alt={selectedMember.name}
        className="members-detail-photo"
      />
      <h2 className="members-detail-name">{selectedMember.name}</h2>
      <h3 className="members-detail-role">{selectedMember.roleName}</h3>
      <p className="members-detail-desc">{selectedMember.description}</p>
      <button
        onClick={handleCloseDetails}
        className="members-detail-close"
      >
        ×
      </button>
    </div>
  </div>
)}


    </div>
  );
};

export default TeamManager;
