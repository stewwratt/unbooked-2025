import React, { useState } from 'react';
import './StepStyles.css';

const TeamInvitationsStep = ({ data, onNext, onBack, onSkip, isLoading }) => {
    const [teamMembers, setTeamMembers] = useState(data.teamMembers || []);

    const handleAddTeamMember = () => {
        // Implementation of adding a new team member
        console.log('Adding a new team member');
    };

    return (
        <div className="step-form team-invitations-step">
            <h2 className="step-title">Team Members</h2>
            <p className="step-description">
                Add team members to your provider profile.
            </p>

            <div className="team-member-list">
                {teamMembers.map((member, index) => (
                    <div key={index} className="team-member-item">
                        <span className="member-name">{member.name}</span>
                        <span className="member-email">{member.email}</span>
                    </div>
                ))}
            </div>

            <button
                type="button"
                className="add-button"
                onClick={handleAddTeamMember}
            >
                + Add Another Team Member
            </button>

            <div className="form-actions">
                <button
                    type="button"
                    className="secondary-button"
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    type="button"
                    className="secondary-button"
                    onClick={onSkip}
                >
                    I'm a solo provider
                </button>
                <button
                    type="submit"
                    className="primary-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Next: Review & Finish'}
                </button>
            </div>
        </div>
    );
};

export default TeamInvitationsStep; 